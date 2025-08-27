# Cover Art Component

`Cover` shows the current project cover image and provides an overlay button to
select a new image from the file system.

## Usage

```tsx
const model = new MutableObservableOption<ArrayBuffer>(initialCover)
<Cover lifecycle={lifecycle} model={model} />
```
