# Instrucciones para el Agente (AGENTS.md)

¡Hola, Jules! Esta es una guía para trabajar en mi sitio web personal.

## 📜 Resumen del Proyecto

Este repositorio es mi sitio web personal, construido con **Docsify**. La característica más importante a tener en cuenta es que es **bilingüe (inglés y español)**.

### Estructura de Archivos Clave

- `docs/`: Contiene todo el contenido en **inglés**.
- `docs/es-mx/`: Contiene todo el contenido en **español**.
- `docs/_sidebar.md`: Define la barra de navegación para la versión en **inglés**.
- `docs/es-mx/_sidebar.md`: Define la barra de navegación para la versión en **español**.

## ✅ Reglas Fundamentales

1.  **¡TODO ES BILINGÜE!** Cualquier página nueva que crees o contenido que modifiques de forma significativa **DEBE** ser replicado en ambos idiomas. Si te pido añadir una página sobre "X", tienes que crearla tanto en `docs/` como en `docs/es-mx/`.

2.  **Actualizar la Navegación:** Si añades, eliminas o renombras una página, **DEBES** actualizar los archivos `_sidebar.md` en **AMBOS** idiomas para que los enlaces reflejen los cambios.

## 🧪 Cómo Probar los Cambios

Además de la verificación visual, el repositorio incluye una prueba de "humo" para detectar enlaces rotos comunes en la barra lateral.

### Prueba de Humo de Enlaces Rotos

Esta prueba analiza los archivos `_sidebar.md` para asegurar que no contengan enlaces que apunten a `/#`.

-   **Ejecutar la prueba:**
    ```bash
    python test_links.py
    ```

### Verificación Visual

Este es un proyecto visual, por lo que las "pruebas" consisten en verificar que el sitio se vea bien.

1.  **Instalar dependencias (si no lo has hecho):**
    ```bash
    npm install -g docsify-cli
    ```
2.  **Iniciar el servidor local:**
    ```bash
    docsify serve docs
    ```
    Usa este comando en segundo plano (`&`) para poder seguir trabajando.

## ⚙️ Verificación Visual Obligatoria

Antes de enviar cualquier cambio con `submit`, es **OBLIGATORIO** que realices una verificación visual de tus cambios.

1.  Inicia el servidor local: `docsify serve docs > docsify.log &`
2.  Crea un script de Playwright para navegar a las páginas que modificaste (tanto en inglés como en español).
3.  Toma capturas de pantalla de las páginas actualizadas.
4.  Usa la herramienta `read_image_file` para revisar las capturas y asegurarte de que los cambios se ven como esperabas.
5.  Usa `frontend_verification_complete()` para marcar la verificación como completada.
