/** Sidebar for user guides.
 * Referenced from docusaurus.config.ts; see docs-dev/documentation-site/structure.md
 */
module.exports = {
  userSidebar: [
    { type: "doc", id: "intro" },
    { type: "doc", id: "browser-support" },
    { type: "doc", id: "security" },
    {
      type: "category",
      label: "Features",
      items: [
        "features/tracks",
        "features/mixer",
        "features/piano-roll",
        "features/devices-and-plugins",
        "features/file-management",
        "features/browse",
        "features/notepad",
        "features/search",
      ],
    },
    {
      type: "category",
      label: "Workflows",
      items: [
        "workflows/automation-modulation",
        "workflows/beat",
        "workflows/collaboration",
        "workflows/creating-projects",
        "workflows/dawproject",
        "workflows/exporting",
        "workflows/exporting-and-sharing",
        "workflows/headless-mode",
        "workflows/history",
        "workflows/mixing",
        "workflows/record-and-fx",
        "workflows/sample-management",
      ],
    },
  ],
};
