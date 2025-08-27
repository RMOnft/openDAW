# Timeline Tracks

The timeline can display auxiliary tracks in addition to clip lanes. The
`PrimaryTracks` component manages their visibility and mounts individual
track views as needed.

- **MarkerTrack** – shows song section markers. See the dedicated
  [markers guide](./markers.md).
- **TracksFooter** – hosts the timeline range slider. Details are in the
  [footer documentation](./footer.md).

These components share the main timeline grid and follow the clip layout
using CSS subgrid positioning.

