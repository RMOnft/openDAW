/**
 * Ensure the browser exposes all APIs required by the headless demo. This
 * function throws if a feature is missing so the caller can present a useful
 * error to the user.
 */
import {requireProperty} from "@opendaw/lib-std"

/**
 * Test availability of required browser features.
 */
export const testFeatures = async (): Promise<void> => {
    requireProperty(Promise, "withResolvers")
    requireProperty(window, "indexedDB")
    requireProperty(window, "AudioWorkletNode")
    requireProperty(navigator, "storage")
    requireProperty(navigator.storage, "getDirectory")
    requireProperty(crypto, "randomUUID")
    requireProperty(crypto, "subtle")
    requireProperty(crypto.subtle, "digest")
}
