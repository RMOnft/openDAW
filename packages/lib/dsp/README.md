_This package is part of the openDAW SDK_

# @opendaw/lib-dsp

Digital Signal Processing utilities and audio processing functions for TypeScript projects.

## API Docs

See the [API documentation](https://opendaw.org/docs/api/dsp/) for detailed reference.

## Signal Flow

```mermaid
graph LR
    A[Input] --> B((Biquad))
    B --> C{{Stereo}}
    C --> D[Output]
```

See {@link BiquadProcessor} and {@link StereoMatrix} for the stages shown above.

## Core Audio Processing

* **fft.ts** - Fast Fourier Transform implementations
* **rms.ts** - Root Mean Square calculations
* **delay.ts** - Audio delay effects and processing
* **stereo.ts** - Stereo audio processing utilities ({@link StereoMatrix})
* **window.ts** - Windowing functions for signal processing ({@link Window})

## Oscillators & Synthesis

* **osc.ts** - Oscillator implementations and waveform generation
* **value.ts** - Audio value processing and manipulation
* **ramp.ts** - Smooth parameter transitions and ramping ({@link Ramp})

## Musical Theory & MIDI

* **notes.ts** - Musical note utilities and conversions
* **chords.ts** - Chord theory and generation ({@link Chord})
* **midi-keys.ts** - MIDI key mapping and utilities ({@link MidiKeys})
* **fractions.ts** - Musical fraction calculations ({@link Fraction})

## Timing & Rhythm

* **ppqn.ts** - Pulses Per Quarter Note timing utilities ({@link PPQN})
* **bpm-tools.ts** - Beats Per Minute calculations and tools ({@link BPMTools})
* **grooves.ts** - Rhythm and groove pattern utilities

## Audio Graph & Events

* **graph.ts** - Audio processing graph utilities ({@link Graph})
* **events.ts** - Audio event handling and scheduling ({@link EventCollection})
* **fragmentor.ts** - Audio fragment processing

## Filters & Effects

* **biquad-coeff.ts** - Biquad filter coefficient calculations ({@link BiquadCoeff})
* **biquad-processor.ts** - Biquad filter processing implementation ({@link BiquadProcessor})

## Utilities

* **utils.ts** - General DSP utility functions
* **global-console.d.ts** - Global console type definitions
