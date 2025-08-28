import {
    DefaultObservableValue,
    MappedMutableObservableValue,
    MutableObservableValue,
    Option,
    Terminable,
    Terminator,
    UUID
} from "@opendaw/lib-std"
import {AudioUnitBox} from "@opendaw/studio-boxes"
import {CaptureBox} from "@opendaw/studio-adapters"

import {RecordingContext} from "./RecordingContext"
import {CaptureManager} from "./CaptureManager"

/**
 * Base class for audio or MIDI capture units. A {@link Capture} wraps a
 * {@link CaptureBox} and manages device selection and arming state for the
 * associated {@link AudioUnitBox}.
 */
export abstract class Capture<BOX extends CaptureBox = CaptureBox> implements Terminable {
    readonly #terminator = new Terminator()

    readonly #manager: CaptureManager
    readonly #audioUnitBox: AudioUnitBox
    readonly #captureBox: BOX

    readonly #deviceId: MutableObservableValue<Option<string>>
    readonly #armed: DefaultObservableValue<boolean>

    /**
     * @param manager      Parent {@link CaptureManager} instance.
     * @param audioUnitBox The audio unit this capture belongs to.
     * @param captureBox   Backing box containing persisted capture settings.
     */
    protected constructor(manager: CaptureManager, audioUnitBox: AudioUnitBox, captureBox: BOX) {
        this.#manager = manager
        this.#audioUnitBox = audioUnitBox
        this.#captureBox = captureBox

        this.#deviceId = new MappedMutableObservableValue<string, Option<string>>(captureBox.deviceId, {
            fx: x => x.length > 0 ? Option.wrap(x) : Option.None,
            fy: y => y.match({none: () => "", some: x => x})
        })

        this.#armed = this.#terminator.own(new DefaultObservableValue(false))
        this.#terminator.ownAll(
            this.#captureBox.deviceId.catchupAndSubscribe(owner => {
                const id = owner.getValue()
                this.#deviceId.setValue(id.length > 0 ? Option.wrap(id) : Option.None)
            })
        )
    }

    /** Human readable label of the current device, if available. */
    abstract get deviceLabel(): Option<string>
    /** Prepare the capture source for recording (e.g. open streams). */
    abstract prepareRecording(context: RecordingContext): Promise<void>
    /** Begin capturing and return a handle that stops the session when terminated. */
    abstract startRecording(context: RecordingContext): Terminable

    /** UUID of the owning {@link AudioUnitBox}. */
    get uuid(): UUID.Format {return this.#audioUnitBox.address.uuid}
    /** Owning manager for this capture. */
    get manager(): CaptureManager {return this.#manager}
    /** The {@link AudioUnitBox} that this capture wraps. */
    get audioUnitBox(): AudioUnitBox {return this.#audioUnitBox}
    /** Underlying {@link CaptureBox} containing state. */
    get captureBox(): BOX {return this.#captureBox}
    /** Observable arming state. */
    get armed(): MutableObservableValue<boolean> {return this.#armed}
    /** Observable selected device id. */
    get deviceId(): MutableObservableValue<Option<string>> {return this.#deviceId}

    /** Register a terminable that is disposed with this capture. */
    own<T extends Terminable>(terminable: T): T {return this.#terminator.own(terminable)}
    /** Register multiple terminables to be disposed with this capture. */
    ownAll<T extends Terminable>(...terminables: ReadonlyArray<T>): void {this.#terminator.ownAll(...terminables)}
    /** Clean up all resources associated with this capture. */
    terminate(): void {this.#terminator.terminate()}
}