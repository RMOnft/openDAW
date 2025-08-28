import {Arrays, assert, int, panic, Procedure} from "@opendaw/lib-std"

declare let document: any

/**
 * Utility for transferring planar audio data between threads using a shared
 * {@link SharedArrayBuffer}.  The same structure is used by the
 * {@link @opendaw/studio-core-processors#RecordingProcessor | RecordingProcessor}.
 */
export namespace RingBuffer {
    /**
     * Parameters describing the shared ring buffer layout.
     */
    export interface Config {
        /** Shared memory backing the ring buffer. */
        sab: SharedArrayBuffer
        /** Maximum number of chunks stored at any time. */
        numChunks: int
        /** Number of audio channels per chunk. */
        numberOfChannels: int
        /** Number of samples in each channel of a chunk. */
        bufferSize: int
    }

    /** Writes chunks of audio into the buffer. */
    export interface Writer {write(channels: ReadonlyArray<Float32Array>): void}

    /** Reads chunks from the buffer until {@link Reader.stop} is called. */
    export interface Reader {stop(): void}

    /**
     * Creates a reader that appends each chunk to the provided callback.
     *
     * @param config - Shared buffer configuration.
     * @param append - Callback receiving decoded channel data for each chunk.
     * @returns Reader that can be stopped to cease iteration.
     */
    export const reader = ({
                               sab,
                               numChunks,
                               numberOfChannels,
                               bufferSize
                           }: Config, append: Procedure<Array<Float32Array>>): Reader => {
        let running = true
        const pointers = new Int32Array(sab, 0, 2)
        const audio = new Float32Array(sab, 8)
        const planarChunk = new Float32Array(numberOfChannels * bufferSize)
        const canBlock = typeof document === "undefined" // for usage in workers
        const step = () => {
            if (!running) {return}
            let readPtr = Atomics.load(pointers, 1)
            let writePtr = Atomics.load(pointers, 0)
            if (readPtr === writePtr) {
                if (canBlock) {
                    Atomics.wait(pointers, 0, writePtr)
                } else {
                    setTimeout(step, 1)   // non‑blocking poll fallback
                    return
                }
                writePtr = Atomics.load(pointers, 0)
            }
            while (readPtr !== writePtr) {
                const offset = readPtr * numberOfChannels * bufferSize
                planarChunk.set(audio.subarray(offset, offset + numberOfChannels * bufferSize))
                const channels: Array<Float32Array> = []
                for (let channel = 0; channel < numberOfChannels; channel++) {
                    const start = channel * bufferSize
                    const end = start + bufferSize
                    channels.push(planarChunk.slice(start, end))
                }
                readPtr = (readPtr + 1) % numChunks
                Atomics.store(pointers, 1, readPtr)
                if (!running) {return}
                append(channels)
            }
            step()
        }
        step()
        return {stop: () => running = false}
    }

    /**
     * Creates a writer for the given configuration.
     *
     * @param config - Layout of the underlying shared buffer.
     * @returns Object exposing a {@link Writer.write | write} method.
     */
    export const writer = ({sab, numChunks, numberOfChannels, bufferSize}: Config): Writer => {
        const pointers = new Int32Array(sab, 0, 2)
        const audio = new Float32Array(sab, 8)
        return Object.freeze({
            write: (channels: ReadonlyArray<Float32Array>): void => {
                if (channels.length !== numberOfChannels) {
                    // We ignore this. This can happen in the worklet setup phase.
                    return
                }
                for (const channel of channels) {
                    if (channel.length !== bufferSize) {
                        return panic("Each channel buffer must contain 'bufferSize' samples")
                    }
                }
                const writePtr = Atomics.load(pointers, 0)
                const offset = writePtr * numberOfChannels * bufferSize
                channels.forEach((channel, index) => audio.set(channel, offset + index * bufferSize))
                Atomics.store(pointers, 0, (writePtr + 1) % numChunks)
                Atomics.notify(pointers, 0)
            }
        })
    }
}
/**
 * Flattens an array of planar chunks into contiguous channel buffers.
 *
 * @param chunks - Recorded audio split into sequential chunks.
 * @param bufferSize - Number of frames in each chunk.
 * @param maxFrames - Optional cap for the total number of frames copied.
 * @returns Array of channels with concatenated audio data.
 */
export const mergeChunkPlanes = (
    chunks: ReadonlyArray<ReadonlyArray<Float32Array>>,
    bufferSize: int,
    maxFrames: int = Number.MAX_SAFE_INTEGER,
): ReadonlyArray<Float32Array> => {
    if (chunks.length === 0) {return Arrays.empty()}
    const numChannels = chunks[0].length
    const numFrames = Math.min(bufferSize * chunks.length, maxFrames)
    return Arrays.create(channelIndex => {
        const outChannel = new Float32Array(numFrames)
        chunks.forEach((recordedChannels, chunkIndex) => {
            if (recordedChannels.length !== numChannels) {return panic()}
            const recordedChannel = recordedChannels[channelIndex]
            assert(recordedChannel.length === bufferSize, "Invalid length")
            const remaining = numFrames - chunkIndex * bufferSize
            assert(remaining > 0, "Invalid remaining")
            outChannel.set(remaining < bufferSize
                ? recordedChannel.slice(0, remaining)
                : recordedChannel, chunkIndex * bufferSize)
        })
        return outChannel
    }, numChannels)
}
