# Routing in the Mixer UI

Explains how channel strips, sends and output selectors connect audio within the Studio.

## Channel outputs

`ChannelOutputSelector` lets users reroute a track's signal to any available bus. The component updates label and icon colors to match the chosen destination and offers quick creation of new busses.

## Auxiliary sends

`AuxSendGroup` manages multiple `AuxSend` controls for an audio unit. Each send exposes pan and gain knobs and can target existing or newly created effect busses.

## Hardware devices

`AudioOutputDevices` lists discovered browser audio outputs and allows the user to choose the playback device for the session.
