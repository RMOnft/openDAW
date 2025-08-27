# Latency and Buffers

Audio in the browser is processed in small chunks called buffers. Each buffer
contains a fixed number of samples that the audio hardware consumes at regular
intervals. The time between these hardware callbacks determines the base
latency of the system.

## Buffer size and latency

Smaller buffers reduce latency because the audio thread delivers audio to the
device more frequently. However, less time is available for the engine to fill
each buffer. If the system cannot compute the next buffer in time the user hears
drop-outs or glitches. Larger buffers provide more safety but increase the delay
between user interaction and audible result.

## Scheduling

openDAW schedules audio work ahead of time to keep the audio thread supplied
with buffers. When the buffer size is 128 samples at 48 kHz, for example, the
engine has roughly 2.7 ms to render the next block of audio. Timers and events
are aligned to this cadence so that sequencing remains tight across different
devices.

## Device round-trip

Latency is cumulative. MIDI or user interface events travel through the audio
graph, are queued into buffers, and finally emerge from the speakers after the
hardware has processed them. Monitoring external signals adds another trip
through the converters. Understanding this round-trip time is essential when
recording or synchronising with other gear.
