/**
 * Utility service wrapping {@link StudioService} to perform common sample
 * operations used by the browser UI.
 */
import { asDefined, DefaultObservableValue, UUID } from "@opendaw/lib-std";
import { PPQN } from "@opendaw/lib-dsp";
import { Promises } from "@opendaw/lib-runtime";
import { AudioFileBox, AudioRegionBox } from "@opendaw/studio-boxes";
import { Sample } from "@opendaw/studio-adapters";
import {
  ColorCodes,
  InstrumentFactories,
  SampleStorage,
} from "@opendaw/studio-core";
import { HTMLSelection } from "@/ui/HTMLSelection";
import { StudioService } from "@/service/StudioService";
import {
  showApproveDialog,
  showInfoDialog,
  showProcessDialog,
} from "../components/dialogs";
import { Projects } from "@/project/Projects";
import { SampleApi } from "@/service/SampleApi";

/**
 * Convenience wrapper around {@link StudioService} for managing samples in the
 * browser view.
 *
 * Ties together {@link SampleApi} for cloud access and {@link SampleStorage}
 * for OPFS backed persistence, exposing higher level actions used by the
 * {@link SampleBrowser} UI.
 */
export class SampleService {
  readonly #service: StudioService;
  readonly #selection: HTMLSelection;

  /**
   * Create a new SampleService bound to a studio service and selection.
   *
   * @param service underlying studio service.
   * @param selection helper exposing the current DOM selection.
   */
  constructor(service: StudioService, selection: HTMLSelection) {
    this.#service = service;
    this.#selection = selection;
  }

  /** Create audio tracks for the currently selected samples. */
  requestTapes(): void {
    if (!this.#service.hasProjectSession) {
      return;
    }
    const project = this.#service.project;
    const { editing, boxGraph, rootBoxAdapter } = project;
    editing.modify(() => {
      const samples = this.#samples();
      // Insert new tracks sequentially after existing ones
      const startIndex = rootBoxAdapter.audioUnits.adapters().length;
      samples.forEach(
        (
          { uuid: uuidAsString, name, bpm, duration: durationInSeconds },
          index,
        ) => {
          const uuid = UUID.parse(uuidAsString);
          const { trackBox } = project.api.createInstrument(
            InstrumentFactories.Tape,
            { index: startIndex + index },
          );
          // Reuse existing AudioFileBox if present, otherwise create one
          const audioFileBox = boxGraph
            .findBox<AudioFileBox>(uuid)
            .unwrapOrElse(() =>
              AudioFileBox.create(boxGraph, uuid, (box) => {
                box.fileName.setValue(name);
                box.startInSeconds.setValue(0);
                box.endInSeconds.setValue(durationInSeconds);
              }),
            );
          const duration = Math.round(
            PPQN.secondsToPulses(durationInSeconds, bpm),
          );
          AudioRegionBox.create(boxGraph, UUID.generate(), (box) => {
            box.position.setValue(0);
            box.duration.setValue(duration);
            box.loopDuration.setValue(duration);
            box.regions.refer(trackBox.regions);
            box.hue.setValue(ColorCodes.forTrackType(trackBox.type.getValue()));
            box.label.setValue(name);
            box.file.refer(audioFileBox);
          });
        },
      );
    });
  }

  /** Delete all currently selected samples. */
  async deleteSelected(): Promise<void> {
    return this.deleteSamples(...this.#samples());
  }

  /**
   * Delete the given samples after checking their usage and asking for
   * confirmation.
   *
   * @param samples samples to remove from local storage.
   */
  async deleteSamples(...samples: ReadonlyArray<Sample>): Promise<void> {
    const processDialog = showProcessDialog(
      "Checking Sample Usages",
      new DefaultObservableValue(0.5),
    );
    const used = await Projects.listUsedSamples();
    const online = new Set<string>(
      (await SampleApi.all()).map(({ uuid }) => uuid),
    );
    processDialog.close();
    const { status } = await Promises.tryCatch(
      showApproveDialog({
        headline: "Remove Sample(s)?",
        message: "This cannot be undone!",
        approveText: "Remove",
      }),
    );
    if (status === "rejected") {
      return;
    }
    for (const { uuid, name } of samples) {
      const isUsed = used.has(uuid);
      const isOnline = online.has(uuid);
      if (isUsed && !isOnline) {
        await showInfoDialog({
          headline: "Cannot Delete Sample",
          message: `${name} is used by a project.`,
        });
      } else {
        await SampleStorage.remove(UUID.parse(uuid));
      }
    }
  }

  /**
   * Collect metadata from all currently selected DOM elements.
   *
   * @returns parsed sample objects associated with the selection.
   */
  #samples(): ReadonlyArray<Sample> {
    const selected = this.#selection.getSelected();
    return selected.map(
      (element) =>
        JSON.parse(asDefined(element.getAttribute("data-selection"))) as Sample,
    );
  }
}
