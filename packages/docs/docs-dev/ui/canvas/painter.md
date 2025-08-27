# Painter

`CanvasPainter` schedules rendering and tracks canvas size. Use its
`requestUpdate` method to redraw on resize or state changes.

`CanvasUnitPainter` adds unit-to-pixel conversion via separate `Scale`
instances for each axis, enabling direct drawing in application units.
