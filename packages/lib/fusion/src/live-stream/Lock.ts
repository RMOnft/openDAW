/**
 * Synchronisation states for the shared buffer used by broadcaster and
 * receiver. `WRITE` indicates the broadcaster may write new data, `READ`
 * signals that receivers can consume it.
 */
export enum Lock {WRITE = 0, READ = 1}