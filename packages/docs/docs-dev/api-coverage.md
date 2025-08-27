# API Coverage

Documentation coverage measured with `typedoc-plugin-coverage`.
See the [project roadmap](../../../ROADMAP.md) for planned improvements:

- [`@opendaw/lib-runtime`](./package-inventory.md#lib) – 0%
- [`@opendaw/lib-dsp`](./package-inventory.md#lib) – 0%
- [`@opendaw/lib-dom`](./package-inventory.md#lib) – 0%
- [`@opendaw/lib-midi`](./package-inventory.md#lib) – 2%
- [`@opendaw/lib-box`](./package-inventory.md#lib) – 0%
- [`@opendaw/lib-box-forge`](./package-inventory.md#lib) – 0%
- [`@opendaw/lib-jsx`](./package-inventory.md#lib) – 0%
- [`@opendaw/lib-fusion`](./package-inventory.md#lib) – 0%
- [`@opendaw/lib-std`](./package-inventory.md#lib) – 0%

See the full list of packages in the [package inventory](./package-inventory.md).

## Running `typedoc-plugin-coverage`

1. Install the plugin (once per repository):

```bash
npm install --save-dev typedoc-plugin-coverage
```

2. Run TypeDoc for the package you want to check. The following example
   analyzes `@opendaw/lib-midi` and writes results to a temporary directory:

```bash
npx typedoc packages/lib/midi/src/index.ts \
  --tsconfig packages/lib/midi/tsconfig.json \
  --out tmp/midi-docs \
  --plugin typedoc-plugin-coverage \
  --coverageOutputType json \
  --skipErrorChecking
```

The plugin produces `coverage.svg` and `coverage.json` inside the output
folder. The JSON file makes it easy to inspect the results.

## Interpreting the output

A typical `coverage.json` looks like:

```json
{
  "percent": 2,
  "expected": 93,
  "actual": 2,
  "notDocumented": ["Channel", "..."]
}
```

- **percent** – percentage of exported declarations with documentation.
- **expected** – total declarations that should be documented.
- **actual** – number of declarations with TSDoc comments.
- **notDocumented** – identifiers missing documentation.

## Improving coverage

- Add TSDoc comments (`/** ... */`) for each name listed in
  `notDocumented`.
- Include descriptions, parameter/return tags, and examples as needed.
- Re‑run the coverage command to ensure the percentage increases and the
  `notDocumented` list shrinks.

Contributions to improve coverage are welcome—see
[Contributing](./contributing.md) for guidelines. For doc style, consult the
[Writing Guide](./style/writing-guide.md).
