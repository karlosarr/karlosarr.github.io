# CI/CD Deployment for Android

This document describes the GitHub Actions workflow to build, sign, and distribute an Android application.

## Workflow Trigger

The workflow is automatically triggered when a new `tag` is created in the repository that follows a semantic versioning pattern (e.g., `1.0.0`, `2.1.3`).

```yaml
on:
  push:
    tags:
      - '*.*.*'
```

## Workflow Steps

### 1. Environment Setup

- **Checkout Code:** Downloads the repository's source code.
- **Setup JDK:** Installs and configures Java version 17 (Zulu).
- **Set Version:** Extracts the version number from the Git `tag` and saves it to an environment variable.

```yaml
- uses: actions/checkout@v3
- name: set up JDK 17
  uses: actions/setup-java@v3
  with:
    java-version: '17'
    distribution: 'zulu'
    cache: gradle
- name: Set env
  run: echo "RELEASE_VERSION=${GITHUB_REF#refs/*/}" >> $GITHUB_ENV
```

### 2. Application Versioning

Updates the application version in the `app/build.gradle.kts` file.

```yaml
- name: Bump version
  uses: chkfung/android-version-actions@v1.2.1
  with:
    gradlePath: app/build.gradle.kts
    versionCode: ${{github.run_number}}
    versionName: "0.0.1" # Optional: use the version from the tag
```

### 3. Build

- **Execution Permissions:** Grants execution permissions to the `gradlew` script.
- **Build Bundle:** Compiles the application in `release` mode to generate an Android App Bundle (AAB).

```yaml
- name: Grant execute permission for gradlew
  run: chmod +x gradlew
- name: Build with Gradle
  run: ./gradlew bundleRelease
```

### 4. Application Signing

Signs the generated AAB using a signing key securely stored in the repository's secrets.

```yaml
- uses: noriban/sign-android-release@v3
  name: Sign app APK
  id: sign_app
  with:
    releaseDirectory: app/build/outputs/bundle/release
    signingKeyBase64: ${{ secrets.SIGNING_KEY }}
    alias: ${{ secrets.ALIAS }}
    keyStorePassword: ${{ secrets.KEY_STORE_PASSWORD }}
    keyPassword: ${{ secrets.KEY_PASSWORD }}
```

### 5. Distribution

Uploads the signed AAB to App Center to distribute it to testers.

```yaml
- name: upload artefact to App Center
  uses: wzieba/AppCenter-Github-Action@v1
  with:
    appName: karlosarr/pokedex
    token: ${{secrets.APP_CENTER_TOKEN}}
    group: Collaborators,Public
    file: ${{steps.sign_app.outputs.signedReleaseFile}}
    notifyTesters: true
```

### 6. Artifact

Uploads the signed AAB as a workflow artifact so it can be downloaded.

```yaml
- uses: actions/upload-artifact@v3
  with:
    name: Signed app bundle
    path: ${{steps.sign_app.outputs.signedReleaseFile}}
```
