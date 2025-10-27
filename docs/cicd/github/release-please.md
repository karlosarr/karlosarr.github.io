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

### Prerequisites: Configuring the Access Token

The `release-please` action requires a GitHub token to create Pull Requests, tags, and releases on your behalf. The example uses `secrets.MY_RELEASE_PLEASE_TOKEN`, which you need to configure.

#### What is `secrets.MY_RELEASE_PLEASE_TOKEN`?

It's a secure way to use a **Personal Access Token (PAT)** in your workflow. Using GitHub Secrets prevents your token from being exposed in your code or logs. `MY_RELEASE_PLEASE_TOKEN` is the name given to the secret, but you can name it differently as long as you update the workflow file.

#### How to Create and Configure the Token

**Step 1: Generate a Personal Access Token (Classic)**

1.  Go to your GitHub **Settings** > **Developer settings**.
2.  Navigate to **Personal access tokens** > **Tokens (classic)**.
3.  Click **Generate new token (classic)**.
4.  Give it a descriptive name (e.g., `release-please-token`).
5.  Set an expiration date for security.
6.  Under **Select scopes**, check the **`repo`** scope. This grants the necessary permissions to manage the repository.
7.  Click **Generate token** and **copy the token immediately**. You will not be able to see it again.

**Step 2: Add the Token as a Repository Secret**

1.  Go to your repository's **Settings** > **Secrets and variables** > **Actions**.
2.  Click **New repository secret**.
3.  For the **Name**, enter `MY_RELEASE_PLEASE_TOKEN`.
4.  In the **Secret** box, paste the token you just generated.
5.  Click **Add secret**.

Your workflow will now be able to authenticate and manage releases in your repository.

## Conventional Commits

Release Please assumes you are using Conventional Commit messages. The most important prefixes you should have in mind are:

*   `fix:` which represents bug fixes, and correlates to a SemVer patch.
*   `feat:` which represents a new feature, and correlates to a SemVer minor.
*   `feat!:,` or `fix!:,` `refactor!:,` etc., which represent a breaking change (indicated by the `!`) and will result in a SemVer major.

## Examples by Project Type

The `release-type` parameter should be adjusted based on the project's language and structure.

### Node.js

For a standard Node.js project with a `package.json`:

```yaml
on:
  push:
    branches:
      - main
name: release-please
jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          token: ${{ secrets.MY_RELEASE_PLEASE_TOKEN }}
          release-type: node
```

### Python

For a Python project with `setup.py` or `pyproject.toml`:

```yaml
on:
  push:
    branches:
      - main
name: release-please
jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          token: ${{ secrets.MY_RELEASE_PLEASE_TOKEN }}
          release-type: python
```

### Java (Maven)

For a Java project using Maven, which will update `pom.xml` and generate SNAPSHOT versions:

```yaml
on:
  push:
    branches:
      - main
name: release-please
jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          token: ${{ secrets.MY_RELEASE_PLEASE_TOKEN }}
          release-type: maven
```

### Helm

For a Helm chart with a `Chart.yaml`:

```yaml
on:
  push:
    branches:
      - main
name: release-please
jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          token: ${{ secrets.MY_RELEASE_PLEASE_TOKEN }}
          release-type: helm
```
