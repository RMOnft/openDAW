/**
 * Lightweight header section for the {@link AudioEditor}. Currently displays
 * placeholder text and will later host transport and zoom controls.
 */
import css from "./AudioEditorHeader.sass?inline"
import {Lifecycle} from "@opendaw/lib-std"
import {StudioService} from "@/service/StudioService.ts"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"

const className = Html.adoptStyleSheet(css, "AudioEditorHeader")

/**
 * Construction options for {@link AudioEditorHeader}.
 */
type Construct = {
    /** Lifecycle of the header instance. */
    lifecycle: Lifecycle
    /** Provides access to studio-wide services. */
    service: StudioService
}

/**
 * Render only the header part of the audio editor.
 */
export const AudioEditorHeader = ({}: Construct) => (
    <div className={className}>
        <p className="help-section">
            Navigatable but otherwise non-functional yet
        </p>
    </div>
)
