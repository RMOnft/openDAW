# RMS vs Peak Metering

Metering can display two different measurements of signal level:

- **Peak** reflects the instantaneous maximum amplitude of the samples.
- **RMS** (root mean square) averages energy over time and correlates with
  perceived loudness.

The engine exposes both readings so UI components can show fast peaks alongside
slower moving RMS bars. Using both helps with proper gain staging and headroom
management.
