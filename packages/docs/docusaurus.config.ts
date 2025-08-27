import type {Config} from '@docusaurus/types';
import {themes as prismThemes} from 'prism-react-renderer';

const config: Config = {
  title: 'openDAW Docs',
  url: 'https://opendaw.org',
  baseUrl: '/docs/',
  favicon: 'img/favicon.svg',
  organizationName: 'andremichelle',
  projectName: 'openDAW',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: { customCss: require.resolve('./src/css/custom.css') },
      },
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],
  markdown: { mermaid: true },

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'dev',
        path: 'docs-dev',
        routeBasePath: 'dev',
        sidebarPath: require.resolve('./sidebarsDev.js'),
        editUrl: 'https://github.com/andremichelle/opendaw/edit/main/packages/docs/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'user',
        path: 'docs-user',
        routeBasePath: 'user',
        sidebarPath: require.resolve('./sidebarsUser.js'),
        editUrl: 'https://github.com/andremichelle/opendaw/edit/main/packages/docs/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'learn',
        path: 'docs-learn',
        routeBasePath: 'learn',
        sidebarPath: require.resolve('./sidebarsLearn.js'),
        editUrl: 'https://github.com/andremichelle/opendaw/edit/main/packages/docs/',
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        id: 'api-core',
        entryPoints: ['../lib/runtime/src/index.ts'],
        tsconfig: '../lib/runtime/tsconfig.json',
        out: 'api',
        excludePrivate: true,
        excludeExternals: false,
        plugin: ['typedoc-plugin-missing-exports'],
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'openDAW',
      logo: { alt: 'openDAW Logo', src: 'img/logo.svg' },
      items: [
        { to: '/dev/intro', label: 'Developers', position: 'left' },
        { to: '/user/intro', label: 'User Guide', position: 'left' },
        { to: '/learn/intro', label: 'Learning Hub', position: 'left' },
        { to: '/api', label: 'API', position: 'left' },
        { href: 'https://github.com/andremichelle/opendaw', label: 'GitHub', position: 'right' },
      ],
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  },
};

export default config;
