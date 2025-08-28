# MIDI Capture

`CaptureMidi` listens to Web MIDI input devices and forwards filtered note
messages to the recording subsystem. Each capture can restrict events to a
specific channel and normalises note on/off pairs before they are persisted in
the project timeline.
