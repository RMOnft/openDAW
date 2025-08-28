/**
 * Runtime feature detection utilities for the Studio application.
 *
 * Security note: these tests run entirely in the browser and do not
 * transmit any information to remote services.
 */
import { requireProperty } from "@opendaw/lib-std";

/**
 * Tests browser capabilities that are required for the Studio to run.
 *
 * The application performs these checks before booting and aborts if any
 * API is unavailable. Keeping the logic centralized ensures that feature
 * requirements stay in sync with the documentation and user messaging.
 *
 * @public
 * @throws {Error} When a mandatory Web API is missing from the host
 * browser.
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
