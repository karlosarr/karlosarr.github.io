# CI/CD Deployment for iOS

This document describes the GitHub Actions workflow to build and analyze an iOS application.

## Workflow Trigger

The workflow is automatically triggered on every `push` to the `main` branch and on every `pull request` to it.

```yaml
on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
```

## Workflow Steps

### 1. Environment Setup

- **Checkout Code:** Downloads the repository's source code.
- **Pod Installation:** Installs CocoaPods dependencies.
- **Environment Information:** Displays the macOS version and hardware the workflow is running on.

```yaml
- name: Checkout
  uses: actions/checkout@v3
- name: Pod install
  run: |
    pod install
- name: Version Mac
  run: |
    system_profiler SPSoftwareDataType SPHardwareDataType
```

### 2. Xcode Scheme Selection

Determines and selects the default Xcode scheme for the build.

```yaml
- name: Set Default Scheme
  run: |
    scheme_list=$(xcodebuild -list -json | tr -d "\n")
    default=$(echo $scheme_list | ruby -e "require 'json'; puts JSON.parse(STDIN.gets)['project']['targets'][0]")
    echo $default | cat >default
    echo Using default scheme: $default
```

### 3. Build

Builds the Xcode project using the selected scheme. The build is performed without code signing.

```yaml
- name: Build
  env:
    scheme: ${{ 'default' }}
  run: |
    if [ $scheme = default ]; then scheme=$(cat default); fi
    if [ "`ls -A | grep -i \\.xcworkspace\$`" ]; then filetype_parameter="workspace" && file_to_build="`ls -A | grep -i \\.xcworkspace\$`"; else filetype_parameter="project" && file_to_build="`ls -A | grep -i \\.xcodeproj\$`"; fi
    file_to_build=`echo $file_to_build | awk '{$1=$1;print}'`
    xcodebuild clean build -workspace SwiftAppiOS.xcworkspace -scheme SwiftAppiOS -configuration Release -sdk 'iphoneos' CODE_SIGNING_ALLOWED=NO | xcpretty && exit ${PIPESTATUS[0]}
```
