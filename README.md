<p align="center">
  <h1 align="center">🔍 gh-browser</h1>
  <p align="center"><i>Browse GitHub repositories with a clean, glassmorphic interface — file trees, content previews, code search, and more</i></p>
  <p align="center">
    <img alt="GitHub Pages" src="https://img.shields.io/badge/live-GitHub%20Pages-blue?style=flat">
    <img alt="Vanilla JS" src="https://img.shields.io/badge/vanilla-JS/HTML/CSS-purple?style=flat">
    <img alt="size" src="https://img.shields.io/badge/size-1370%20lines-yellow?style=flat">
  </p>
</p>

**[→ Open gh-browser](https://neocrev.github.io/gh-browser/)** — type any `owner/repo` and go.

---

## Features

| Category | Features |
|----------|----------|
| **File browser** | Directory tree with file sizes, inline expand/collapse, file search (`t`), branch switcher |
| **Content preview** | Syntax highlighting (30+ langs via highlight.js), CSV tables, images, README rendering |
| **Code search** | Search across repo with language filter, click results to navigate |
| **Commits tab** | Full commit list with expandable diff view (file list, line stats) |
| **PRs tab** | Pull request list with detail view (description, files changed, status) |
| **Issues tab** | Issue list with detail view (body, labels, comments) |
| **Releases tab** | Release list with notes and asset downloads |
| **Download** | Individual files or entire directories as ZIP (client-side via JSZip) |
| **Keyboard shortcuts** | `?` help, `g` root, `t` file search, `/` focus input, `1-6` tab switching, `Esc` blur |
| **Autocomplete** | Repo input with recent + trending suggestions |
| **User/org profiles** | Search `user:name` to see stats, repos, top languages |

## Quick start

```bash
# Open in browser and enter a repo:
https://neocrev.github.io/gh-browser/?repo=owner/repo

# Or use the input field:
#   owner/repo     — browse a repository
#   user:username  — view user/organization profile
#   paste full URL — automatically parsed
```

## Tabs

| Key | Tab | What you see |
|-----|-----|-------------|
| `1` | Files | Directory tree, file preview, README |
| `2` | Commits | Commit history with expandable diffs |
| `3` | PRs | Pull requests with detail view |
| `4` | Issues | Issues with comments |
| `5` | Releases | Release notes and downloads |
| `6` | Search | Code search across the repo |

## How it works

Uses the [GitHub REST API](https://docs.github.com/en/rest) to fetch repository data, contents, branches, commits, PRs, issues, and releases. Raw files are fetched from `raw.githubusercontent.com`. ZIP archives are built client-side with [JSZip](https://stuk.github.io/jszip/). Markdown is rendered with [marked](https://marked.js.org/). Code is highlighted with [highlight.js](https://highlightjs.org/).

**No server. No backend. No build step.** Just open the HTML file or visit the Pages link.

## Tech

- Vanilla JavaScript (ES6+)
- [highlight.js](https://highlightjs.org/) via CDN — syntax highlighting
- [marked](https://marked.js.org/) via CDN — markdown rendering
- [JSZip](https://stuk.github.io/jszip/) via CDN — client-side ZIP archives
- Tokyo Night color theme
- Glassmorphism design (translucent cards, backdrop blur)

## Authentication

gh-browser works without authentication (60 requests/hour unauthenticated). For higher limits:

```js
storage("token", "your_github_token")
```

Run this in the browser console. The token is stored in `localStorage` and never sent anywhere except GitHub's API.

---

<p align="center"><sub>Made by an AI agent, designed for humans.</sub></p>
