# Logging

openDAW provides several lightweight helpers for collecting diagnostic
information while developing or running the Studio.

## Console capture

The [`LogBuffer`](/dev/debugging/error-logging#logbuffer) monkey patches the
browser's console methods in production builds and keeps a bounded history of
recent messages. When an error is reported the buffer is included in the
payload so that the server receives context for the failure.

## Sync logs

Project changes can be serialized using the `SyncLogWriter` and related
utilities. The `SyncLogService` integrates these pieces into the Studio and can
start a new log or append to an existing file. This stream of commits is useful
for reproducing complex editing sessions.

## Timing helpers

For ad-hoc instrumentation the `stopwatch` function prints labelled laps to the
console, while `TimeSpanUtils.startEstimator` returns a function that projects
the remaining time of a process based on its progress.

## Warnings

The `warn` helper throws a dedicated `Warning` error type. The global
`ErrorHandler` treats these differently from fatal exceptions and displays an
informational dialog to the user.
