# State

The Studio maintains its user interface and engine state through a collection
of observable values and service classes. Core helpers from the
`@opendaw/lib-std` package provide `Observable` and `MutableObservableValue`
primitives that allow components to react to changes without tight coupling.

High level services such as `SessionService` and `StudioService` expose these
observables to coordinate project loading, transport control and other
application features. Components subscribe to these values and update the UI or
audio engine in response.

For commit history and synchronisation details see the
[SyncLog architecture](sync-log.md).

