import {Arrays, ByteArrayInput, EmptyExec, UUID} from "@opendaw/lib-std"
import {Peaks, SamplePeaks} from "@opendaw/lib-fusion"
import {AudioData, Sample, SampleMetaData} from "@opendaw/studio-adapters"
import {WorkerAgents} from "../WorkerAgents"
import {encodeWavFloat} from "../Wav"

/**
 * Helpers for persisting samples in the browser's OPFS.
 */
export namespace SampleStorage {
    /** Remove legacy storage from earlier versions. */
    export const clean = () => WorkerAgents.Opfs.delete("samples/v1").catch(EmptyExec)

    /** Root folder within OPFS for stored samples. */
    export const Folder = "samples/v2"

    /**
     * Write decoded audio, peaks and metadata to OPFS.
     *
     * @param uuid identifier of the sample to store
     * @param audio decoded audio frames
     * @param peaks precomputed peak data
     * @param meta additional sample metadata
     * @returns resolves when the files have been written
     */
    export const store = async (uuid: UUID.Format,
                                audio: AudioData,
                                peaks: ArrayBuffer,
                                meta: SampleMetaData): Promise<void> => {
        const path = `${Folder}/${UUID.toString(uuid)}`
        return Promise.all([
            WorkerAgents.Opfs.write(`${path}/audio.wav`, new Uint8Array(encodeWavFloat({
                channels: audio.frames.slice(),
                numFrames: audio.numberOfFrames,
                sampleRate: audio.sampleRate
            }))),
            WorkerAgents.Opfs.write(`${path}/peaks.bin`, new Uint8Array(peaks)),
            WorkerAgents.Opfs.write(`${path}/meta.json`, new TextEncoder().encode(JSON.stringify(meta)))
        ]).then(EmptyExec)
    }

    /**
     * Overwrite only the metadata file of a stored sample.
     *
     * @param uuid identifier of the sample to update
     * @param meta new metadata to persist
     * @returns resolves once the metadata file was written
     */
    export const updateMeta = async (uuid: UUID.Format, meta: SampleMetaData): Promise<void> => {
        const path = `${Folder}/${UUID.toString(uuid)}`
        return WorkerAgents.Opfs.write(`${path}/meta.json`, new TextEncoder().encode(JSON.stringify(meta)))
    }

    /**
     * Load a sample from OPFS and decode it into {@link AudioData} and peaks.
     *
     * @param uuid identifier of the sample to load
     * @param context audio context used for decoding
     * @returns audio data, peak information and metadata
     */
    export const load = async (uuid: UUID.Format, context: AudioContext): Promise<[AudioData, Peaks, SampleMetaData]> => {
        const path = `${Folder}/${UUID.toString(uuid)}`
        return Promise.all([
            WorkerAgents.Opfs.read(`${path}/audio.wav`)
                .then(bytes => context.decodeAudioData(bytes.buffer as ArrayBuffer)),
            WorkerAgents.Opfs.read(`${path}/peaks.bin`)
                .then(bytes => SamplePeaks.from(new ByteArrayInput(bytes.buffer))),
            WorkerAgents.Opfs.read(`${path}/meta.json`)
                .then(bytes => JSON.parse(new TextDecoder().decode(bytes)))
        ]).then(([buffer, peaks, meta]) => [{
            sampleRate: buffer.sampleRate,
            numberOfFrames: buffer.length,
            numberOfChannels: buffer.numberOfChannels,
            frames: Arrays.create(index => buffer.getChannelData(index), buffer.numberOfChannels)
        }, peaks, meta])
    }

    /** Delete a sample and all related files.
     *
     * @param uuid identifier of the sample to delete
     * @returns resolves when the files have been removed
     */
    export const remove = async (uuid: UUID.Format): Promise<void> => {
        const path = `${Folder}/${UUID.toString(uuid)}`
        return WorkerAgents.Opfs.delete(`${path}`)
    }

    /** List metadata for all stored samples.
     *
     * @returns metadata for each sample stored in OPFS
     */
    export const list = async (): Promise<ReadonlyArray<Sample>> => {
        return WorkerAgents.Opfs.list(Folder)
            .then(files => Promise.all(files.filter(file => file.kind === "directory")
                .map(async ({name}) => {
                    const array = await WorkerAgents.Opfs.read(`${Folder}/${name}/meta.json`)
                    return ({uuid: name, ...(JSON.parse(new TextDecoder().decode(array)) as SampleMetaData)})
                })), () => [])
    }
}
