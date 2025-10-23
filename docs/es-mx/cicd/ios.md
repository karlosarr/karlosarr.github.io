# Despliegue CI/CD para iOS

Este documento describe el flujo de trabajo de GitHub Actions para construir y analizar una aplicación de iOS.

## Disparador del Flujo de Trabajo

El flujo de trabajo se activa automáticamente en cada `push` a la rama `main` y en cada `pull request` a la misma.

```yaml
on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
```

## Pasos del Flujo de Trabajo

### 1. Configuración del Entorno

- **Checkout del Código:** Descarga el código fuente del repositorio.
- **Instalación de Pods:** Instala las dependencias de CocoaPods.
- **Información del Entorno:** Muestra la versión de macOS y el hardware en el que se está ejecutando el flujo de trabajo.

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

### 2. Selección del Esquema de Xcode

Determina y selecciona el esquema de Xcode por defecto para la compilación.

```yaml
- name: Set Default Scheme
  run: |
    scheme_list=$(xcodebuild -list -json | tr -d "\n")
    default=$(echo $scheme_list | ruby -e "require 'json'; puts JSON.parse(STDIN.gets)['project']['targets'][0]")
    echo $default | cat >default
    echo Using default scheme: $default
```

### 3. Compilación

Compila el proyecto de Xcode utilizando el esquema seleccionado. La compilación se realiza sin firma de código.

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
