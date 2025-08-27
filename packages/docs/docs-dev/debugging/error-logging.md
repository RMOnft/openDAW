# Error Logging

The Studio installs a global `ErrorHandler` that listens for uncaught errors and rejected promises. When triggered it gathers a normalized `ErrorInfo`, the current `BuildInfo`, and recent console output from the `LogBuffer`.

In production these details are serialized into an `ErrorLog` payload and sent to the logging service. The report can then be reviewed on the dedicated errors page inside the Studio.
