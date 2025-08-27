# Timeline

Arrange clips against musical time and control playback.

![Timeline overview](./img/timeline-overview.png)

## Navigation

Use the loop brace and time axis to scroll or set the play range.

![Timeline navigation](./img/timeline-navigation.png)

## Snapping

Enable snapping to align edits to the musical grid.

![Timeline snapping menu](./img/timeline-snapping.png)

## Example Integration

```ts
import {CanvasUnitPainter, LinearScale} from "@opendaw/app-studio/ui/canvas";

const painter = new CanvasUnitPainter(
    canvas,
    new LinearScale(0, timeline.length),
    new LinearScale(0, 1),
    p => {
        const ctx = p.context;
        ctx.clearRect(0, 0, p.actualWidth, p.actualHeight);
        // draw custom timeline markers here
    }
);
```
