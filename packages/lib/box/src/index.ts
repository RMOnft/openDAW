const key = Symbol.for("@openDAW/lib-box")

if ((globalThis as any)[key]) {
    console.debug(`%c${key.description}%c is already available in ${globalThis.constructor.name}.`, "color: hsl(10, 83%, 60%)", "color: inherit")
} else {
    (globalThis as any)[key] = true
    console.debug(`%c${key.description}%c is now available in ${globalThis.constructor.name}.`, "color: hsl(200, 83%, 60%)", "color: inherit")
}

/** Address utilities for locating vertices. */
export * from "./address"
/** Array field implementations. */
export * from "./array"
/** Core box primitives and helpers. */
export * from "./box"
/** Dispatch utilities for update propagation. */
export * from "./dispatchers"
/** Editing and undo/redo support. */
export * from "./editing"
/** Base field types. */
export * from "./field"
/** Graph management. */
export * from "./graph"
/** Edge tracking within the graph. */
export * from "./graph-edges"
/** Indexed box helpers. */
export * from "./indexed-box"
/** Object field support. */
export * from "./object"
/** Pointer field types. */
export * from "./pointer"
/** Pointer hub for observing references. */
export * from "./pointer-hub"
/** Primitive field types. */
export * from "./primitive"
/** Sync task definitions. */
export * from "./sync"
/** Source-side synchronization utilities. */
export * from "./sync-source"
/** Target-side synchronization utilities. */
export * from "./sync-target"
/** Update event definitions. */
export * from "./updates"
/** Base vertex interfaces. */
export * from "./vertex"