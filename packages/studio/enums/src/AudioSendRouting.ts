/**
 * Routing options for audio sends.
 *
 * Determines whether the send taps the signal before or after the channel fader.
 *
 * @public
 */
export enum AudioSendRouting {
    /** Signal is routed before the channel's fader. */
    Pre,
    /** Signal is routed after the channel's fader. */
    Post
}
