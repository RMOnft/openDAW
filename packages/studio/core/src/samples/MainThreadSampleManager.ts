import {Progress, SortedSet, UUID} from "@opendaw/lib-std"
import {AudioData, SampleLoader, SampleManager, SampleMetaData} from "@opendaw/studio-adapters"
import {MainThreadSampleLoader} from "./MainThreadSampleLoader"
import {SampleProvider} from "./SampleProvider"

/**
 * Concrete {@link SampleManager} for the browser main thread.
 *
 * Keeps track of {@link MainThreadSampleLoader} instances and proxies fetch
 * requests to a backing {@link SampleProvider} implementation.
 */
export class MainThreadSampleManager implements SampleManager, SampleProvider {
    readonly #api: SampleProvider
    readonly #context: AudioContext
    readonly #loaders: SortedSet<UUID.Format, SampleLoader>

    /**
     * Create a new manager.
     *
     * @param api provider used to fetch sample data from network or cache
     * @param context audio context used for decoding
     */
    constructor(api: SampleProvider, context: AudioContext) {
        this.#api = api
        this.#context = context
        this.#loaders = UUID.newSet(loader => loader.uuid)
    }

    get context(): AudioContext {return this.#context}

    /**
     * Fetch sample data from the backing provider.
     *
     * @param uuid identifier of the requested sample
     * @param progress receives loading progress between 0 and 1
     * @returns audio data and metadata for the sample
     */
    fetch(uuid: UUID.Format, progress: Progress.Handler): Promise<[AudioData, SampleMetaData]> {
        return this.#api.fetch(uuid, progress)
    }

    /**
     * Invalidate the loader for a given sample.
     *
     * @param uuid sample to invalidate
     * @returns void
     */
    invalidate(uuid: UUID.Format) {this.#loaders.opt(uuid).ifSome(loader => loader.invalidate())}

    /**
     * Register a loader with the manager so it can be invalidated later.
     *
     * @param loader loader instance to track
     * @returns void
     */
    record(loader: SampleLoader): void {this.#loaders.add(loader)}

    /**
     * Retrieve an existing loader or create a new one.
     *
     * @param uuid identifier of the desired sample
     * @returns corresponding loader instance
     */
    getOrCreate(uuid: UUID.Format): SampleLoader {
        return this.#loaders.getOrCreate(uuid, uuid => new MainThreadSampleLoader(this, uuid))
    }
}
