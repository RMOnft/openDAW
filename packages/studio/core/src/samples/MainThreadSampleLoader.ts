import {
    ByteArrayInput,
    Exec,
    int,
    Notifier,
    Observer,
    Option,
    Progress,
    Subscription,
    Terminable,
    UUID
} from "@opendaw/lib-std"
import {Peaks, SamplePeaks} from "@opendaw/lib-fusion"
import {Promises} from "@opendaw/lib-runtime"
import {AudioData, SampleLoader, SampleLoaderState, SampleMetaData} from "@opendaw/studio-adapters"
import JSZip from "jszip"
import {MainThreadSampleManager} from "./MainThreadSampleManager"
import {WorkerAgents} from "../WorkerAgents"
import {SampleStorage} from "./SampleStorage"

/**
 * Loads sample data on the main thread and caches it in {@link SampleStorage}.
 *
 * Acts as a thin wrapper around the asynchronous fetch and decode pipeline,
 * exposing the current {@link SampleLoaderState} to observers. Instances are
 * created and tracked by {@link MainThreadSampleManager}.
 */
export class MainThreadSampleLoader implements SampleLoader {
    readonly #manager: MainThreadSampleManager

    readonly #uuid: UUID.Format
    readonly #notifier: Notifier<SampleLoaderState>

    #meta: Option<SampleMetaData> = Option.None
    #data: Option<AudioData> = Option.None
    #peaks: Option<Peaks> = Option.None
    #state: SampleLoaderState = {type: "progress", progress: 0.0}
    #version: int = 0

    /**
     * Create a new loader for the given sample.
     *
     * @param manager owning sample manager used for fetching data
     * @param uuid identifier of the sample to load
     */
    constructor(manager: MainThreadSampleManager, uuid: UUID.Format) {
        this.#manager = manager
        this.#uuid = uuid

        this.#notifier = new Notifier<SampleLoaderState>()
        this.#get()
    }

    /**
     * Drop any cached data and restart the loading process.
     */
    invalidate(): void {
        this.#state = {type: "progress", progress: 0.0}
        this.#meta = Option.None
        this.#data = Option.None
        this.#peaks = Option.None
        this.#version++
        this.#get()
    }

    /**
     * Subscribe to state changes.
     *
     * @param observer callback receiving loader state updates
     */
    subscribe(observer: Observer<SampleLoaderState>): Subscription {
        if (this.#state.type === "loaded") {
            observer(this.#state)
            return Terminable.Empty
        }
        return this.#notifier.subscribe(observer)
    }

    /** Identifier of the loaded sample. */
    get uuid(): UUID.Format {return this.#uuid}
    /** Loaded audio data, if available. */
    get data(): Option<AudioData> {return this.#data}
    /** Metadata describing the sample. */
    get meta(): Option<SampleMetaData> {return this.#meta}
    /** Peak information used for waveform rendering. */
    get peaks(): Option<Peaks> {return this.#peaks}
    /** Current state of the loader. */
    get state(): SampleLoaderState {return this.#state}

    /**
     * Append the sample files to a ZIP archive.
     *
     * If loading has not yet completed the promise resolves once data becomes
     * available.
     *
     * @param zip ZIP archive that receives the sample's audio, peaks and
     * metadata files.
     * @returns Promise that resolves when the files have been written to the
     * archive.
     */
    async pipeFilesInto(zip: JSZip): Promise<void> {
        const exec: Exec = async () => {
            const path = `${SampleStorage.Folder}/${UUID.toString(this.#uuid)}`
            zip.file("audio.wav", await WorkerAgents.Opfs.read(`${path}/audio.wav`), {binary: true})
            zip.file("peaks.bin", await WorkerAgents.Opfs.read(`${path}/peaks.bin`), {binary: true})
            zip.file("meta.json", await WorkerAgents.Opfs.read(`${path}/meta.json`))
        }
        if (this.#state.type === "loaded") {
            return exec()
        } else {
            return new Promise<void>((resolve, reject) => {
                const subscription = this.#notifier.subscribe((state) => {
                    if (state.type === "loaded") {
                        resolve()
                        subscription.terminate()
                    } else if (state.type === "error") {
                        reject(state.reason)
                        subscription.terminate()
                    }
                })
            }).then(() => exec())
        }
    }

    toString(): string {return `{MainThreadSampleLoader}`}

    #setState(value: SampleLoaderState): void {
        this.#state = value
        this.#notifier.notify(this.#state)
    }

    #get(): void {
        const version = this.#version
        SampleStorage.load(this.#uuid, this.#manager.context)
            .then(
                ([data, peaks, meta]) => {
                    if (this.#version !== version) {
                        console.warn(`Ignore obsolete version: ${this.#version} / ${version}`)
                        return
                    }
                    this.#data = Option.wrap(data)
                    this.#meta = Option.wrap(meta)
                    this.#peaks = Option.wrap(peaks)
                    this.#setState({type: "loaded"})
                },
                (error: any) => {
                    if (error instanceof Error && error.message.startsWith("timeoout")) {
                        this.#setState({type: "error", reason: error.message})
                        return console.warn(`Sample ${UUID.toString(this.#uuid)} timed out.`)
                    } else {
                        return this.#fetch()
                    }
                })
    }

    async #fetch(): Promise<void> {
        const version: int = this.#version
        const [fetchProgress, peakProgress] = Progress.split(progress => this.#setState({
            type: "progress",
            progress: 0.1 + 0.9 * progress
        }), 2)
        const fetchResult = await Promises.tryCatch(this.#manager.fetch(this.#uuid, fetchProgress))
        if (this.#version !== version) {return}
        if (fetchResult.status === "rejected") {
            console.warn(fetchResult.error)
            this.#setState({type: "error", reason: "Error: N/A"})
            return
        }
        const [audio, meta] = fetchResult.value
        const shifts = SamplePeaks.findBestFit(audio.numberOfFrames)
        const peaks = await WorkerAgents.Peak.generateAsync(
            peakProgress,
            shifts,
            audio.frames,
            audio.numberOfFrames,
            audio.numberOfChannels) as ArrayBuffer
        const storeResult = await Promises.tryCatch(SampleStorage.store(this.#uuid, audio, peaks, meta))
        if (this.#version !== version) {return}
        if (storeResult.status === "resolved") {
            this.#data = Option.wrap(audio)
            this.#meta = Option.wrap(meta)
            this.#peaks = Option.wrap(SamplePeaks.from(new ByteArrayInput(peaks)))
            this.#setState({type: "loaded"})
        } else {
            console.warn(storeResult.error)
            this.#setState({type: "error", reason: "N/A"})
        }
    }
}
