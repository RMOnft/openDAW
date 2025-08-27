# Error Handling

openDAW favors surfacing errors to callers instead of suppressing them. Many helpers let exceptions bubble up while using `panic` for unrecoverable states.

## Guidelines

- Treat `AbortError` specially and allow other DOM exceptions to propagate.
- Network and stream utilities return rejected promises on failure; call sites must handle these rejections.
- Use `panic` only for logic errors that should never occur in production.

These notes complement inline comments throughout the codebase.
