import {FloatArray, int, Lazy, Option, Procedure} from "@opendaw/lib-std"
import type {OpfsProtocol, SamplePeakProtocol} from "@opendaw/lib-fusion"
import {Entry} from "@opendaw/lib-fusion"
import {Communicator, Messenger} from "@opendaw/lib-runtime"

/**
 * Access points for services hosted in the shared worker.
 *
 * The application must call {@link WorkerAgents.install} with the URL of the
 * bundled worker script before any of the provided protocols can be used. Once
 * installed, the getters lazily connect to their respective message channels.
 *
 * Security note: Workers run with the same origin privileges as the main
 * thread. Only install worker bundles from trusted sources to avoid executing
 * untrusted code.
 */
export class WorkerAgents {
    /**
     * Installs the shared worker bundle and prepares the underlying
     * {@link Messenger} for communication.
     */
    static install(workerURL: string): void {
        console.debug("workerURL", workerURL)
        this.messenger = Option.wrap(Messenger.for(new Worker(workerURL, {type: "module"})))
    }

    /** Messenger connected to the worker, set by {@link install}. */
    static messenger: Option<Messenger> = Option.None

    /** Lazily obtains the sample peak protocol exposed by the worker. */
    @Lazy
    static get Peak(): SamplePeakProtocol {
        return Communicator
            .sender<SamplePeakProtocol>(this.messenger.unwrap("WorkerAgents are not installed").channel("peaks"),
                router => new class implements SamplePeakProtocol {
                    async generateAsync(
                        progress: Procedure<number>,
                        shifts: Uint8Array,
                        frames: ReadonlyArray<FloatArray>,
                        numFrames: int,
                        numChannels: int): Promise<ArrayBufferLike> {
                        return router.dispatchAndReturn(this.generateAsync, progress, shifts, frames, numFrames, numChannels)
                    }
                })
    }

    /** Lazily obtains the OPFS protocol exposed by the worker. */
    @Lazy
    static get Opfs(): OpfsProtocol {
        return Communicator
            .sender<OpfsProtocol>(this.messenger.unwrap("WorkerAgents are not installed").channel("opfs"),
                router => new class implements OpfsProtocol {
                    write(path: string, data: Uint8Array): Promise<void> {return router.dispatchAndReturn(this.write, path, data)}
                    read(path: string): Promise<Uint8Array> {return router.dispatchAndReturn(this.read, path)}
                    delete(path: string): Promise<void> {return router.dispatchAndReturn(this.delete, path)}
                    list(path: string): Promise<ReadonlyArray<Entry>> {return router.dispatchAndReturn(this.list, path)}
                })
    }
}
