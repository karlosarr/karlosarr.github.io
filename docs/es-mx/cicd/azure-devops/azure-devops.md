# Despliegue con Azure DevOps

Este documento describe los flujos de trabajo de Azure DevOps para construir y analizar aplicaciones de iOS y Android.

## Despliegue de iOS

Este flujo de trabajo construye una aplicación de iOS utilizando Xcode.

### Flujo de Trabajo de Azure Pipelines

```yaml
# Xcode
# Build, test, and archive an Xcode workspace on macOS.
# Add steps that install certificates, test, sign, and distribute an app, save b
uild artifacts, and more:
# https://docs.microsoft.com/azure/devops/pipelines/languages/xcode

trigger:
- main

pool:
  name: 'macos'
  #vmImage: 'macos-latest'

steps:
- task: Cache@2
  inputs:
    key: 'pods | "$(Agent.OS)" | Podfile.lock'
    path: '$(System.DefaultWorkingDirectory)/Pods'
    cacheHitVar: 'PODS_CACHE_RESTORED'
- task: CmdLine@2
  inputs:
    script: 'Pod --version'
- task: CocoaPods@0
  inputs:
    forceRepoUpdate: true
  condition: and(succeeded(), ne(variables.PODS_CACHE_RESTORED, 'true'))
- task: SonarCloudPrepare@1
  inputs:
    SonarCloud: 'Sonarcloud'
    organization: 'karlosarr'
    scannerMode: 'CLI'
    configMode: 'file'
    extraProperties: |
      sonar.cfamily.build-wrapper-output="build_wrapper_output_directory"
- task: CmdLine@2
  displayName: "Sonar Wrapper"
  inputs:
    script: |
      wget https://sonarcloud.io/static/cpp/build-wrapper-macosx-x86.zip
      unzip build-wrapper-macosx-x86.zip
      ls build-wrapper-macosx-x86
      build-wrapper-macosx-x86/build-wrapper-macosx-x86 --out-dir build_wrapper_
output_directory xcodebuild clean build -workspace SwiftAppiOS.xcworkspace -sche
me SwiftAppiOS -configuration Release -sdk 'iphoneos' CODE_SIGNING_ALLOWED=NO
- task: SonarCloudAnalyze@1
  inputs:
    jdkversion: 'JAVA_HOME_17_X64'
- task: SonarCloudPublish@1
  inputs:
    pollingTimeoutSec: '300'
- task: Xcode@5
  inputs:
    actions: 'build'
    configuration: 'Release'
    sdk: 'iphoneos'
    xcWorkspacePath: 'SwiftAppiOS.xcworkspace'
    scheme: 'SwiftAppiOS'
    packageApp: false
```

## Despliegue de Android

Este flujo de trabajo construye una aplicación de Android utilizando Gradle.

### Flujo de Trabajo de Azure Pipelines

```yaml
# Android
# Build your Android project with Gradle.
# Add steps that test, sign, and distribute the APK, save build artifacts, and m
ore:
# https://docs.microsoft.com/azure/devops/pipelines/languages/android

trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: SonarCloudPrepare@1
  inputs:
    SonarCloud: 'Sonarcloud'
    organization: 'karlosarr'
    scannerMode: 'Other'
- task: Gradle@2
  inputs:
    gradleWrapperFile: './gradlew'
    workingDirectory: '$(System.DefaultWorkingDirectory)'
    tasks: 'bundleRelease'
    publishJUnitResults: false
    javaHomeOption: 'JDKVersion'
    jdkVersionOption: '1.17'
    gradleOptions: '-Xmx3072m'
    sonarQubeRunAnalysis: true
    sqGradlePluginVersionChoice: 'build'
    spotBugsAnalysis: false
- task: SonarCloudPublish@1
  inputs:
    pollingTimeoutSec: '300'
- task: CopyFiles@2
  inputs:
    SourceFolder: '$(System.DefaultWorkingDirectory)/app/build/outputs/bundle/re
lease/'
    Contents: '**.aab'
    TargetFolder: '$(build.artifactstagingdirectory)/'
- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: '$(Build.ArtifactStagingDirectory)'
    ArtifactName: 'drop'
    publishLocation: 'Container'
```
