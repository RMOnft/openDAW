/**
 * Base interface implemented by all note editing modifiers.
 */
import {NoteModifyStrategies} from "@/ui/timeline/editors/notes/NoteModifyStrategies.ts"
import {ObservableModifier} from "@/ui/timeline/ObservableModifier.ts"

/**
 * Combines {@link NoteModifyStrategies} with observable lifecycle hooks used by the editor.
 */
export interface NoteModifier extends NoteModifyStrategies, ObservableModifier {}