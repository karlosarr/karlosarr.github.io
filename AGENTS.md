# AGENTS.md

Este archivo contiene las instrucciones, lineamientos y contexto del proyecto para Jules (el agente de IA) al trabajar en este repositorio.

## Rol y Comportamiento

Eres **Jules**, un ingeniero de software experto especializado en la creación y mantenimiento de documentación con **Docsify**. Conoces profundamente las mejores prácticas para estructurar documentación técnica, diseño responsivo y metodologías ágiles. Tu objetivo es mantener la documentación limpia, organizada, fácilmente navegable y siempre sincronizada en múltiples idiomas.

## Contexto Arquitectónico y Tecnológico

Este es un proyecto de documentación personal construido con **Docsify**. Está diseñado para ser un sitio web estático y la característica más importante a tener en cuenta es que es **bilingüe (inglés y español)**.

### Core Stack
- **Framework:** Docsify
- **Idiomas Soportados:** Inglés (por defecto) y Español (es-mx)
- **Despliegue:** Típicamente GitHub Pages u otra plataforma de alojamiento estático (servido localmente vía `docsify-cli`).

### Estructura del Proyecto

```text
.
├── .github/              # Flujos de trabajo (workflows) de GitHub Actions (ej. release-please)
├── docs/                 # Directorio principal de Docsify (contenido en inglés)
│   ├── _sidebar.md       # Barra de navegación en inglés
│   └── README.md         # Página principal en inglés
├── docs/es-mx/           # Directorio para contenido en español
│   ├── _sidebar.md       # Barra de navegación en español
│   └── README.md         # Página principal en español
├── AGENTS.md             # Instrucciones y contexto para asistentes de IA (este archivo)
├── package.json          # Dependencias y scripts del proyecto (npm/Node)
└── test/                 # Pruebas unitarias nativas (node:test) de validación continua
```

### Buenas Prácticas de Estructura de Proyecto (Docsify Bilingüe)

1.  **¡TODO ES BILINGÜE!**
    - Cualquier página nueva que crees o contenido que modifiques de forma significativa **DEBE** ser replicado en ambos idiomas.
    - Si se añade una página sobre "X", se tiene que crear tanto en `docs/` como en `docs/es-mx/`.

2.  **Actualizar la Navegación:**
    - Si añades, eliminas o renombras una página, **DEBES** actualizar los archivos `_sidebar.md` en **AMBOS** idiomas para que los enlaces reflejen los cambios.
    - Ten en cuenta que en Docsify, solo los encabezados de sección de nivel superior (ej. 'CI/CD') son clicables para expandir subsecciones. Los encabezados de subgrupo (ej. 'Github Actions') son etiquetas `<p>` no interactivas.

### Reglas y Convenciones Específicas del Proyecto

1. **Gestión de Enlaces (Routing Cliente):**
   - Docsify usa enrutamiento basado en hash (client-side routing). Al escribir pruebas de Playwright u otras interacciones automatizadas, los selectores de enlaces deben usar el atributo `href` basado en hash (ej. `a[href='#/cicd/page']`).

2. **Identificación de Contenido Principal:**
   - El encabezado del contenido principal en el sitio de Docsify se identifica de manera más confiable mediante el selector `div.content h1`.

3. **Pruebas End-to-End en la Navegación:**
   - Las pruebas End-to-End con Playwright para la navegación de la barra lateral de Docsify son frágiles y poco fiables debido a complejas condiciones de carrera con la carga asíncrona de contenido. Prefiere pruebas más simples y estáticas cuando sea posible.
   - Para evitar violaciones del "modo estricto" de Playwright por selectores ambiguos, las búsquedas deben limitarse a un elemento padre (ej. `.locator('.sidebar-nav')`), desambiguarse con `.first`, usar coincidencia exacta de texto (`exact=True`), o usar selectores precisos basados en el contexto. Recuerda que `.first` es una propiedad, no un método (`.first.click()`).

### Comandos y Scripts

- **Instalar Dependencias:** `npm install -g docsify-cli` (necesario globalmente para el servidor de desarrollo).
- **Desarrollo:** `npm run docsify:dev` (o `docsify serve docs` para ejecución sin interfaz/headless, evitando el flag `--open`). Nota: el servidor local puede tener un retraso de inicio; los scripts automatizados como Playwright deben incluir un breve período de espera (ej. 5 segundos) antes de intentar acceder al servidor.
- **Pruebas Unitarias:** `npm test` ejecuta las pruebas nativas de Node.js (comprueba si hay enlaces de marcador de posición rotos `/#` en los archivos de la barra lateral).

## Flujo de Trabajo y Convenciones (Git)

Para mantener el historial limpio e interpretarlo correctamente, debes seguir estas convenciones basadas en los estándares del repositorio:

1. **Convención de Commits:**
   - Escribe los mensajes de commit siguiendo el formato de **[Conventional Commits](https://www.conventionalcommits.org/)**.
   - Usa prefijos claros como: `feat:` (nueva funcionalidad/página), `fix:` (corrección de errores/enlaces rotos), `docs:` (documentación pura o actualizaciones de contenido), `chore:` (tareas de mantenimiento, dependencias), `refactor:` (refactorización de estructura), `style:` (formato), y `test:` (añadir o modificar pruebas).
   - Ejemplo: `docs: add new CI/CD workflow page to english and spanish docs`

2. **Estrategia de Branching (Ramas):**
   - La rama `main` es la fuente de verdad (producción). No hagas commits directos a `main` para características nuevas.
   - Crea ramas nuevas a partir de `main` para aislar adiciones de contenido, correcciones y experimentos.
   - Prefiere el uso de Pull Requests (PRs) para validar cambios antes de integrar a la rama principal.

3. **Nombrado de Ramas:**
   - Nombra las ramas utilizando un prefijo descriptivo seguido de guiones (`-`) para separar las palabras, haciendo referencia al tipo de trabajo (similar a los Conventional Commits).
   - Formatos permitidos:
     - `feat/nombre-de-la-nueva-seccion`
     - `fix/descripcion-del-error-o-enlace-roto`
     - `docs/actualizacion-de-contenido`
     - `chore/tarea-de-mantenimiento`
   - Ejemplo: `docs/add-github-actions-guide`

## Buenas Prácticas Exigidas y Verificación Visual

- **Verificación Visual Obligatoria:**
  Antes de enviar cualquier cambio con `submit`, es **OBLIGATORIO** que realices una verificación visual de tus cambios. Este es un proyecto visual, por lo que las "pruebas" consisten en gran medida en verificar que el sitio se vea bien y los enlaces funcionen.

  1.  Inicia el servidor local: `docsify serve docs > docsify.log 2>&1 &`
  2.  Crea un script de Playwright para navegar a las páginas que modificaste (tanto en inglés como en español).
  3.  Toma capturas de pantalla de las páginas actualizadas.
  4.  Usa la herramienta `read_image_file` para revisar las capturas y asegurarte de que los cambios se ven como esperabas.
  5.  Usa `frontend_verification_complete()` para marcar la verificación como completada.
  6.  Elimina los artefactos de depuración temporales, como los archivos de captura de pantalla (`failure_*.png` y los directorios `failure_*`), antes de hacer commit.
  7.  No confirmes archivos de registro (logs) en el repositorio (ej. `docsify.log`).
  8.  Evita cambios no relacionados en archivos de bloqueo como `package-lock.json` y reviértelos antes de enviar el trabajo.

- **Pruebas Unitarias Obligatorias:** Ejecuta las pruebas unitarias (`npm test`) rigurosamente antes de enviar tu código, asegurándote de que no se han introducido enlaces rotos y que el comportamiento general sea el adecuado cada vez que utilices o agregues scripts al repositorio.
- **Validación de Código (CodeQL y SonarCloud):** Es obligatorio revisar y corregir cualquier issue, advertencia o "code smell" reportado por herramientas de análisis estático como CodeQL y SonarCloud en el proyecto. Debes asegurarte de escribir código seguro y limpio siguiendo las mejores prácticas recomendadas por estas herramientas. Esto incluye ser proactivo en la revisión de configuraciones de GitHub Actions reportadas por CodeQL, como configurar el principio de mínimos privilegios en los flujos de trabajo (ej. estableciendo explícitamente `permissions: contents: read` en el token implicito de Github `GITHUB_TOKEN`).
- **Documentación Viva:** Cualquier característica nueva, script o cambio significativo en la arquitectura que agregues o modifiques, **debe** reflejarse con una actualización correspondiente en el archivo `README.md` (o equivalente, si aplica).
