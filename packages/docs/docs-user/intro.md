# User Guide

This guide helps you get started with openDAW and deepen your skills. If you
want to contribute documentation, read the
[Writing Guide](../docs-dev/style/writing-guide.md). For project milestones,
see the [roadmap](../../../ROADMAP.md).

- [Quick Start](quick-start.md) — set up the project and begin making music in minutes.
- [UI Tour](ui-tour.md) — explore the interface and learn where everything lives.
- **Features**
  - [Tracks](features/tracks.md) — arrange audio and MIDI clips.
  - [Piano Roll](features/piano-roll.md) — edit notes and velocities.
  - [Mixer](features/mixer.md) — balance levels and route audio.
  - [Devices and Plugins](features/devices-and-plugins.md) — add instruments and effects.
  - [File Management](features/file-management.md) — save, import, and export projects.
- **Workflows**
  - [Beat Making](workflows/beat.md)
  - [Recording and Effects](workflows/record-and-fx.md)
  - [Automation and Modulation](workflows/automation-modulation.md)
- [Mixing](workflows/mixing.md)
- [Exporting](workflows/exporting.md)
- [Collaboration](workflows/collaboration.md)

## Build from Source

Run these commands from the repository root to work on openDAW locally:

```bash
npm run install:deps
npm install
npm run build
npm test
npm run docs:dev    # local docs preview
npm run docs:build  # static docs output
```
