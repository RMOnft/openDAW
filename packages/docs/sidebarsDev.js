module.exports = {
  devSidebar: [
    { type: "doc", id: "intro" },
    { type: "doc", id: "contributing" },
    { type: "doc", id: "testing-and-qa/index" },
    { type: "doc", id: "performance" },
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
      label: "Boxes",
      items: [
        { type: "doc", id: "boxes/overview" },
        { type: "doc", id: "boxes/examples" },
        { type: "doc", id: "boxes/diagram" },
        { type: "doc", id: "boxes/faq" },
      ],
    },
  ],
};
