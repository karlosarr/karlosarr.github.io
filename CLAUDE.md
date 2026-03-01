# CLAUDE.md

This file provides guidance to Claude (and other AI coding assistants) when working on this repository.

## Project Overview

This is a personal website/documentation site built with **[Docsify](https://docsify.js.org/)**, hosted via **GitHub Pages** at [karlosarr.github.io](https://karlosarr.github.io). The project uses GitHub Actions for CI/CD automation.

---

## 🧠 Claude Expertise Context

When assisting with this repository, Claude should operate as an expert in:

### Docsify
- Deep knowledge of Docsify's configuration (`window.$docsify` in `index.html`)
- Sidebar generation via `_sidebar.md`, navbar via `_navbar.md`, and cover pages via `_coverpage.md`
- Plugin ecosystem: `docsify-copy-code`, `docsify-pagination`, `docsify-search`, `docsify-tabs`, etc.
- Theme customization (Vue, dark, buble, pure) and custom CSS overrides
- Routing modes: `hash` vs `history` mode, and implications for GitHub Pages
- Markdown extensions: callouts, code highlighting with Prism.js, embedded media
- Performance best practices: lazy loading, caching strategies, CDN usage
- SEO considerations within a Docsify SPA (meta tags, `404.html` redirect trick)

### GitHub Actions
- Workflow authoring with `on:` triggers (push, pull_request, schedule, workflow_dispatch)
- Job dependencies (`needs:`), matrix strategies, and conditional steps (`if:`)
- Secrets management (`secrets.*`) and environment variables
- Actions for GitHub Pages deployment: `actions/deploy-pages`, `peaceiris/actions-gh-pages`
- Caching dependencies (`actions/cache`) for Node/Python/Bun
- Writing reusable workflows and composite actions
- Security best practices: pinning action versions by SHA, using `GITHUB_TOKEN` with minimal permissions, avoiding secret exposure in logs
- Workflow linting and validation

---

## 📁 Project Structure

```
.
├── .github/              # GitHub Actions workflows and community health files
├── .vscode/              # Editor settings
├── docs/                 # Docsify documentation source (main content)
│   ├── _sidebar.md       # Sidebar navigation
│   ├── _navbar.md        # Top navigation bar
│   ├── index.html        # Docsify entry point and configuration
│   └── *.md              # Documentation pages
├── index.ts              # TypeScript entry (Docsify loader)
├── package.json          # Node dependencies and scripts
├── test_links.py         # Link validation script
├── AGENTS.md             # Guidance for Codex/OpenAI agents
├── CLAUDE.md             # This file — guidance for Claude
├── CHANGELOG.md          # Release history
└── SECURITY.md           # Security policy
```

---

## ✅ Best Practices to Follow

### Docsify
- Always keep `_sidebar.md` in sync when adding or renaming pages
- Use relative links for internal navigation (e.g., `[Page](./folder/page.md)`)
- Prefer CDN-hosted plugins over self-hosted to keep the repo lightweight
- Test locally with `npm run docsify:dev` before pushing changes
- Validate that all internal links resolve (`test_links.py`)
- Avoid hardcoding the base URL; rely on Docsify's `basePath` configuration
- Keep the `index.html` clean: group all plugins at the bottom before `</body>`

### GitHub Actions
- Pin third-party actions to a specific commit SHA (e.g., `uses: actions/checkout@v4`)
- Grant the minimum required permissions using `permissions:` at the job level
- Store sensitive data in GitHub Secrets, never in workflow files
- Add `timeout-minutes:` to all jobs to prevent runaway workflows
- Use `concurrency:` groups to cancel outdated workflow runs on the same branch
- Prefer `pull_request` triggers over `push` to `main` for validation workflows
- Always add a manual trigger (`workflow_dispatch`) to deployment workflows

### General
- Write commit messages following [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat:`, `fix:`, `docs:`, `chore:`)
- Keep `CHANGELOG.md` updated following [Keep a Changelog](https://keepachangelog.com/) format
- Use Bun or npm consistently — do not mix package managers in the same PR

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start Docsify dev server
npm run docsify:dev
# → http://localhost:3000

# Run link validation
python test_links.py
```

---

## 🔒 Security

See [SECURITY.md](./SECURITY.md) and [Security.txt](./Security.txt) for the project's security policy and responsible disclosure process.
