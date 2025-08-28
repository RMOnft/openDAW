import {asInstanceOf, assert, Option, Terminable, Terminator, warn} from "@opendaw/lib-std"
import {Promises} from "@opendaw/lib-runtime"
import {RecordingContext} from "./RecordingContext"
import {AudioUnitBox} from "@opendaw/studio-boxes"
import {AudioUnitType} from "@opendaw/studio-enums"
import {InstrumentFactories} from "../InstrumentFactories"
import {Project} from "../Project"

/**
 * Coordinates the recording lifecycle. This singleton orchestrates capture
 * preparation, engine state and cleanup across multiple capture sources.
 */
export class Recording {
    /** Whether a recording session is currently active. */
    static get isRecording(): boolean {return this.#isRecording}

    /**
     * Start a new recording session using the supplied context.
     *
     * @param context Runtime objects used during recording.
     * @param countIn If `true`, the engine performs a count-in before
     *                recording starts.
     */
    static async start(context: RecordingContext, countIn: boolean): Promise<Terminable> {
        if (this.#isRecording) {
            return Promise.resolve(Terminable.Empty)
        }
        this.#isRecording = true
        assert(this.#instance.isEmpty(), "Recording already in progress")
        const {engine, project} = context
        this.#prepare(project)
        const {captureManager, editing} = project
        const terminator = new Terminator()
        const captures = captureManager.filterArmed()
        if (captures.length === 0) {
            this.#isRecording = false
            return warn("No track is armed for Recording")
        }
        const {status, error} =
            await Promises.tryCatch(Promise.all(captures.map(capture => capture.prepareRecording(context))))
        if (status === "rejected") {
            this.#isRecording = false
            return warn(`Could not prepare recording: ${error}`)
        }
        terminator.ownAll(...captures.map(capture => capture.startRecording(context)))
        engine.startRecording(countIn)
        const {isRecording, isCountingIn} = engine
        const stop = (): void => {
            if (isRecording.getValue() || isCountingIn.getValue()) {return}
            editing.mark()
            terminator.terminate()
            this.#isRecording = false
        }
        terminator.ownAll(
            engine.isRecording.subscribe(stop),
            engine.isCountingIn.subscribe(stop),
            Terminable.create(() => Recording.#instance = Option.None)
        )
        this.#instance = Option.wrap(new Recording())
        return terminator
    }

    /**
     * Ensure that at least one capture is armed before recording starts. If no
     * instruments exist a default Tape instrument will be created.
     */
    static #prepare({api, captureManager, editing, rootBox, userEditingManager}: Project): void {
        const captures = captureManager.filterArmed()
        const instruments = rootBox.audioUnits.pointerHub.incoming()
            .map(({box}) => asInstanceOf(box, AudioUnitBox))
            .filter(box => box.type.getValue() === AudioUnitType.Instrument)
        if (instruments.length === 0) {
            const {audioUnitBox} = editing
                .modify(() => api.createInstrument(InstrumentFactories.Tape))
                .unwrap("Could not create Tape")
            captureManager.get(audioUnitBox.address.uuid)
                .unwrap("Could not unwrap capture")
                .armed.setValue(true)
        } else if (captures.length === 0) {
            userEditingManager.audioUnit.get()
                .ifSome(({box: {address: {uuid}}}) =>
                    captureManager.get(uuid)
                        .ifSome(capture => capture.armed.setValue(true))) // auto arm editing audio-unit
        }
    }

    static #isRecording: boolean = false

    static #instance: Option<Recording> = Option.None

    private constructor() {}
}