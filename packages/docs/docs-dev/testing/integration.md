# Integration tests

Integration tests exercise multiple packages working together and often rely on
sample projects from the [`test-files`](../../../test-files) directory. They are
written with [Vitest](https://vitest.dev) and follow the `*.test.ts` naming
convention alongside the sources.

Typical scenarios include:

- Remote procedure calls via the runtime `Communicator`.
- Round‑tripping DAWproject data through import and export utilities using
  fixtures like `all-devices.od` and `automation.dawproject`.

Run all integration suites with:

```bash
npm test
```

This command executes every package's test script via Turbo, ensuring that
features continue to work together across the monorepo.
