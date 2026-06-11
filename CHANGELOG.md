# Changelog

## unreleased

### Features
- Add Search tab with code search across repo and language filter, see #search
- Add keyboard shortcuts for tab switching (1-6)
- Add "Open on GitHub" button in file preview bar
- Add "Copy" button to copy file content to clipboard
- Add row number toggle to CSV preview

### Documentation
- Redesign README with table layout, quick start, and keyboard shortcuts reference

## 2026-06-11

### Features
- Add Releases tab with inline detail view and asset downloads
- PR and issue inline detail views (description, files, comments)
- Commit detail view with inline diff, file list, and stats
- Render CSV/TSV files as sortable HTML tables
- Syntax highlighting for 30+ languages via highlight.js
- README rendering at repo root with "Show more" toggle
- Branch switcher with tree re-render
- Folder download as ZIP (client-side with JSZip)
- User/org profile view with stats and top languages
- Trending repos on homepage
- Recent repos with autocomplete
- Keyboard shortcuts (?, g, t, /, Esc)
- Glassmorphism UI with Tokyo Night theme
- Responsive design (desktop, tablet, mobile)

### Bug Fixes
- Handle repo loading errors with specific messages
- Fix autocomplete keyboard navigation
- Handle binary file detection for edge case extensions
