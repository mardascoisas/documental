# Feature Request: Separation of Content and Configuration via Structured Markdown Chapters with Frontmatter

## Summary

Currently, Documental couples all narrative text, chapter markup, map camera parameters, and global settings into a single monolithic JavaScript file (`config.js`). 

We propose decoupling story content from technical configuration by introducing a modular **`content/chapters/`** structure where each chapter is an individual Markdown (`.md`) file equipped with **YAML frontmatter** for chapter-specific map parameters, alignments, and lifecycle hooks. Global narrative metadata and map styles can reside in a clean `config.json` or `config.js`.

---

## Motivation & Problem Statement

Documental is an outstanding, accessible open-source framework for geospatial scrollytelling. However, as stories scale in length and editorial collaboration expands, the current monolithic `config.js` model poses several friction points:

1. **Editorial Friction for Non-Programmer Authors:**
   Writers, journalists, ethnographers, and field researchers often collaborate on scrollytelling projects. Writing long-form prose and HTML tags inside JavaScript string literals (`description: "..."`) is unnatural and prone to syntax breakage (e.g., unescaped quotes, mismatched backticks, trailing comma errors crashing the entire site).

2. **Git Collaboration & Merge Conflicts:**
   When multiple contributors write or edit different chapters simultaneously, or when translators produce localized versions, editing a single central array in `config.js` frequently generates painful Git merge conflicts.

3. **Incompatibility with Modern Markdown Tooling:**
   Writers cannot leverage modern personal knowledge management (PKM) tools or Markdown editors (such as Obsidian, VS Code, iA Writer, MarkText, Logseq, or Typora) to review, spell-check, and format their narratives with live preview.

4. **Reviewability in Pull Requests:**
   Reviewing a Git diff for a chapter edit in a 1,000-line JavaScript object is noisy and difficult. Having one file per chapter turns PR diffs into clean, readable editorial reviews.

---

## Proposed Architecture

### 1. Suggested Directory Structure

```text
my-scrollytelling-project/
├── content/
│   ├── config.json              # Global story configuration, MapLibre style, theme, map bounds
│   └── chapters/
│       ├── 01-abertura.md       # Chapter 1
│       ├── 02-territorio.md     # Chapter 2
│       ├── 03-bacia-hidro.md    # Chapter 3
│       └── ...
├── assets/
│   ├── data/locations.geojson
│   ├── images/
│   └── ...
├── index.html
└── ...
```

### 2. Chapter File Specification (`01-abertura.md`)

Each chapter file uses standard YAML frontmatter for spatial and behavioral definitions, with standard Markdown for the card's narrative body:

```markdown
---
id: abertura
title: "Encontro Mar das Coisas"
badge: "Abertura · Ubatuba"
alignment: "center"
hidden: false
location:
  center: [-45.1235, -23.5012]
  zoom: 13.5
  pitch: 35.0
  bearing: -15.0
onChapterEnter:
  - layer: "river-tracks"
    opacity: 1.0
onChapterExit:
  - layer: "river-tracks"
    opacity: 0.0
---

Em agosto de 2026, pesquisadores, artistas, ativistas e comunidades tradicionais reuniram-se na costa norte de São Paulo para investigar as transformações socioecológicas da bacia hidrográfica local.

### O Laboratório Costeiro

O percurso tem início na **Base LACO (IOUSP)**, onde os sensores de campo foram calibrados:

![Laboratório de Oceanografia Costeira](assets/images/laco-base.jpg "Base de pesquisa e calibração instrumental na Enseada do Flamengo")

> "A água não é apenas um recurso a ser medido, mas um território comum que articula saberes, memórias e lutas."
```

### 3. Global Configuration (`content/config.json`)

Contains metadata, global styles, and optional chapter sequencing:

```json
{
  "title": "Mar das Coisas · Documental",
  "subtitle": "Scrollytelling Territorial e Cartografia Cidadã",
  "byline": "Coletivo Mar das Coisas",
  "footer": "Conteúdo sob licença CC BY 4.0",
  "map": {
    "style": "https://demotiles.maplibre.org/style.json",
    "theme": "dark",
    "defaultCenter": [-45.1235, -23.5012],
    "defaultZoom": 12
  },
  "chapters": [
    "01-abertura.md",
    "02-territorio.md",
    "03-bacia-hidro.md"
  ]
}
```

---

## Technical Implementation Options

We see two viable paths to implement this without sacrificing Documental's zero-barrier-to-entry ethos:

### Approach A: In-Browser Client-Side Resolution (Zero-Build / 100% Static)

Keep Documental completely dependency-free from a Node/npm runtime perspective:
- When `app.js` initializes, it fetches `content/config.json`.
- It dynamically fetches each Markdown file listed in `config.json` via standard `fetch()`.
- Uses a tiny in-browser frontmatter extractor (or regex + `js-yaml` / browserified parser) and parses the Markdown body using Documental's existing Markdown engine (e.g. `marked.js`).
- **Advantage:** Works directly on GitHub Pages, GitLab Pages, or any local static web server without requiring a build step, bundler, or Node.js installation.

### Approach B: Optional Static Compiler / Pre-render Script (`build.js`)

For projects seeking optimal initial page load performance or offline distribution:
- Provide a small standalone script (e.g., `node scripts/build.js` or `python scripts/build.py`).
- The script parses `content/chapters/*.md`, extracts the frontmatter, and compiles the result into a cached `assets/data/story-manifest.json` or `config.js`.
- An optional GitHub Action (`.github/workflows/deploy.yml`) can auto-compile on commit when publishing to GitHub Pages.

---

## Backwards Compatibility

Existing Documental projects should not break. `app.js` can simply implement a fallback check:

```javascript
if (typeof window.config !== "undefined") {
    // Legacy mode: use monolithic config.js
    initScrollytelling(window.config);
} else {
    // Modern mode: load modular content/config.json and content/chapters/*.md
    loadModularStory("content/config.json").then(initScrollytelling);
}
```

---

## Benefits

1. **Accessibility for Storytellers:** Writers can focus on pure Markdown in their favorite text editors without worrying about JavaScript formatting or syntax errors.
2. **Clean Version Control:** Granular Git history with one commit per chapter topic, readable visual diffs, and conflict-free concurrent editing.
3. **Headless & CMS Integration:** Opens the door for Git-based headless CMS tools like Decap CMS (formerly Netlify CMS) or TinaCMS with zero custom configuration.
4. **Future Extensions:** Chapters can easily be reordered, translated (`content/es/`, `content/pt/`), or included/excluded via the manifest array.
