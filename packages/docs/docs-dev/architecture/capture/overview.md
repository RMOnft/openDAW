# Capture Architecture

The capture layer manages audio and MIDI inputs that feed the recording system.
It instantiates `Capture` objects for audio units and coordinates their lifecycles
through the `CaptureManager`.

- [Audio capture](./audio.md) describes how microphone and line inputs are
  obtained from the browser.
- [MIDI capture](./midi.md) covers incoming note events.
- [Recording worklet](./worklet.md) explains how raw samples are buffered and
  converted into peak data.

This subsystem works in tandem with the [`Recording` API](../../../../studio/core/src/capture/Recording.ts)
which orchestrates the actual recording session.
