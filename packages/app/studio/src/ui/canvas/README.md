## Canvas Utilities

Helpers in this folder abstract common canvas tasks used across the studio.

### Coordinate Systems

Rendering works with three coordinate spaces:

- **Pixel** – actual device pixels used by the `2d` context.
- **CSS** – logical pixel size of the canvas element.
- **Unit** – domain values such as time or amplitude mapped through a `Scale`.

`CanvasPainter` exposes the canvas size in both CSS and device pixels and
handles resize events. `CanvasUnitPainter` builds on top by converting between
unit values and pixels using separate scales for each axis. `Capturing` helpers
translate mouse or pointer positions to these local coordinates.

Together these utilities provide a consistent way to map application data to
the canvas and react to user interaction.
