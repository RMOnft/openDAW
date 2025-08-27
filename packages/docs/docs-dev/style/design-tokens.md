# Design Tokens

Design tokens provide a single source of truth for colours and layout metrics
used throughout the Studio. The CSS custom properties live in
[`colors.sass`](../../../app/studio/src/colors.sass) and are surfaced to
TypeScript via [`Colors.ts`](../../../studio/core/src/Colors.ts) and
[`ColorCodes.ts`](../../../studio/core/src/ColorCodes.ts).

## Colors

| Token | Description |
|-------|-------------|
| `--color-blue` | Accent blue used for links and active states |
| `--color-green` | Confirmation and success highlight |
| `--color-yellow` | Warning and caution tone |
| `--color-cream` | Neutral cream for subtle surfaces |
| `--color-red` | Error and destructive action color |
| `--color-orange` | Secondary accent orange |
| `--color-purple` | Decorative purple accent |
| `--color-bright` | Brightest text color |
| `--color-gray` | Default interface text color |
| `--color-dark` | Muted text or disabled elements |
| `--color-shadow` | Shadow and border color |
| `--color-black` | Deepest shadow tone |
| `--background` | Global application background |
| `--panel-background-bright` | Elevated panel surface |
| `--panel-background` | Default panel surface |
| `--panel-background-dark` | Sunken panel surface |

## Layout

| Token | Description |
|-------|-------------|
| `--lane-height` | Standard height of sequencer lanes |
| `--timeline-header-width` | Width of timeline header area |

## Utility

| Token | Description |
|-------|-------------|
| `$BRIGHTENER` | Overlay to slightly increase brightness |
| `$DARKENER` | Overlay to slightly decrease brightness |

