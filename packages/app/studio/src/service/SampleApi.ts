/**
 * REST API helpers for retrieving and uploading sample metadata and audio
 * data. Used by both the browser-based studio and headless tools.
 */
import {
  Arrays,
  asDefined,
  DefaultObservableValue,
  panic,
  Procedure,
  tryCatch,
  unitValue,
  UUID,
} from "@opendaw/lib-std";
import { AudioData, Sample, SampleMetaData } from "@opendaw/studio-adapters";
import { showInfoDialog, showProcessDialog } from "@/ui/components/dialogs.tsx";
import { network, Promises } from "@opendaw/lib-runtime";

const username = "openDAW";
const password = "prototype";
const base64Credentials = btoa(`${username}:${password}`);
const headers: RequestInit = {
  method: "GET",
  headers: { Authorization: `Basic ${base64Credentials}` },
  credentials: "include",
};

/**
 * REST API helpers for retrieving and uploading sample files.
 *
 * Used by {@link SampleService} and the {@link SampleBrowser} to access the
 * cloud library. Requests are throttled through {@link network.limitFetch} to
 * avoid hammering the server. See {@link SampleStorage} for the local OPFS
 * counterpart.
 *
 * ```mermaid
 * sequenceDiagram
 *   participant U as Client
 *   participant A as ApiRoot
 *   U->>A: list.php
 *   U->>A: get.php
 * ```
 */
export namespace SampleApi {
  /** Base endpoint for sample metadata. */
  export const ApiRoot = "https://api.opendaw.studio/samples";
  /** Base endpoint for raw sample files. */
  export const FileRoot = "https://assets.opendaw.studio/samples";

  /**
   * Fetch metadata for all available samples.
   */
  export const all = async (): Promise<ReadonlyArray<Sample>> => {
    return await Promises.retry(() =>
      fetch(`${ApiRoot}/list.php`, headers).then(
        (x) => x.json(),
        () => [],
      ),
    );
  };

  /**
   * Retrieve metadata for a single sample.
   *
   * @param uuid identifier of the sample to fetch.
   */
  export const get = async (uuid: UUID.Format): Promise<Sample> => {
    const url = `${ApiRoot}/get.php?uuid=${UUID.toString(uuid)}`;
    const sample: Sample = await Promises.retry(() =>
      network.limitFetch(url, headers).then((x) => x.json()),
    ).then((x) => {
      if ("error" in x) {
        return panic(x.error);
      } else {
        return x;
      }
    });
    return Object.freeze({ ...sample, cloud: FileRoot });
  };


  /**
   * Load a sample into an {@link AudioContext} and return decoded data and
   * metadata.
   *
   * @param context audio context used for decoding.
   * @param uuid sample identifier.
   * @param progress callback receiving loading progress between 0 and 1.
   */
  export const load = async (
    context: AudioContext,
    uuid: UUID.Format,
    progress: Procedure<unitValue>,
  ): Promise<[AudioData, SampleMetaData]> => {
    console.debug(`fetch ${UUID.toString(uuid)}`);
    return get(uuid).then(({ uuid, name, bpm }) =>
      Promises.retry(() => network.limitFetch(`${FileRoot}/${uuid}`, headers))
        .then((response) => {
          const total = parseInt(response.headers.get("Content-Length") ?? "0");
          let loaded = 0;
          return new Promise<ArrayBuffer>((resolve, reject) => {
            const reader = asDefined(
              response.body,
              "No body in response",
            ).getReader();
            const chunks: Array<Uint8Array> = [];
            const nextChunk = ({
              done,
              value,
            }: ReadableStreamReadResult<Uint8Array>) => {
              if (done) {
                resolve(new Blob(chunks as Array<BlobPart>).arrayBuffer());
              } else {
                chunks.push(value);
                loaded += value.length;
                progress(loaded / total);
                reader.read().then(nextChunk, reject);
              }
            };
            reader.read().then(nextChunk, reject);
          });
        })
        .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => [
          fromAudioBuffer(audioBuffer),
          {
            bpm,
            name,
            duration: audioBuffer.duration,
            sample_rate: audioBuffer.sampleRate,
          },
        ]),
    );
  };

  /** Convert an {@link AudioBuffer} into serialized {@link AudioData}. */
  const fromAudioBuffer = (buffer: AudioBuffer): AudioData => ({
    frames: Arrays.create(
      (channel) => buffer.getChannelData(channel),
      buffer.numberOfChannels,
    ),
    sampleRate: buffer.sampleRate,
    numberOfFrames: buffer.length,
    numberOfChannels: buffer.numberOfChannels,
  });


  /**
   * Upload a sample to the remote server.
   *
   * @param arrayBuffer raw WAV data.
   * @param metaData description of the sample to accompany the upload.
   */
  export const upload = async (
    arrayBuffer: ArrayBuffer,
    metaData: SampleMetaData,
  ) => {
    const progress = new DefaultObservableValue(0.0);
    const dialogHandler = showProcessDialog("Uploading", progress);
    const formData = new FormData();
    Object.entries(metaData).forEach(([key, value]) =>
      formData.set(key, String(value)),
    );
    const params = new URLSearchParams(location.search);
    const accessKey = asDefined(
      params.get("access-key"),
      "Cannot upload without access-key.",
    );
    formData.set("key", accessKey);
    formData.append("file", new Blob([arrayBuffer]));
    console.log(
      "upload data",
      Array.from(formData.entries()),
      arrayBuffer.byteLength,
    );
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (event: ProgressEvent) => {
      if (event.lengthComputable) {
        progress.setValue(event.loaded / event.total);
      }
    });
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        dialogHandler.close();
        if (xhr.status === 200) {
          showInfoDialog({ message: xhr.responseText });
        } else {
          const { status, value } = tryCatch(
            () =>
              JSON.parse(xhr.responseText).message ?? "Unknown error message",
          );
          showInfoDialog({
            headline: "Upload Failure",
            message: status === "success" ? value : "Unknown error",
          });
        }
      }
    };
    xhr.open("POST", `${ApiRoot}/upload.php`, true);
    xhr.setRequestHeader("Authorization", `Basic ${base64Credentials}`);
    xhr.send(formData);
  };
}
