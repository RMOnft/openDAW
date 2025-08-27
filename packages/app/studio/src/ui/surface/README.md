# Surface UI

The surface module provides a lightweight wrapper around browser windows used by
openDAW. A `Surface` tracks pointer position, exposes layers for ground content
and flyout overlays, and offers helpers for tooltips and floating inputs.

## Components

- `Surface` – core window wrapper.
- `TextTooltip` – simple tooltip for textual information.
- `ValueTooltip` – tooltip displaying numeric values with units.

Use `Surface.main` to bootstrap the primary window and `Surface.create` to spawn
additional surfaces. Tooltips are available through the `surface.textTooltip`
and `surface.valueTooltip` instances.
