import {Terminable} from "@opendaw/lib-std"

/**
 * Minimal interface for labels shown in the application's footer.
 *
 * ```mermaid
 * classDiagram
 *   class FooterLabel
 * ```
 */
export interface FooterLabel extends Terminable {
    setTitle(value: string): void
    setValue(value: string): void
}