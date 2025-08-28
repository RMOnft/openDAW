import {asInstanceOf, isDefined, Nullish, Option, SortedSet, Subscription, Terminable, UUID} from "@opendaw/lib-std"
import {AudioUnitBox, BoxVisitor, CaptureAudioBox, CaptureMidiBox} from "@opendaw/studio-boxes"
import {Project} from "../Project"
import {Capture} from "./Capture"
import {CaptureMidi} from "./CaptureMidi"
import {CaptureAudio} from "./CaptureAudio"

/**
 * Tracks all {@link Capture} instances within a {@link Project}. The manager
 * observes the project's audio units and creates the appropriate capture
 * implementation for each unit.
 */
export class CaptureManager implements Terminable {
    readonly #project: Project
    readonly #subscription: Subscription
    readonly #captures: SortedSet<UUID.Format, Capture>

    /**
     * @param project Project owning the capture devices.
     */
    constructor(project: Project) {
        this.#project = project
        this.#captures = UUID.newSet<Capture>(unit => unit.uuid)
        this.#subscription = this.#project.rootBox.audioUnits.pointerHub.catchupAndSubscribeTransactual({
            onAdd: ({box}) => {
                const audioUnitBox = asInstanceOf(box, AudioUnitBox)
                const capture: Nullish<Capture> = audioUnitBox.capture.targetVertex
                    .ifSome(({box}) => box.accept<BoxVisitor<Capture>>({
                        visitCaptureMidiBox: (box: CaptureMidiBox) => new CaptureMidi(this, audioUnitBox, box),
                        visitCaptureAudioBox: (box: CaptureAudioBox) => new CaptureAudio(this, audioUnitBox, box)
                    }))
                if (isDefined(capture)) {this.#captures.add(capture)}
            },
            onRemove: ({box: {address: {uuid}}}) => this.#captures.removeByKeyIfExist(uuid)?.terminate()
        })
    }

    /** Owning project. */
    get project(): Project {return this.#project}

    /** Lookup a capture by the UUID of its audio unit. */
    get(uuid: UUID.Format): Option<Capture> {return this.#captures.opt(uuid)}

    /**
     * Return all captures that are armed and connected to an input.
     */
    filterArmed(): ReadonlyArray<Capture> {
        return this.#captures.values()
            .filter(capture => capture.armed.getValue() && capture.audioUnitBox.input.pointerHub.nonEmpty())
    }

    /** Dispose all captures and internal subscriptions. */
    terminate(): void {
        this.#subscription.terminate()
        this.#captures.forEach(capture => capture.terminate())
        this.#captures.clear()
    }
}