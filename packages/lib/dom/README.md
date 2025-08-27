_This package is part of the openDAW SDK_

# @opendaw/lib-dom

Utility helpers for working with the browser DOM and related Web APIs. The
module groups together small focused utilities that are shared across the
openDAW projects.

## API Docs

See the [API documentation](https://opendaw.org/docs/api/dom/) for detailed reference.

## Browser Support

Tested on the latest versions of Chrome, Firefox, Safari, and Edge. See the
[browser support documentation](../../docs/docs-dev/browser-support.md) for
details.

## HTML & DOM Manipulation

- HTML element creation and manipulation utilities **html.ts**
- SVG element creation and manipulation **svg.ts**
- CSS styling utilities and helpers **css-utils.ts**
## Installation

```bash
npm install @opendaw/lib-dom
```

## Usage

- Event handling utilities and abstractions **events.ts**
- Keyboard input handling and key mapping **keyboard.ts**
- Drag and drop functionality **dragging.ts**
- Modifier key state management **modfier-keys.ts**
```ts
import { Browser, AnimationFrame } from "@opendaw/lib-dom";

if (Browser.isMacOS()) {
  console.log("Running on macOS");
}

- 2D canvas context utilities and helpers **context-2d.ts**
AnimationFrame.add(() => console.log("frame"));
AnimationFrame.start();
```

## Modules

- File handling and manipulation utilities **files.ts**
- File compression and decompression **compression.ts**

### HTML & DOM Manipulation

- HTML element creation and manipulation utilities **html.ts**
- SVG element creation and manipulation **svg.ts**
- CSS styling utilities and helpers **css-utils.ts**

- Browser detection and compatibility utilities **browser.ts**
- Font loading and management **fonts.ts**
- Error handling for DOM operations **errors.ts**
- Console utility commands **console-commands.ts**

### Input & Interaction

- Event handling utilities and abstractions **events.ts**
- Keyboard input handling and key mapping **keyboard.ts**
- Drag and drop functionality **dragging.ts**
- Modifier key state management **modifier-keys.ts**

- Animation frame utilities **frames.ts**
- Stream processing for DOM operations **stream.ts**
- Resource cleanup and termination handling **terminable.ts**
### Graphics & Canvas

- 2D canvas context utilities and helpers **context-2d.ts**

### File Operations

- File handling and manipulation utilities **files.ts**
- File compression and decompression **compression.ts**

### System & Browser

- Browser detection and compatibility utilities **browser.ts**
- Font loading and management **fonts.ts**
- Error handling for DOM operations **errors.ts**
- Console utility commands **console-commands.ts**

### Performance & Lifecycle

- Animation frame utilities **frames.ts**
- Stream processing for DOM operations **stream.ts**
- Resource cleanup and termination handling **terminable.ts**

For more in‑depth discussion see the [developer docs](../docs/docs-dev/dom/overview.md).
