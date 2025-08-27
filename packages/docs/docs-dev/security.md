# Security

openDAW leverages modern browser capabilities to keep the development
environment safe. Keep the following in mind when working on the project:

- Serve development builds over **HTTPS** to ensure required APIs remain
  available.
- Only load worker and worklet bundles from **trusted origins**.
- Validate network responses and avoid exposing secrets in requests.
- Keep dependencies up to date and audit them for known vulnerabilities.

See the [architecture security notes](./architecture/security.md) for a deeper
look at how the system is isolated.
