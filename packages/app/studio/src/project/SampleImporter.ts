import { Progress, UUID } from "@opendaw/lib-std";
import { Sample } from "@opendaw/studio-adapters";

/**
 * Interface for importing audio samples into a project.
 *
 * @example
 * ```ts
 * await importer.importSample({uuid, name: "kick", arrayBuffer})
 * ```
 *
 * @see SampleUtils.verify
 * @see SampleDialogs.missingSampleDialog
 */
export type SampleImporter = {
  /**
   * Import a new sample into the project store.
   *
   * @param sample description of the sample to be imported.
   * @param sample.uuid identifier to associate with the sample.
   * @param sample.name display name of the sample.
   * @param sample.arrayBuffer raw audio data to be decoded.
   * @param sample.progressHandler optional callback receiving progress
   * updates while the audio is decoded or uploaded.
   * @returns metadata for the imported sample once complete.
   */
  importSample(sample: {
    uuid: UUID.Format;
    name: string;
    arrayBuffer: ArrayBuffer;
    /** Notified with the import percentage (0-1). */
    progressHandler?: Progress.Handler;
  }): Promise<Sample>;
};
