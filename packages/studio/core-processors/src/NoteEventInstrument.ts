import {Block, Processor} from "./processing"
import {Event} from "@opendaw/lib-dsp"
import {NoteEventSource, NoteLifecycleEvent} from "./NoteEventSource"
import {assert, Option, Terminable, Terminator} from "@opendaw/lib-std"
import {NoteBroadcaster} from "@opendaw/studio-adapters"
import {Address} from "@opendaw/lib-box"
import {LiveStreamBroadcaster} from "@opendaw/lib-fusion"

/**
 * Bridges {@link NoteEventSource} instances into processors by converting the
 * emitted note events into scheduled events and visual feedback.
 */
export class NoteEventInstrument implements Terminable {
    readonly #terminator = new Terminator()
    readonly #receiver: Processor
    readonly #broadcaster: NoteBroadcaster

    #source: Option<NoteEventSource> = Option.None

    /**
     * @param receiver - processor receiving generated note events
     * @param broadcaster - stream broadcaster used for visualization
     * @param address - address for note broadcast messages
     */
    constructor(receiver: Processor, broadcaster: LiveStreamBroadcaster, address: Address) {
        this.#receiver = receiver

        this.#broadcaster = this.#terminator.own(new NoteBroadcaster(broadcaster, address))
    }

    /**
     * Connects a {@link NoteEventSource} to this instrument.
     */
    setNoteEventSource(source: NoteEventSource): Terminable {
        assert(this.#source.isEmpty(), "NoteEventSource already set")
        this.#source = Option.wrap(source)
        this.#receiver.reset() // TODO Hope we find a less intrusive solution later
        return Terminable.create(() => {
            this.#source = Option.None
            this.#receiver.reset()
        })
    }

    /**
     * Fetches note events for the block and forwards them to the receiver.
     */
    introduceBlock({index, p0, p1, flags}: Block): void {
        if (this.#source.isEmpty()) {return}
        for (const event of this.#source.unwrap().processNotes(p0, p1, flags)) {
            if (event.pitch >= 0 && event.pitch <= 127) {
                this.#receiver.eventInput.add(index, event)
                this.#showEvent(event)
            }
        }
    }

    clear(): void {}

    terminate(): void {this.#terminator.terminate()}

    #showEvent(event: Event): void {
        if (NoteLifecycleEvent.isStart(event)) {
            this.#broadcaster.noteOn(event.pitch)
        } else if (NoteLifecycleEvent.isStop(event)) {
            this.#broadcaster.noteOff(event.pitch)
        }
    }
}