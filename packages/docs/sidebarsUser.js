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
      ],
    },
  ],
};
