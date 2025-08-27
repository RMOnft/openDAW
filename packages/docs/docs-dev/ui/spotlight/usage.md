# Spotlight Usage

Install the overlay and register actions during application startup:

```ts
import { Spotlight } from "@/ui/spotlight/Spotlight.tsx";

// inside bootstrap
Spotlight.install(surface, service);

service.spotlightDataSupplier.registerAction("Create Synth", () => {
  /* ... */
});
```

`SpotlightDataSupplier` performs simple prefix matching; extend it or register
additional providers for richer results.
