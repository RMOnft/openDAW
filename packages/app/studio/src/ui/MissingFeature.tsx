import css from "./MissingFeature.sass?inline";
import { createElement } from "@opendaw/lib-jsx";
import { Html } from "@opendaw/lib-dom";
import { Colors } from "@opendaw/studio-core";

const className = Html.adoptStyleSheet(css, "MissingFeature");

type Construct = { error: unknown };

/**
 * Full‑screen notice displayed when a required browser capability is
 * missing. The message lists the unsupported feature and suggests
 * upgrading or switching browsers.
 */
export const MissingFeature = ({ error }: Construct) => {
  return (
    <div className={className}>
      <h1>Get openDAW Working</h1>
      <h2>
        An important feature{" "}
        <span style={{ color: Colors.purple }}>"{error}"</span> is missing.
      </h2>
      <p>
        Please update your browser or switch to the latest Chrome (recommended).
      </p>
      <p>
        openDAW should run on all modern browsers like Chrome, Edge, Firefox,
        and Safari.
      </p>
      <p>
        If you are already using one of these, please report your problem to
        <a href="mailto:support@opendaw.org">support@opendaw.org</a>
      </p>
    </div>
  );
};
