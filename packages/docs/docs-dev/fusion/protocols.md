# Fusion Protocols

Fusion defines clear contracts for message exchange between the main thread and
workers:

- **LiveStream** – transfers raw audio frames between broadcaster and receiver
  ports.
- **SamplePeakProtocol** – requests waveform peak computation and returns the
  resulting data.
- **OpfsProtocol** – proxies file system operations to a dedicated OPFS worker.
