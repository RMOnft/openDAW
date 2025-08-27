# Spotlight FAQ

**How do I add new commands?**

Use `StudioService.spotlightDataSupplier.registerAction(name, exec)` to
expose a callable action. Names are matched case-insensitively by prefix.

**Can I customize the search algorithm?**

`SpotlightDataSupplier` is intentionally simple. Replace it with a
custom implementation if you need fuzzy matching or additional metadata.
