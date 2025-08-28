/** Routines for importing audio files into the project. */
import { Arrays, Progress, UUID } from "@opendaw/lib-std";
import { estimateBpm } from "@opendaw/lib-dsp";
import { Promises } from "@opendaw/lib-runtime";
import { AudioData, Sample, SampleMetaData } from "@opendaw/studio-adapters";
import { SampleStorage, WorkerAgents } from "@opendaw/studio-core";
import { SamplePeaks } from "@opendaw/lib-fusion";

export namespace AudioImporter {
  /**
   * Data required to create a {@link Sample} entry.
   *
   * The {@link arrayBuffer} contains the raw audio file data and will be
   * detached once decoding begins. The optional {@link uuid} can be provided to
   * avoid hashing large files during repeated imports.
   */
  export type Creation = {
    /** Optional identifier for the sample. */
    uuid?: UUID.Format;
    /** Name of the source file including extension. */
    name: string;
    /** Audio file contents to decode. */
    arrayBuffer: ArrayBuffer;
    /** Handler that receives peak‑generation progress updates. */
    progressHandler: Progress.Handler;
  };

  /**
   * Import an audio file into {@link SampleStorage} and return its metadata.
   *
   * @param context Audio context used for decoding.
   * @param creation Parameters describing the file to import.
   * @returns Metadata describing the stored sample.
   */
  export const run = async (
    context: AudioContext,
    { uuid, name, arrayBuffer, progressHandler }: Creation,
  ): Promise<Sample> => {
    // Must run before decodeAudioData, because it will detach the ArrayBuffer
    uuid ??= await UUID.sha256(arrayBuffer);
    const audioResult = await Promises.tryCatch(
      context.decodeAudioData(arrayBuffer),
    );
    if (audioResult.status === "rejected") {
      return Promise.reject(name);
    }
    const { value: audioBuffer } = audioResult;
    const audioData: AudioData = {
      sampleRate: audioBuffer.sampleRate,
      numberOfFrames: audioBuffer.length,
      numberOfChannels: audioBuffer.numberOfChannels,
      frames: Arrays.create(
        (index) => audioBuffer.getChannelData(index),
        audioBuffer.numberOfChannels,
      ),
    };
    const shifts = SamplePeaks.findBestFit(audioData.numberOfFrames);
    const peaks = (await WorkerAgents.Peak.generateAsync(
      progressHandler,
      shifts,
      audioData.frames,
      audioData.numberOfFrames,
      audioData.numberOfChannels,
    )) as ArrayBuffer;
    const meta: SampleMetaData = {
      bpm: estimateBpm(audioBuffer.duration),
      name: name.substring(0, name.lastIndexOf(".")),
      duration: audioBuffer.duration,
      sample_rate: audioBuffer.sampleRate,
    };
    await SampleStorage.store(uuid, audioData, peaks, meta);
    return { uuid: UUID.toString(uuid), ...meta };
  };
}
