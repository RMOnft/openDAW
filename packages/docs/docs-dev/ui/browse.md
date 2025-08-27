# Browser UI

The browser panel lets users switch between device and sample lists.

## Components

- **BrowseScope** – enum for selecting _Devices_ or _Samples_.
- **BrowserPanel** – top‑level container with scope selector.
- **DevicesBrowser** – lists built‑in instruments and effects and installs drag sources.
- **SampleBrowser** – lists local and cloud samples with preview and management actions.
- **SampleView** – renders an individual sample row with playback and edit controls.
- **SampleService** – utility class for sample deletion and track creation.

## Styling

SASS modules under `ui/browse` define layout for the panel, device list, and sample list.
