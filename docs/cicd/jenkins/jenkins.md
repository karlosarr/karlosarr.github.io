# Deployment with Jenkins

This document describes a Jenkins workflow for building and analyzing a Visual Studio project.

## Jenkinsfile

This `Jenkinsfile` defines a declarative pipeline that performs the following steps:

- Clones a Git repository.
- Restores NuGet dependencies.
- Runs a SonarQube analysis.
- Compiles the project.

### Jenkins Workflow

```groovy
pipeline {
    agent any
    parameters {
        string(name: 'bitbucketURL', description: 'URL de bitcuket')
        string(name: 'buildFile', description: 'Solución de Visual Studio')
        string(name: 'projectKey', description: 'Key de sonarqube')
        string(name: 'projectName', description: 'Nombre del proyecto en sonarqube')
    }
    environment {
        msBuildScannerHome = "C:\\sonar-scanner-msbuild-4.6.0.1930-net46\\"
        msNuggetHome = "C:\\Nuget\\"
        msNuggetConfig = "C:\\Nuget\\"
        msBuildHome = "C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Community\\MSBuild\\15.0\\Bin\\"
    }
    stages {
        stage('Git clone repository') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'bitbucket_access', url: '$bitbucketURL']]])
            }
        }
        stage('Donwload nuggets') {
            steps {
                bat "${msNuggetHome}nuget.exe restore %buildFile% -ConfigFile ${msNuggetConfig}\\nuget.config"
            }
        }
        stage('Sonarqube start') {
            steps {
                withSonarQubeEnv('SonarQube Local') {
                    bat "${msBuildScannerHome}SonarQube.Scanner.MSBuild.exe begin /k:%projectKey% /n:%projectName% /d:sonar.host.url=%SONAR_HOST_URL% /d:sonar.login=%SONAR_AUTH_TOKEN%"
                }
            }
        }
        stage('building project') {
            steps {
                bat "\"${msBuildHome}MSBuild.exe\" /p:Configuration=Release  /t:Restore /t:build"
            }
        }
        stage('Sonarqube end') {
            steps {
                withSonarQubeEnv('SonarQube Local') {
                    bat "${msBuildScannerHome}SonarQube.Scanner.MSBuild.exe end /d:sonar.login=%SONAR_AUTH_TOKEN%"
                }
            }
        }
        stage('Clean') {
            steps {
                deleteDir()
            }
        }
    }
}
```
