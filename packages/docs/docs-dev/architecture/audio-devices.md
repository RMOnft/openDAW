# Audio devices

The studio interacts with audio hardware through the Web Audio API.  Microphone
access is requested on demand and the list of available inputs is cached for
later selection.  Streams can be opened with custom constraints to target a
specific device or channel configuration.

The `AudioDevices` helper centralizes permission handling and device
enumeration.  It exposes convenience methods to request user approval and to
refresh the list of inputs when hardware changes are detected.

