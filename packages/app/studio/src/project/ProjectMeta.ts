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

export namespace ProjectMeta {
    const created = new Date().toISOString()

    /**
     * Create a new {@link ProjectMeta} object with sensible defaults.
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
     */
    export const copy = (meta: ProjectMeta): ProjectMeta => Object.assign({}, meta)
}
