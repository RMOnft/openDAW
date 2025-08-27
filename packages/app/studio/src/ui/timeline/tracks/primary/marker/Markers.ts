/**
 * Helper functions for working with marker names.
 */
export namespace Markers {
    /**
     * List of default marker labels in sequential order.
     */
    export const DefaultNames = ["Intro", "Verse", "Chorus", "Bridge", "Outro"]

    /**
     * Suggests the next label given a current marker name.
     */
    export const nextName = (name: string) => {
        const index = DefaultNames.findIndex(defaultName => defaultName === name)
        return index === -1 ? "New" : DefaultNames.at(index + 1) ?? "New"
    }
}
