# File Management

openDAW stores projects and audio samples in the browser's origin private file system (OPFS). Projects can be saved under custom names, exported as portable bundles and re‑imported later.

## Saving projects

Use **Save** to persist the current project, or **Save As** to create a copy under a new name. Each project consists of a `.od` file containing the arrangement plus a metadata file and optional cover image.

## Exporting bundles

Bundles package a project together with all referenced samples into a single `.odb` archive. This makes it easy to move projects between machines. Choose **Export Bundle** to create the archive and download it to disk.

## Importing bundles

Select **Import Bundle** to load an `.odb` archive. Samples and project data are written into OPFS and a new session is created.

## Removing samples

Unused samples can be deleted from storage via the sample browser. openDAW will warn when a sample is still referenced by a project.

