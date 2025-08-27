# MIDI Devices

MIDI support relies on the Web MIDI API and a set of helpers that manage device
access and message routing. `MidiDeviceAccess` wraps permission handling and
connection state. `MIDILearning` maps incoming messages to controllable
parameters, while `MIDIMessageSubscriber` simplifies subscribing to message
streams. UI helpers in `MidiDialogs` assist users during configuration.

Related modules:

- `MidiDeviceAccess`
- `MIDILearning`
- `MIDIMessageSubscriber`
- `MidiDialogs`
