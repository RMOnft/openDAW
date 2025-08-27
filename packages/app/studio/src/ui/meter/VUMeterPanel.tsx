/**
 * Panel displaying a pair of VU meters that react to peak levels from the
 * engine live stream.
 */
import css from "./VUMeterPanel.sass?inline";
import {
  DefaultObservableValue,
  Lifecycle,
  Terminator,
  UUID,
} from "@opendaw/lib-std";
import { createElement } from "@opendaw/lib-jsx";
import { VUMeterDesign } from "@/ui/meter/VUMeterDesign.tsx";
import { StudioService } from "@/service/StudioService.ts";
import { Address } from "@opendaw/lib-box";
import { Html } from "@opendaw/lib-dom";

const className = Html.adoptStyleSheet(css, "VUMeterPanel");

/** Props for {@link VUMeterPanel}. */
type Construct = {
  /** Lifecycle owner. */
  lifecycle: Lifecycle;
  /** Service providing the session stream. */
  service: StudioService;
};

/** Renders the VU meters and subscribes to peak data from the engine. */
export const VUMeterPanel = ({ lifecycle, service }: Construct) => {
  const peakL = lifecycle.own(new DefaultObservableValue(0.0));
  const peakR = lifecycle.own(new DefaultObservableValue(0.0));
  const runtime = lifecycle.own(new Terminator());
  lifecycle.own(
    service.sessionService.catchupAndSubscribe((owner) => {
      runtime.terminate();
      owner.getValue().match({
        none: () => {
          peakL.setValue(0.0);
          peakR.setValue(0.0);
        },
        some: ({ project: { liveStreamReceiver } }) => {
          runtime.own(
            liveStreamReceiver.subscribeFloats(
              Address.compose(UUID.Lowest),
              (peaks) => {
                const [pl, pr] = peaks;
                peakL.setValue(
                  pl >= peakL.getValue() ? pl : peakL.getValue() * 0.98,
                );
                peakR.setValue(
                  pr >= peakR.getValue() ? pr : peakR.getValue() * 0.98,
                );
              },
            ),
          );
        },
      });
    }),
  );
  return (
    <div className={className}>
      <div className="meters">
        <div>
          <VUMeterDesign.Default model={peakL} />
        </div>
        <div>
          <VUMeterDesign.Default model={peakR} />
        </div>
      </div>
    </div>
  );
};
