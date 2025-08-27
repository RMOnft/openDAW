# Studio Error Handling

The Studio runtime installs a global `ErrorHandler` that listens for
unhandled errors and promise rejections. When a failure occurs it gathers
environment details and recent console output and, in production builds,
posts the data to the server.

## Log buffering

`LogBuffer` replaces `console.debug`, `console.info` and `console.warn` in
production to keep a bounded history of messages. This buffer is included in
error reports to aid debugging after the fact.

## Recovery

When available, `Recovery` writes a temporary project backup so users can
restore their session after a crash. The error dialog exposes a command to
trigger this backup.
