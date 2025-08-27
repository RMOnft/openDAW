/** Sidebar for developer documentation.
 * Referenced from docusaurus.config.ts; see docs-dev/documentation-site/structure.md
 */
module.exports = {
  devSidebar: [
    { type: "doc", id: "intro" },
    { type: "doc", id: "contributing" },
    { type: "doc", id: "testing-and-qa/index" },
    { type: "doc", id: "performance" },
    { type: "doc", id: "security" },
    { type: "doc", id: "security-privacy" },
    { type: "doc", id: "browser-support" },
    {
      type: "category",
      label: "Configuration",
      items: ["configuration/eslint"],
    },
    { type: "doc", id: "licensing" },
    {
      type: "category",
      label: "Architecture",
      items: [
        "architecture/overview",
        "architecture/audio-path",
        "architecture/browser-compat",
      ],
    },
    {
      type: "category",
      label: "XML",
      items: [
        "xml/overview",
        "xml/parsing",
        "xml/serialization",
        "xml/namespaces",
        "xml/validation",
        "xml/examples",
        "xml/integration",
        "xml/pitfalls",
        "xml/best-practices",
        "xml/troubleshooting",
      ],
    },
    {
      type: "category",
      label: "Box Forge",
      items: [
        { type: "doc", id: "box-forge/overview" },
        { type: "doc", id: "box-forge/schema-format" },
        { type: "doc", id: "box-forge/examples" },
        { type: "doc", id: "box-forge/integration" },
      ],
    },
    {
      type: "category",
      label: "Extending",
      items: [
        { type: "doc", id: "extending/opendaw-sdk" },
        { type: "doc", id: "extending/plugin-guide" },
        { type: "doc", id: "extending/plugin-api" },
        { type: "doc", id: "extending/plugin-examples" },
        { type: "doc", id: "extending/testing-plugins" },
        { type: "doc", id: "extending/processor-guide" },
      ],
    },
    {
      type: "category",
      label: "UI",
      items: [
        {
          type: "category",
          label: "Timeline",
          items: [
            "ui/timeline/editors",
            "ui/timeline/renderers",
            "ui/timeline/performance",
          ],
        },
        "ui/browse"
      ],
    },
    {
      type: "category",
      label: "Boxes",
      items: [
        { type: "doc", id: "boxes/overview" },
        { type: "doc", id: "boxes/examples" },
        { type: "doc", id: "boxes/diagram" },
        { type: "doc", id: "boxes/faq" },
      ],
    },
    {
      type: "category",
      label: "UI",
      items: [
        {
          type: "category",
          label: "Piano Roll",
          items: [
            { type: "doc", id: "ui/piano-roll/overview" },
            { type: "doc", id: "ui/piano-roll/visualizers" },
            { type: "doc", id: "ui/piano-roll/metronome" },
            { type: "doc", id: "ui/piano-roll/faq" },
          ],
        },
  "ui/mixer"
},{
      type: "category",
      label: "Services",
      items: [
        "services/overview",
        "services/sessions",
        "services/shortcuts",
        "services/sync",
        "services/stems",
      ],
    },
  ],
};
