# Despliegue en GitHub Pages

GitHub Pages es un servicio de alojamiento de sitios estáticos que toma archivos HTML, CSS y JavaScript directamente desde un repositorio en GitHub, los procesa opcionalmente a través de un proceso de compilación y publica un sitio web.

Puedes desplegar en GitHub Pages utilizando GitHub Actions, lo que te da más control sobre el proceso de construcción y te permite usar varios generadores de sitios estáticos o pasos de compilación personalizados.

## Implementación de Referencia

Para un ejemplo completo y funcional de un sitio web desplegado en GitHub Pages usando GitHub Actions, puedes consultar el siguiente repositorio:

* [karlosarr/karlosarr.github.io](https://github.com/karlosarr/karlosarr.github.io)

Este repositorio demuestra cómo configurar los flujos de trabajo (workflows) y las configuraciones necesarias para compilar y desplegar automáticamente un sitio estático en GitHub Pages cada vez que se envían cambios a la rama principal.

## Ejemplo Básico de Workflow

Para desplegar tu sitio usando GitHub Actions, puedes crear un archivo de workflow (por ejemplo, `.github/workflows/deploy.yml`) similar a este:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.' # Actualiza esta ruta si la compilación sale a un directorio específico
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Asegúrate de habilitar el despliegue de GitHub Actions en la configuración de tu repositorio bajo **Settings > Pages > Build and deployment > Source** seleccionando **GitHub Actions**.
