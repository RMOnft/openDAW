import css from "./UpdateMessage.sass?inline";
import { Html } from "@opendaw/lib-dom";
import { createElement } from "@opendaw/lib-jsx";

const className = Html.adoptStyleSheet(css, "UpdateMessage");

/**
 * Banner shown when a new application version is available.
 *
 * The message prompts users to reload the page so the latest build is loaded.
 */
export const UpdateMessage = () => {
  return (
    <div className={className} role="alert" aria-live="assertive">
      Update available! (please reload)
    </div>
  );
};
