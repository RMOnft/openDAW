/**
 * Utility functions for fetching and decoding sample data from the public
 * openDAW sample service.
 */
/* eslint-disable @typescript-eslint/no-namespace */
import {Arrays, asDefined, panic, Procedure, unitValue, UUID} from "@opendaw/lib-std"
import {AudioData, Sample, SampleMetaData} from "@opendaw/studio-adapters"
import {network, Promises} from "@opendaw/lib-runtime"

const username = "openDAW"
const password = "prototype"
const base64Credentials = btoa(`${username}:${password}`)
const headers: RequestInit = {
    method: "GET",
    headers: {"Authorization": `Basic ${base64Credentials}`},
    credentials: "include"
}

export namespace SampleApi {
    /** Base URL for sample metadata requests. */
    export const ApiRoot = "https://api.opendaw.studio/samples"

    /** Base URL for raw sample files. */
    export const FileRoot = "https://assets.opendaw.studio/samples"

    /**
     * Fetches the complete list of samples available on the service.
     */
    export const all = async (): Promise<ReadonlyArray<Sample>> => {
        return await Promises.retry(() => fetch(`${ApiRoot}/list.php`, headers).then(x => x.json(), () => []))
    }

    /**
     * Retrieve a single sample's metadata.
     */
    export const get = async (uuid: UUID.Format): Promise<Sample> => {
        const url = `${ApiRoot}/get.php?uuid=${UUID.toString(uuid)}`
        const sample: Sample = await Promises.retry(() => network.limitFetch(url, headers)
            .then(x => x.json()))
            .then(x => {if ("error" in x) {return panic(x.error)} else {return x}})
        return Object.freeze({...sample, cloud: FileRoot})
    }

    /**
     * Download and decode a sample, reporting progress via the provided handler.
     */
    export const load = async (context: AudioContext,
                               uuid: UUID.Format,
                               progress: Procedure<unitValue>): Promise<[AudioData, SampleMetaData]> => {
        console.debug(`fetch ${UUID.toString(uuid)}`)
        return get(uuid)
            .then(({uuid, name, bpm}) => Promises.retry(() => network.limitFetch(`${FileRoot}/${uuid}`, headers))
                .then(response => {
                    const total = parseInt(response.headers.get("Content-Length") ?? "0")
                    let loaded = 0
                    return new Promise<ArrayBuffer>((resolve, reject) => {
                        const reader = asDefined(response.body, "No body in response").getReader()
                        const chunks: Array<Uint8Array> = []
                        const nextChunk = ({done, value}: ReadableStreamReadResult<Uint8Array>) => {
                            if (done) {
                                resolve(new Blob(chunks as Array<BlobPart>).arrayBuffer())
                            } else {
                                chunks.push(value)
                                loaded += value.length
                                progress(loaded / total)
                                reader.read().then(nextChunk, reject)
                            }
                        }
                        reader.read().then(nextChunk, reject)
                    })
                })
                .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
                .then(audioBuffer => ([fromAudioBuffer(audioBuffer), {
                    bpm,
                    name,
                    duration: audioBuffer.duration,
                    sample_rate: audioBuffer.sampleRate
                }])))
    }

    /** Convert a decoded {@link AudioBuffer} to the {@link AudioData} format. */
    const fromAudioBuffer = (buffer: AudioBuffer): AudioData => ({
        frames: Arrays.create(channel => buffer.getChannelData(channel), buffer.numberOfChannels),
        sampleRate: buffer.sampleRate,
        numberOfFrames: buffer.length,
        numberOfChannels: buffer.numberOfChannels
    })
}
