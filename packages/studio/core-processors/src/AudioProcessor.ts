import {Event, PPQN} from "@opendaw/lib-dsp"
import {assert, int, Nullish, panic} from "@opendaw/lib-std"
import {Block, ProcessInfo} from "./processing"
import {AbstractProcessor} from "./AbstractProcessor"
import {UpdateEvent} from "./UpdateClock"
import {EngineContext} from "./EngineContext"

/**
 * Convenience base class for processors that output audio.
 *
 * It slices the render quantum into segments based on scheduled events and
 * delegates audio rendering to {@link processAudio}.
 */
export abstract class AudioProcessor extends AbstractProcessor {
    protected constructor(context: EngineContext) {
        super(context)
    }

    /**
     * Processes all scheduled events and renders audio for each block.
     */
    process({blocks}: ProcessInfo): void {
        blocks.forEach((block) => {
            this.introduceBlock(block)
            const {index, p0, s0, s1, bpm} = block
            let anyEvents: Nullish<Array<Event>> = null
            let fromIndex = s0
            for (const event of this.eventInput.get(index)) {
                const pulses = event.position - p0
                const toIndex = Math.abs(pulses) < 1.0e-7 ? s0 : s0 + Math.floor(PPQN.pulsesToSamples(pulses, bpm, sampleRate))
                assert(s0 <= toIndex && toIndex <= s1, () => `${toIndex} out of bounds. event: ${event.position} (${event.type}), p0: ${p0}`)
                anyEvents?.forEach(event => this.handleEvent(event))
                anyEvents = null
                if (fromIndex < toIndex) {
                    this.processAudio(block, fromIndex, toIndex)
                    fromIndex = toIndex
                }
                if (UpdateEvent.isOfType(event)) {
                    this.updateParameter(event.position)
                } else {
                    (anyEvents ??= []).push(event)
                }
            }
            anyEvents?.forEach(event => this.handleEvent(event))
            anyEvents = null
            if (fromIndex < s1) {
                this.processAudio(block, fromIndex, s1)
            }
        })
        this.eventInput.clear()
        this.finishProcess()
    }

    /**
     * Renders audio samples for the given range of the current block.
     */
    abstract processAudio(block: Block, fromIndex: int, toIndex: int): void

    /**
     * Hook executed before processing the first event in a block.
     */
    introduceBlock(_block: Block): void {}

    /**
     * Handles non-update events routed to this processor.
     */
    handleEvent(_event: Event): void {return panic(`${this} received an event but has no accepting method.`)}

    /**
     * Hook executed after all blocks have been processed.
     */
    finishProcess(): void {}
}