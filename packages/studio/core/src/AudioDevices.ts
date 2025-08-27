import {Promises} from "@opendaw/lib-runtime"
import {Arrays, isInstanceOf, warn} from "@opendaw/lib-std"
import {ConstrainDOM} from "@opendaw/lib-dom"

/**
 * Utility for working with microphone hardware.
 *
 * The class exposes convenience methods to request user permissions,
 * enumerate available inputs and open streams with custom constraints.
 */
export class AudioDevices {
    /**
     * Requests access to the microphone and updates the internal list of
     * available input devices.
     */
    static async requestPermission() {
        const {status, value: stream} =
            await Promises.tryCatch(navigator.mediaDevices.getUserMedia({audio: true}))
        if (status === "rejected") {return warn("Could not request permission.")}
        stream.getTracks().forEach(track => track.stop())
        await this.updateInputList()
    }

    /**
     * Retrieves a {@link MediaStream} that matches the provided constraints.
     *
     * @param constraints - Desired media track configuration.
     */
    static async requestStream(constraints: MediaTrackConstraints): Promise<MediaStream> {
        const {status, value: stream, error} =
            await Promises.tryCatch(navigator.mediaDevices.getUserMedia({audio: constraints}))
        if (status === "rejected") {
            return warn(isInstanceOf(error, OverconstrainedError) ?
                error.constraint === "deviceId"
                    ? `Could not find device with id: '${ConstrainDOM.resolveString(constraints.deviceId)}'`
                    : error.constraint
                : String(error))
        }
        return stream
    }

    /**
     * Refreshes the cached list of available audio input devices.
     */
    static async updateInputList() {
        this.#inputs = Arrays.empty()
        const {status, value: devices} = await Promises.tryCatch(navigator.mediaDevices.enumerateDevices())
        if (status === "rejected") {
            return warn("Could not enumerate devices.")
        }
        this.#inputs = devices.filter(device =>
            device.kind === "audioinput" && device.deviceId !== "" && device.groupId !== "")
    }

    static #inputs: ReadonlyArray<MediaDeviceInfo> = Arrays.empty()

    /**
     * Returns the most recently enumerated list of audio inputs.
     */
    static get inputs(): ReadonlyArray<MediaDeviceInfo> {return this.#inputs}
}
