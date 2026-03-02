# GitHub Pages Deployment

GitHub Pages is a static site hosting service that takes HTML, CSS, and JavaScript files straight from a repository on GitHub, optionally runs the files through a build process, and publishes a website.

You can deploy to GitHub Pages using GitHub Actions, which gives you more control over the build process and allows you to use various static site generators or custom build steps.

## Reference Implementation

For a complete working example of a website deployed to GitHub Pages using GitHub Actions, you can refer to the following repository:

* [karlosarr/karlosarr.github.io](https://github.com/karlosarr/karlosarr.github.io)

This repository demonstrates how to set up the necessary workflows and configurations to automatically build and deploy a static site to GitHub Pages whenever changes are pushed to the main branch.

## Basic Workflow Example

To deploy your site using GitHub Actions, you can create a workflow file (e.g., `.github/workflows/deploy.yml`) similar to this:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.' # Update this path if your build outputs to a specific directory
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Make sure to enable GitHub Actions deployment in your repository settings under **Settings > Pages > Build and deployment > Source** by selecting **GitHub Actions**.
