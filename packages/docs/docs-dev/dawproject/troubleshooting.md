# Troubleshooting

- Ensure all numeric values use the correct `Unit` from `src/defaults.ts`.
- When parsing fails, inspect the XML against the schema classes for missing attributes.
- Use `ParameterDecoder.readValue` to normalize parameter values before further processing.
