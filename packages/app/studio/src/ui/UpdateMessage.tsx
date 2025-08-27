import css from "./UpdateMessage.sass?inline";
import { Html } from "@opendaw/lib-dom";
import { createElement } from "@opendaw/lib-jsx";

const className = Html.adoptStyleSheet(css, "UpdateMessage");

/**
 * Banner shown when a new application version is available.
 *
 * The message lives in an assertive ARIA live region so assistive
 * technologies announce it immediately.
 */
export const UpdateMessage = () => {
  return (
    <div className={className} role="alert" aria-live="assertive">
      Update available! (please reload)
    </div>
  );
};
