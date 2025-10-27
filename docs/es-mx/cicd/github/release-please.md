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

## Commits Convencionales

Release Please asume que estás utilizando mensajes de Commits Convencionales. Los prefijos más importantes que debes tener en cuenta son:

*   `fix:` que representa correcciones de errores y se correlaciona con un parche (patch) de SemVer.
*   `feat:` que representa una nueva característica y se correlaciona con una versión menor (minor) de SemVer.
*   `feat!:,` o `fix!:,` `refactor!:,` etc., que representan un cambio disruptivo (breaking change), indicado por el `!`, y resultarán en una versión mayor (major) de SemVer.
