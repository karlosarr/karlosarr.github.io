# Release Please

Release Please es una Acción de GitHub que automatiza la generación de CHANGELOG, la creación de lanzamientos (releases) en GitHub y los incrementos de versión para tus proyectos. Logra esto analizando tu historial de git, buscando mensajes de Commits Convencionales y creando PRs de lanzamiento.

## Cómo funciona

En lugar de lanzar continuamente lo que ha llegado a tu rama principal, `release-please` mantiene PRs de Lanzamiento (Release PRs). Estos PRs de lanzamiento se mantienen actualizados a medida que se fusiona trabajo adicional. Cuando estés listo para etiquetar un lanzamiento, simplemente fusiona el PR de lanzamiento.

## Configuración Básica

1.  Crea un archivo `.github/workflows/release-please.yml` con este contenido:

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

2.  Fusiona la acción anterior en tu repositorio y asegúrate de que los nuevos commits sigan la convención de [Commits Convencionales](https://www.conventionalcommits.org/en/v1.0.0/).

### Prerrequisitos: Configurar el Token de Acceso

La acción `release-please` requiere un token de GitHub para crear Pull Requests, etiquetas y releases en tu nombre. El ejemplo utiliza `secrets.MY_RELEASE_PLEASE_TOKEN`, que necesitas configurar.

#### ¿Qué es `secrets.MY_RELEASE_PLEASE_TOKEN`?

Es una forma segura de usar un **Token de Acceso Personal (PAT)** en tu workflow. Usar los Secretos de GitHub evita que tu token sea expuesto en tu código o en los logs. `MY_RELEASE_PLEASE_TOKEN` es el nombre que se le da al secreto, pero puedes nombrarlo de forma diferente siempre que actualices el archivo del workflow.

#### Cómo Crear y Configurar el Token

**Paso 1: Generar un Token de Acceso Personal (Clásico)**

1.  Ve a tu **Configuración** de GitHub > **Configuración de desarrollador**.
2.  Navega a **Tokens de acceso personal** > **Tokens (clásico)**.
3.  Haz clic en **Generar nuevo token (clásico)**.
4.  Dale un nombre descriptivo (ej., `release-please-token`).
5.  Establece una fecha de caducidad por seguridad.
6.  En **Seleccionar ámbitos**, marca la casilla **`repo`**. Esto otorga los permisos necesarios para gestionar el repositorio.
7.  Haz clic en **Generar token** y **copia el token inmediatamente**. No podrás volver a verlo.

**Paso 2: Añadir el Token como un Secreto del Repositorio**

1.  Ve a la **Configuración** de tu repositorio > **Secretos y variables** > **Acciones**.
2.  Haz clic en **Nuevo secreto del repositorio**.
3.  Para el **Nombre**, introduce `MY_RELEASE_PLEASE_TOKEN`.
4.  En la caja de **Secreto**, pega el token que acabas de generar.
5.  Haz clic en **Añadir secreto**.

Tu workflow ahora podrá autenticarse y gestionar los lanzamientos en tu repositorio.

## Commits Convencionales

Release Please asume que estás utilizando mensajes de Commits Convencionales. Los prefijos más importantes que debes tener en cuenta son:

*   `fix:` que representa correcciones de errores y se correlaciona con un parche (patch) de SemVer.
*   `feat:` que representa una nueva característica y se correlaciona con una versión menor (minor) de SemVer.
*   `feat!:,` o `fix!:,` `refactor!:,` etc., que representan un cambio disruptivo (breaking change), indicado por el `!`, y resultarán en una versión mayor (major) de SemVer.

## Ejemplos por Tipo de Proyecto

El parámetro `release-type` debe ajustarse según el lenguaje y la estructura del proyecto.

### Node.js

Para un proyecto estándar de Node.js con un `package.json`:

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

Para un proyecto de Python con `setup.py` o `pyproject.toml`:

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

Para un proyecto de Java que usa Maven, lo que actualizará `pom.xml` y generará versiones SNAPSHOT:

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

Para un chart de Helm con un archivo `Chart.yaml`:

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
