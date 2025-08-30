import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'HRFlow Docs',
  tagline: 'Technical documentation of the HR demand management system',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://hr-flow-njim2zjun-carlos-pissaia-juniors-projects.vercel.app',
  baseUrl: '/',
  organizationName: 'Pissaia92',
  projectName: 'hr-flow',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          routeBasePath: '/',
          editUrl: 'https://github.com/Pissaia92/hr-flow/edit/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/Pissaia92/hrflow/edit/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: '',
      logo: {
        alt: 'HRFlow Logo',
        src: 'img/placeholder-logo.svg',
      },
      items: [
        { to: '/', label: 'Documents', position: 'left' },
        { href: 'https://github.com/Pissaia92/hr-flow', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documents',
          items: [{ label: 'Relatório Técnico', to: '/' }],
        },
        {
          title: 'Código',
          items: [{ label: 'Repositório GitHub', href: 'https://github.com/Pissaia92/hr-flow' }],
        },
      ],
      copyright: `© ${new Date().getFullYear()} HRFlow. Todos os direitos reservados.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },

  plugins: ['./src/plugins/tailwind-plugin.js'],
};

export default config;
