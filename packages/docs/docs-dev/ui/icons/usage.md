# Icon Usage

Include `<IconLibrary />` once near the root of the application. Individual icons are rendered with the [`Icon`](../../../../app/studio/src/ui/components/Icon.tsx) component:

```tsx
import { Icon, IconSymbol } from "@opendaw/studio-adapters";

<Icon symbol={IconSymbol.Play} />
```

The `symbol` prop maps to entries in the `IconSymbol` enum. Additional styling is applied through CSS, allowing icons to inherit color and size from their context.
