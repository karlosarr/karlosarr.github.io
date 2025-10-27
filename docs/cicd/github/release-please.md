# Release Please

Release Please is a GitHub Action that automates CHANGELOG generation, the creation of GitHub releases, and version bumps for your projects. It accomplishes this by parsing your git history, looking for Conventional Commit messages, and creating release PRs.

## How it works

Instead of continuously releasing what's landed to your default branch, release-please maintains Release PRs. These Release PRs are kept up-to-date as additional work is merged. When you're ready to tag a release, simply merge the release PR.

## Basic Configuration

1.  Create a `.github/workflows/release-please.yml` file with these contents:

```yaml
on:
  push:
    branches:
      - main

permissions:
  contents: write
  pull-requests: write

name: release-please

jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          token: ${{ secrets.MY_RELEASE_PLEASE_TOKEN }}
          release-type: simple
```

2.  Merge the above action into your repository and make sure new commits follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention.

## Conventional Commits

Release Please assumes you are using Conventional Commit messages. The most important prefixes you should have in mind are:

*   `fix:` which represents bug fixes, and correlates to a SemVer patch.
*   `feat:` which represents a new feature, and correlates to a SemVer minor.
*   `feat!:,` or `fix!:,` `refactor!:,` etc., which represent a breaking change (indicated by the `!`) and will result in a SemVer major.
