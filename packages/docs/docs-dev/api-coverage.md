# API Coverage

Documentation coverage measured with `typedoc-plugin-coverage`:

- `@opendaw/lib-runtime`: 0%
- `@opendaw/lib-dsp`: 0%
- `@opendaw/lib-midi`: 2%

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
