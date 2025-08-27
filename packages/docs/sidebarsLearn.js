/** Sidebar for learning resources.
 * Referenced from docusaurus.config.ts; see docs-dev/documentation-site/structure.md
 */
module.exports = {
  learnSidebar: [
    { type: 'doc', id: 'intro' },
    { type: 'doc', id: 'daw-basics-101' },
    { type: 'doc', id: 'teacher-pack' },
    { type: 'doc', id: 'lesson-plan-template' },
    {
      type: 'category',
      label: 'How It Works',
      items: [
        'how-it-works/storage-model',
        'how-it-works/latency-and-buffers',
        'how-it-works/groove-examples',
      ],
    },
    {
      type: 'category',
      label: 'Lessons',
      items: [
        'lessons/mixing-techniques',
        'lessons/audio-effects-and-signal-chain',
        'lessons/exporting-and-sharing',
        'lessons/midi-and-synthesis',
        'lessons/arrangement-basics',
        'lessons/automation',
      ],
    },
  ],
};
