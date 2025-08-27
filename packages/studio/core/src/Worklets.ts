/**
 * Factory responsible for installing and creating audio worklet nodes
 * used by the studio engine.
 */
import {asDefined, int} from "@opendaw/lib-std"
import {ExportStemsConfiguration, RingBuffer} from "@opendaw/studio-adapters"
import {EngineWorklet} from "./EngineWorklet"
import {MeterWorklet} from "./MeterWorklet"
import {RecordingWorklet} from "./RecordingWorklet"
import {Project} from "./Project"
import {RenderQuantum} from "./RenderQuantum"

/**
 * Manages installation and instantiation of worklet nodes for metering,
 * engine control and recording.
 */
export class Worklets {
    /** Loads the bundled worklet processors into the given audio context. */
    static async install(context: BaseAudioContext, workletURL: string): Promise<Worklets> {
        return context.audioWorklet.addModule(workletURL).then(() => {
            const worklets = new Worklets(context)
            this.#map.set(context, worklets)
            return worklets
        })
    }

    static get(context: BaseAudioContext): Worklets {return asDefined(this.#map.get(context), "Worklets not installed")}

    static #map: WeakMap<BaseAudioContext, Worklets> = new WeakMap<AudioContext, Worklets>()

    readonly #context: BaseAudioContext

    constructor(context: BaseAudioContext) {this.#context = context}

    /** Creates a {@link MeterWorklet} for monitoring levels. */
    createMeter(numberOfChannels: int): MeterWorklet {
        return new MeterWorklet(this.#context, numberOfChannels)
    }

    /** Creates the main {@link EngineWorklet} instance. */
    createEngine(project: Project, exportConfiguration?: ExportStemsConfiguration): EngineWorklet {
        return new EngineWorklet(this.#context, project, exportConfiguration)
    }

    /**
     * Creates a {@link RecordingWorklet} backed by a shared ring buffer.
     */
    createRecording(numberOfChannels: int, numChunks: int, outputLatency: number): RecordingWorklet {
        const audioBytes = numberOfChannels * numChunks * RenderQuantum * Float32Array.BYTES_PER_ELEMENT
        const pointerBytes = Int32Array.BYTES_PER_ELEMENT * 2
        const sab = new SharedArrayBuffer(audioBytes + pointerBytes)
        const buffer: RingBuffer.Config = {sab, numChunks, numberOfChannels, bufferSize: RenderQuantum}
        return new RecordingWorklet(this.#context, buffer, outputLatency)
    }
}

