# Stats For Startups - Content Management and Internationalization

This document provides guidance on content management and internationalization (i18n) for the Stats For Startups website. It is intended for developers and content contributors who will be working with the content in this repository.

## Content Structure

The content for the Stats For Startups website is organized as follows:

```
content/
├── en/                     # English content
│   ├── kpis/               # KPI definitions
│   │   ├── Runway.mdx
│   │   └── conversion-rate.mdx
│   ├── lists/              # Collections of KPIs
│   │   ├── frequent_kpi.mdx
│   │   └── index.mdx
│   └── tags/               # Tag categories and definitions
│       ├── function/
│       │   ├── finance.mdx
│       │   └── human-resources.mdx
│       └── startup-stage/
│           ├── growth.mdx
│           └── idea.mdx
├── index.mdx               # Root content page
├── nextra.config.js        # Nextra configuration
└── theme.config.jsx        # Theme configuration
```

## Internationalization Support

The website is built with full internationalization support using Next.js and Nextra v4. The system uses URL-based language selection (e.g., `/en/kpis/`, `/fr/kpis/`).

### Adding a New Language

To add support for a new language:

1. **Create language content directory**:
   Create a new directory in the `/content` folder with the language code as the name:

   ```
   content/
   ├── en/
   └── fr/              # New French content
   ```

2. **Update configuration**:
   In `lib/i18n/config.js`, add the new language to the `SUPPORTED_LANGUAGES` array:

   ```javascript
   export const SUPPORTED_LANGUAGES = [
     {
       code: 'en',
       name: 'English',
       flag: '🇺🇸',
       dir: 'ltr',
       dateFormat: 'MM/DD/YYYY',
       default: true
     },
     {
       code: 'fr',
       name: 'Français',
       flag: '🇫🇷',
       dir: 'ltr',
       dateFormat: 'DD/MM/YYYY'
     }
   ]
   ```

3. **Create translation dictionary**:
   Create a new dictionary file in `lib/i18n/fr.json` based on the English version:

   ```json
   {
     "siteTitle": "Stats Pour Startups",
     "siteDescription": "Un référentiel d'indicateurs de performance clés pour les startups",
     "siteKeywords": "KPI, startup, métriques, indicateurs de performance, métriques commerciales",
     
     // Add the rest of the translations...
   }
   ```

4. **Update dictionary loader**:
   In `lib/i18n/getDictionary.js`, add the new language to the dictionaries:

   ```javascript
   const dictionaries = {
     en: () => import('./en.json'),
     fr: () => import('./fr.json')
   }
   ```

5. **Update Next.js configuration**:
   In `next.config.mjs`, add the new language to the i18n configuration:

   ```javascript
   i18n: {
     locales: ['en', 'fr'],
     defaultLocale: 'en',
     localeDetection: false
   }
   ```

6. **Update Nextra configuration**:
   In `content/nextra.config.js`, add the new language to the content directories:

   ```javascript
   contentDirs: {
     en: './en',
     fr: './fr'
   }
   ```

7. **Add content**:
   Add translated content to the new language directory, following the same structure as the English content.

### RTL Language Support

The system has built-in support for right-to-left (RTL) languages such as Arabic, Hebrew, and Persian.

To add an RTL language (e.g., Arabic):

1. Follow the steps for adding a new language (as above)
2. Set the `dir` property to `'rtl'` in the language configuration:

   ```javascript
   {
     code: 'ar',
     name: 'العربية',
     flag: '🇸🇦',
     dir: 'rtl',
     dateFormat: 'DD/MM/YYYY'
   }
   ```

The application will automatically handle text direction for RTL languages.

## Content Guidelines

### KPI MDX Files

KPI files follow this format:

```markdown
---
title: Conversion Rate
abbreviation: ConR
alternativeNames:
- Conversions
- Acquisition conversion rate
updatedAt: '2021-07-20T12:40:42'
tags:
- name: Sales and Marketing
  category: Function
  slug: sales-marketing
- name: Growth
  category: Startup stage
  slug: growth
relatedKpis:
- name: Viral Coefficient
  abbreviation: Virl
  slug: Viral-Coefficient
---

# Conversion Rate (ConR)

Content goes here...
```

When translating KPI content:

1. Translate the title, abbreviation, and content
2. Keep the same slugs, categories, and related KPIs
3. Update the `updatedAt` timestamp

### Collections and Tags

Follow the same translation guidelines for collections and tags. Maintain the same slugs and hierarchy to ensure consistent cross-language linking.

## Search Indexing

The search system uses Pagefind, which automatically creates language-specific indexes based on the `data-pagefind-lang` attribute. When new content is added or modified, the search index will be automatically updated during the build process.

## Common Issues

### Missing Translations

If a translation is missing for a specific string, the system will fall back to English.

### Broken Links

Ensure that slugs remain consistent across languages to maintain proper linking between related content.

### Content Synchronization

When updating content in one language, remember to update the corresponding content in other languages to maintain consistency.

## Additional Resources

- [Next.js i18n Documentation](https://nextjs.org/docs/advanced-features/i18n-routing)
- [Nextra Documentation](https://nextra.site/docs)
- [Pagefind Multilingual Documentation](https://pagefind.app/docs/multilingual/)

For any questions or issues related to content management or internationalization, please open an issue in the repository.
