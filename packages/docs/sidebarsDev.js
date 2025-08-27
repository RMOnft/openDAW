module.exports = {
  devSidebar: [
    { type: "doc", id: "intro" },
    { type: "doc", id: "contributing" },
    { type: "doc", id: "testing-and-qa/index" },
    { type: "doc", id: "performance" },
    { type: "doc", id: "security" },
    { type: "doc", id: "security-privacy" },
    { type: "doc", id: "browser-support" },
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
        ]
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
  ],
};
