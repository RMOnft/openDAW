import { panic, UUID } from "@opendaw/lib-std";
import { Errors } from "@opendaw/lib-dom";
import { BoxGraph } from "@opendaw/lib-box";
import { Promises } from "@opendaw/lib-runtime";
import { AudioFileBox } from "@opendaw/studio-boxes";
import { Sample, SampleManager } from "@opendaw/studio-adapters";
import { SampleStorage } from "@opendaw/studio-core";
import { SampleDialogs } from "@/ui/browse/SampleDialogs";
import { showInfoDialog } from "@/ui/components/dialogs";
import { SampleImporter } from "@/project/SampleImporter";
import { SampleApi } from "@/service/SampleApi";

/**
 * Utility functions for working with audio samples.
 *
 * @see SampleImporter
 * @see SampleDialogs
 */
export namespace SampleUtils {
  /**
   * Ensure all audio file boxes reference existing samples and prompt the
   * user to replace missing ones.
   *
   * @param boxGraph Graph containing the boxes to inspect.
   * @param importer Utility used to load replacement samples.
   * @param audioManager Manager responsible for caching sample data.
   *
   * @example
   * ```ts
   * await SampleUtils.verify(project.boxGraph, importer, manager)
   * ```
   */
  export const verify = async (
    boxGraph: BoxGraph,
    importer: SampleImporter,
    audioManager: SampleManager,
  ) => {
    const boxes = boxGraph.boxes().filter((box) => box instanceof AudioFileBox);
    if (boxes.length > 0) {
      // Build lookup tables for online and offline samples
      const online = UUID.newSet<{ uuid: UUID.Format; sample: Sample }>(
        (x) => x.uuid,
      );
      online.addMany(
        (await SampleApi.all()).map((sample) => ({
          uuid: UUID.parse(sample.uuid),
          sample,
        })),
      );
      const offline = UUID.newSet<{ uuid: UUID.Format; sample: Sample }>(
        (x) => x.uuid,
      );
      offline.addMany(
        (await SampleStorage.list()).map((sample) => ({
          uuid: UUID.parse(sample.uuid),
          sample,
        })),
      );
      for (const box of boxes) {
        const uuid = box.address.uuid;
        // Skip boxes already backed by an online sample
        if (online.hasKey(uuid)) {
          continue;
        }
        const optSample = offline.opt(uuid);
        if (optSample.isEmpty()) {
          const {
            status,
            error,
            value: sample,
          } = await Promises.tryCatch(
            SampleDialogs.missingSampleDialog(
              importer,
              uuid,
              box.fileName.getValue(),
            ),
          );
          if (status === "rejected") {
            // User aborted or an error occurred
            if (Errors.isAbort(error)) {
              continue;
            } else {
              return panic(String(error));
            }
          }
          await showInfoDialog({
            headline: "Replaced Sample",
            message: `${sample.name} has been replaced`,
          });
          // Invalidate cached data so future playback uses the replacement
          audioManager.invalidate(UUID.parse(sample.uuid));
        }
      }
    }
  };
}
