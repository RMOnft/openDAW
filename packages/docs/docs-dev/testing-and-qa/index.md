# Testing and QA

openDAW uses [Vitest](https://vitest.dev) for unit tests and leverages browser-based end‑to‑end tests to ensure core workflows function correctly. Audio processing is validated with dedicated tests that compare generated waveforms against reference data.

## Running the test suite

```bash
npm test
```

This command runs all tests across packages in sequence. Please make sure tests pass before submitting a pull request.

## Writing tests

- **Unit tests** cover individual modules and should be fast and deterministic.
- **End‑to‑end tests** exercise user flows in a browser environment. Use them for integration scenarios.
- **Audio tests** validate DSP components by checking numerical output or audio snapshots.

Adding tests alongside your changes helps keep the project stable and prevents regressions.
