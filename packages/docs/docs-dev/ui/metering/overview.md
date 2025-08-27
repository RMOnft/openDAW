# Metering UI

Developer overview of components responsible for level metering.

## Components

- `VUMeter` – renders an analog-style needle driven by an observable value.
- `VUMeterPanel` – subscribes to engine streams and displays a pair of meters.
- `PeakBroadcaster` – worklet helper that publishes peak and RMS data.
- `SpectrumAnalyser` – FFT-based analyser for visualising frequency content.
- `MeterWorklet` – audio worklet node that forwards metering information to the UI.

These pieces work together to provide responsive metering across the application.
