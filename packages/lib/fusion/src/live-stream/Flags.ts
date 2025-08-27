/**
 * Markers used in the live-stream protocol to delimit structure and data
 * sections.
 */
export const enum Flags {
    ID = 0xF0FF0F, START = 0xF0F0F0, END = 0x0F0F0F
}