import {Dragging} from "@opendaw/lib-dom"
import {Editing} from "@opendaw/lib-box"

/**
 * Represents an ongoing modification gesture within the timeline.
 */
export interface Modifier {
    /**
     * Called for each pointer move while the modification is active.
     */
    update(event: Dragging.Event): void
    /**
     * Commits the modification using the provided editing context.
     */
    approve(editing: Editing): void
    /** Cancels the modification and reverts state. */
    cancel(): void
}