import {JSONValue} from "@opendaw/lib-std"

/**
 * Metadata describing a project such as name and tags.
 */
export type ProjectMeta = {
    /** Project title displayed in the UI. */
    name: string
    /** Free form description for the project. */
    description: string
    /** Tags used for categorization. */
    tags: Array<string>
    /** Creation timestamp in ISO format. */
    created: Readonly<string>
    /** Last modification timestamp in ISO format. */
    modified: string
    /** Optional text notes saved with the project. */
    notepad?: string
} & JSONValue

/** Utilities for working with {@link ProjectMeta} objects. */
export namespace ProjectMeta {
    const created = new Date().toISOString()

    /**
     * Create a new {@link ProjectMeta} object with sensible defaults.
     *
     * @param name - Optional project name to use for the new metadata.
     * @returns The initialized metadata object.
     *
     * @example
     * ```ts
     * const meta = ProjectMeta.init("My Song")
     * ```
     */
    export const init = (name: string = "Untitled"): ProjectMeta => ({
        name,
        description: "",
        tags: [],
        created,
        modified: created
    })

    /**
     * Create a shallow copy of the given metadata object.
     *
     * @param meta - Source metadata to duplicate.
     * @returns A new metadata object containing the same fields.
     */
    export const copy = (meta: ProjectMeta): ProjectMeta => Object.assign({}, meta)
}
