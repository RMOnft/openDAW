# Testing plugins

Use the Studio application to load and exercise your plugin during development.

## Running the host

Start the Studio in development mode:

```bash
npm run dev:studio
```

The app reloads automatically when source files change.

## Writing unit tests

Plugins can be tested with any framework. The project uses [Vitest](https://vitest.dev/) for its own packages:

```ts
import { describe, it, expect } from "vitest";
import { GainBox } from "./GainBox";

describe("GainBox", () => {
  it("scales samples", () => {
    const box = new GainBox(/* ... */);
    // assertions
  });
});
```
