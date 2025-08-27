# Timeline Markers

Markers indicate logical song sections on the timeline. The marker track
is composed of several UI pieces:

- **MarkerTrackHeader** – displays the "Markers" label in the header
  column.
- **MarkerTrackBody** – canvas element that renders markers and handles
  interaction.
- **MarkerRenderer** – utility responsible for drawing marker boxes and
  labels.
- **MarkerContextMenu** – provides rename, repeat and delete actions.

Double‑clicking on the track adds a new marker at the clicked position.
Markers can be dragged along the timeline and their labels suggested via
`Markers.nextName`.

