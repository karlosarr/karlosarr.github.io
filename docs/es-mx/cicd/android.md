# Despliegue CI/CD para Android

Este documento describe el flujo de trabajo de GitHub Actions para construir, firmar y distribuir una aplicación de Android.

## Disparador del Flujo de Trabajo

El flujo de trabajo se activa automáticamente cuando se crea un nuevo `tag` en el repositorio que sigue un patrón de versionado semántico (por ejemplo, `1.0.0`, `2.1.3`).

```yaml
on:
  push:
    tags:
      - '*.*.*'
```

## Pasos del Flujo de Trabajo

### 1. Configuración del Entorno

- **Checkout del Código:** Descarga el código fuente del repositorio.
- **Configuración de JDK:** Instala y configura la versión 17 de Java (Zulu).
- **Configuración de la Versión:** Extrae el número de versión del `tag` de Git y lo guarda en una variable de entorno.

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

### 2. Versionado de la Aplicación

Actualiza la versión de la aplicación en el archivo `app/build.gradle.kts`.

```yaml
- name: Bump version
  uses: chkfung/android-version-actions@v1.2.1
  with:
    gradlePath: app/build.gradle.kts
    versionCode: ${{github.run_number}}
    versionName: "0.0.1" # Opcional: usar la versión del tag
```

### 3. Compilación

- **Permisos de Ejecución:** Otorga permisos de ejecución al script `gradlew`.
- **Compilación del Paquete:** Compila la aplicación en modo `release` para generar un Android App Bundle (AAB).

```yaml
- name: Grant execute permission for gradlew
  run: chmod +x gradlew
- name: Build with Gradle
  run: ./gradlew bundleRelease
```

### 4. Firma de la Aplicación

Firma el AAB generado utilizando una clave de firma almacenada de forma segura en los secretos del repositorio.

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

### 5. Distribución

Sube el AAB firmado a App Center para distribuirlo a los testers.

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

### 6. Artefacto

Sube el AAB firmado como un artefacto del flujo de trabajo para que pueda ser descargado.

```yaml
- uses: actions/upload-artifact@v3
  with:
    name: Signed app bundle
    path: ${{steps.sign_app.outputs.signedReleaseFile}}
```
