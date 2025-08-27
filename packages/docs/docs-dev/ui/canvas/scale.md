# Scale

Translate between domain units and normalized `[0,1]` values.

`LinearScale` maps units linearly while `LogScale` maps exponentially for
values like frequency. Both implement the `Scale` interface with `unitToNorm`
and `normToUnit` methods.
