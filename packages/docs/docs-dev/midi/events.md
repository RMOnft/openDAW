# MIDI Events

`ControlEvent` and `MetaEvent` describe the contents of a MIDI track.

- Channel events such as note on/off are represented by `ControlEvent` with a `ControlType`.
- Meta events like tempo changes are represented by `MetaEvent` and `MetaType`.
