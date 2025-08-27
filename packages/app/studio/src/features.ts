import { requireProperty } from "@opendaw/lib-std";

/**
 * Ensures that essential Web APIs are available in the current browser
 * before the studio attempts to boot. Each check throws if the feature
 * is missing which prevents the application from starting in an
 * unsupported environment.
 */
export const testFeatures = async (): Promise<void> => {
  // Promise.withResolvers is used throughout for ergonomic async flows
  requireProperty(Promise, "withResolvers");
  // IndexedDB provides persistent storage of samples and projects
  requireProperty(window, "indexedDB");
  // Audio worklets are required for real‑time audio processing
  requireProperty(window, "AudioWorkletNode");
  // Origin private file system access for project storage
  requireProperty(navigator, "storage");
  requireProperty(navigator.storage, "getDirectory");
  // Random UUIDs are used for identifying projects and assets
  requireProperty(crypto, "randomUUID");
  // SubtleCrypto provides hashing for cache validation
  requireProperty(crypto, "subtle");
  requireProperty(crypto.subtle, "digest");
};
