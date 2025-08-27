# Mixer

Control levels and routing between tracks and devices.

![Global data flow](../../../../assets/architecture/global-dataflow.svg)

The diagram shows how data moves from the App through the Studio, Runtime and DSP layers before reaching storage.

## Channel strips

Each track is represented by a channel strip containing controls for volume,
pan, mute and solo. Insert slots let you add effects, and send knobs make it
easy to route the signal elsewhere. Adjusting a strip's fader changes the level
that continues to the next stage in the mix.

## Sends and returns

Sends on each channel allow a portion of the signal to be routed to return
tracks. Returns can host time‑based effects like reverbs or delays, and their
outputs are mixed back into the main bus. Sends can be configured as
pre‑ or post‑fader depending on the desired behavior.

## Meter behavior

Channel strips display peak and RMS meters so you can monitor levels at a
glance. Meters glow red when clipping occurs, helping you manage gain staging
across the project.

## Routing through a bus

You can group tracks together by routing them through a bus:

1. Create a new bus track, for example **Drum Bus**.
2. In each drum track's channel strip, set the output to **Drum Bus** rather
   than the master.
3. Add effects on the **Drum Bus** track and adjust its level to blend with the
   rest of the mix.

This setup lets you process and control multiple tracks as one while preserving
individual sends and automation.
