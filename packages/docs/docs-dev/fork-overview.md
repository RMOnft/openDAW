# Fork Overview

## Fork Differences

This fork of openDAW is maintained by the community. It tracks upstream development while documenting differences and clarifications for contributors and users.

## Unique Features

openDAW emphasizes user privacy and simplicity:

- **No SignUp**
- **No Tracking**
- **No Cookie Banners**
- **No User Profiling**
- **No Terms & Conditions**
- **No Ads**
- **No Paywalls**
- **No Data Mining**

## ODB Bundle Support & Specification

openDAW can export and import compact project bundles with the `.odb` extension. The bundle is a zipped archive that stores:

- A format `version` marker
- The project `uuid`
- The serialized `project.od` file
- Project metadata `meta.json`
- An optional cover image `image.bin`
- A `samples` directory containing all referenced audio files

## DAWproject Read/Write Status

DAWproject support is available as an early preview. openDAW can import a `.dawproject` file, reconstruct the project graph, load referenced audio, and create a new session. Export writes the current session to a `.dawproject` file with basic metadata.

## Licensing & Branding

openDAW uses a dual-licensing model: GPL v3 (or later) for open-source usage and a commercial license for closed-source products. Branding references should retain the "openDAW" name and logo.

## Hosting Domain & Canonical URL

The canonical domain for this fork is [https://opendaw.org](https://opendaw.org). All project documentation and releases should reference this URL as the primary source.
