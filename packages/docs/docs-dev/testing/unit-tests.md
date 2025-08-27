# Unit tests

The repository uses [Vitest](https://vitest.dev) to run package tests.
Each package keeps its test files next to the source code in the `src`
folder, following the `*.test.ts` naming convention. Running tests from the
monorepo root executes all package suites via Turbo:

```bash
npm test
```

Shared fixtures live in the [`test-files`](../../../test-files)
directory and can be reused across packages.
