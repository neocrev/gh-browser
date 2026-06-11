# gh-browser

> Browse GitHub repositories with a clean, glassmorphic interface — file trees, content previews, downloads, and more.

## Features

- **Glassmorphism UI** — Tokyo Night–themed with translucent glass cards, blur effects, and smooth animations
- **File browser** — directory tree with file sizes, inline folder expand/collapse, and file search
- **Content preview** — view text files with syntax highlighting (30+ languages via highlight.js)
- **README rendering** — markdown rendered at repo root, collapsed by default (first 9 lines, "Show more" toggle)
- **Branch switcher** — switch between branches and re-render the tree
- **File downloads** — download individual files or entire directories as ZIP archives (client-side with JSZip)
- **License notice** — shows the repository's license before downloading
- **Verified badge** — green checkmark for repos with 5,000+ stars
- **User/org search** — search by username or org to see profile stats (followers, stars, top languages, account age)
- **Trending repos** — curated list of 30 popular repos on the homepage
- **Autocomplete** — dropdown with recent repos and trending matches as you type (`repo:` and `user:` prefixes supported)
- **Recent repos** — quick access to previously browsed repos (remove individual entries with ×)
- **Recent activity** — collapsible section showing pushes, issues, PRs, releases, and more (loaded on demand, hidden by default)
- **Keyboard shortcuts** — `?` help, `g` go to root, `t` focus file search, `/` focus input, `Esc` blur
- **API status** — shows remaining requests and reset time; supports authentication tokens
- **Responsive** — works on desktop, tablet, and mobile (3 breakpoints)

## Usage

```
https://neocrev.github.io/gh-browser/?repo=owner/repo
```

Or enter `owner/repo` (or `user:username`) in the input field.

## How it works

Uses the [GitHub REST API](https://docs.github.com/en/rest) to fetch repository metadata, contents, and branches. Raw file content is fetched from `raw.githubusercontent.com`. ZIP downloads are built entirely client-side with [JSZip](https://stuk.github.io/jszip/). Markdown is rendered with [marked](https://marked.js.org/). No server required.

## License

Custom license — see [LICENSE](LICENSE). All Rights Reserved.
