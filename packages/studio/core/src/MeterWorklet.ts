import {int, Notifier, Observer, Schema, Subscription, SyncStream, Terminable, Terminator} from "@opendaw/lib-std"
import {AnimationFrame} from "@opendaw/lib-dom"
import {PeakMeterProcessorOptions} from "@opendaw/studio-adapters"

/**
 * Shape of the data emitted by the meter worklet, containing peak and RMS
 * values for each channel.
 */
export type PeakSchema = { peak: Float32Array, rms: Float32Array }

/**
 * Audio worklet node that forwards peak and RMS information from its
 * processor.
 *
 * The underlying processing happens off the main thread and communicates
 * back via a {@link SyncStream} so UI components can observe meter values
 * without blocking rendering.
 */
export class MeterWorklet extends AudioWorkletNode implements Terminable {
    readonly #terminator: Terminator = new Terminator()
    readonly #notifier: Notifier<PeakSchema> = this.#terminator.own(new Notifier<PeakSchema>())

    /**
     * @param context - Audio context to attach to.
     * @param numberOfChannels - Number of audio channels to meter.
     */
    constructor(context: BaseAudioContext, numberOfChannels: int) {
        const receiver = SyncStream.reader(Schema.createBuilder({
            peak: Schema.floats(numberOfChannels),
            rms: Schema.floats(numberOfChannels)
        })(), (data: PeakSchema) => this.#notifier.notify(data))
        super(context, "meter-processor", {
            numberOfInputs: 1,
            channelCount: numberOfChannels,
            channelCountMode: "explicit",
            processorOptions: {
                sab: receiver.buffer,
                numberOfChannels,
                rmsWindowInSeconds: 0.100,
                valueDecay: 0.200
            } satisfies PeakMeterProcessorOptions
        })
        this.#terminator.ownAll(
            AnimationFrame.add(() => receiver.tryRead())
        )
    }

    /** Subscribe to receive metering updates. */
    subscribe(observer: Observer<PeakSchema>): Subscription {return this.#notifier.subscribe(observer)}
    /** Terminates the worklet and releases resources. */
    terminate(): void {this.#terminator.terminate()}
}
