/**
 * Audio worklet node that records incoming audio into a ring buffer while
 * generating waveform peaks.
 */
import {
    Arrays,
    assert,
    ByteArrayInput,
    int,
    isUndefined,
    Notifier,
    Nullable,
    Observer,
    Option,
    Progress,
    Subscription,
    Terminable,
    UUID
} from "@opendaw/lib-std"
import {
    AudioData,
    mergeChunkPlanes,
    RingBuffer,
    SampleLoader,
    SampleLoaderState,
    SampleMetaData
} from "@opendaw/studio-adapters"
import {Peaks, SamplePeaks, SamplePeakWorker} from "@opendaw/lib-fusion"
import {RenderQuantum} from "./RenderQuantum"
import {WorkerAgents} from "./WorkerAgents"
import {SampleStorage} from "./samples/SampleStorage"
import {BPMTools} from "@opendaw/lib-dsp"

class PeaksWriter implements Peaks, Peaks.Stage {
    readonly data: ReadonlyArray<Int32Array>
    readonly stages: ReadonlyArray<Peaks.Stage>
    readonly dataOffset: int = 0
    readonly shift: int = 7
    readonly dataIndex: Int32Array

    numFrames: int = 0 | 0

    constructor(readonly numChannels: int) {
        this.data = Arrays.create(() => new Int32Array(1 << 20), numChannels) // TODO auto-resize
        this.dataIndex = new Int32Array(numChannels)
        this.stages = [this]
    }

    get numPeaks(): int {return Math.ceil(this.numFrames / (1 << this.shift))}
    unitsEachPeak(): int {return 1 << this.shift}

    append(frames: ReadonlyArray<Float32Array>): void {
        for (let channel = 0; channel < this.numChannels; ++channel) {
            const channelFrames = frames[channel]
            assert(channelFrames.length === RenderQuantum, "Invalid number of frames.")
            let min = Number.POSITIVE_INFINITY
            let max = Number.NEGATIVE_INFINITY
            for (let i = 0; i < RenderQuantum; ++i) {
                const frame = channelFrames[i]
                min = Math.min(frame, min)
                max = Math.max(frame, max)
            }
            this.data[channel][this.dataIndex[channel]++] = SamplePeakWorker.pack(min, max)
        }
        this.numFrames += RenderQuantum
    }

    nearest(_unitsPerPixel: number): Nullable<Peaks.Stage> {return this.stages.at(0) ?? null}
}

/**
 * Captures audio from its input and exposes recorded data along with peak
 * information. Recording is performed in the audio worklet thread while the
 * class provides a loader style interface for retrieving the resulting
 * {@link AudioData} and peak information.
 */
export class RecordingWorklet extends AudioWorkletNode implements Terminable, SampleLoader {
    readonly uuid: UUID.Format = UUID.generate()

    readonly #output: Array<ReadonlyArray<Float32Array>>
    readonly #notifier: Notifier<SampleLoaderState>
    readonly #reader: RingBuffer.Reader
    readonly #peakWriter: PeaksWriter

    #data: Option<AudioData> = Option.None
    #peaks: Option<Peaks> = Option.None
    #isRecording: boolean = true
    #truncateLatency: int
    #state: SampleLoaderState = {type: "record"}

    constructor(context: BaseAudioContext, config: RingBuffer.Config, outputLatency: number) {
        super(context, "recording-processor", {
            numberOfInputs: 1,
            channelCount: config.numberOfChannels,
            channelCountMode: "explicit",
            processorOptions: config
        })

        if (isUndefined(outputLatency)) {
            // TODO Talk to the user
            console.warn("outputLatency is undefined. Please use Chrome.")
        }

        this.#peakWriter = new PeaksWriter(config.numberOfChannels)

        this.#truncateLatency = Math.floor((outputLatency ?? 0) * this.context.sampleRate / RenderQuantum)
        this.#output = []
        this.#notifier = new Notifier<SampleLoaderState>()
        this.#reader = RingBuffer.reader(config, array => {
            if (this.#isRecording) {
                if (this.#truncateLatency === 0) {
                    this.#output.push(array)
                    this.#peakWriter.append(array)
                } else {
                    if (--this.#truncateLatency === 0) {
                        this.#peaks = Option.wrap(this.#peakWriter)
                    }
                }
            }
        })
    }

    /** Total number of frames recorded so far. */
    get numberOfFrames(): int {return this.#output.length * RenderQuantum}
    /** Recorded audio data once {@link finalize} has been called. */
    get data(): Option<AudioData> {return this.#data}
    /** Peak information for the recorded data if available. */
    get peaks(): Option<Peaks> {return this.#peaks}
    /** Loading state for consumers implementing {@link SampleLoader}. */
    get state(): SampleLoaderState {return this.#state}

    /** Part of {@link SampleLoader}; no-op for recordings. */
    invalidate(): void {}

    /**
     * Observe loader state changes. Once loaded, the observer is invoked
     * immediately and no subscription is kept.
     */
    subscribe(observer: Observer<SampleLoaderState>): Subscription {
        if (this.#state.type === "loaded") {
            observer(this.#state)
            return Terminable.Empty
        }
        return this.#notifier.subscribe(observer)
    }

    /**
     * Stops recording, builds the audio and peak data and stores it via
     * {@link SampleStorage}.
     */
    async finalize() {
        this.#reader.stop()
        this.#isRecording = false
        const sample_rate = this.context.sampleRate
        const numberOfFrames = this.#output.length * RenderQuantum
        const numberOfChannels = this.channelCount
        const frames = mergeChunkPlanes(this.#output, RenderQuantum, numberOfFrames)
        const audioData: AudioData = {
            sampleRate: sample_rate,
            numberOfChannels,
            numberOfFrames,
            frames
        }
        this.#data = Option.wrap(audioData)
        const shifts = SamplePeaks.findBestFit(numberOfFrames)
        const peaks = await WorkerAgents
            .Peak.generateAsync(Progress.Empty, shifts, frames, numberOfFrames, numberOfChannels)
        this.#peaks = Option.wrap(SamplePeaks.from(new ByteArrayInput(peaks)))
        const bpm = BPMTools.detect(frames[0], sample_rate)
        const duration = numberOfFrames / sample_rate
        const meta: SampleMetaData = {name: "Recording", bpm, sample_rate, duration}
        await SampleStorage.store(this.uuid, audioData, peaks as ArrayBuffer, meta)
        this.#setState({type: "loaded"})
    }

    /** Stop recording and release any buffered data. */
    terminate(): void {
        this.#reader.stop()
        this.#isRecording = false
    }

    toString(): string {return `{RecordingWorklet}`}

    #setState(value: SampleLoaderState): void {
        this.#state = value
        this.#notifier.notify(this.#state)
    }
}
