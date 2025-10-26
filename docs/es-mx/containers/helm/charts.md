# Gráficos de Helm

Un "chart" (gráfico) de Helm es una colección de archivos que describen un conjunto relacionado de recursos de Kubernetes. Un solo gráfico puede utilizarse para desplegar algo sencillo, como un pod de memcached, o algo complejo, como una pila de aplicaciones web completa con servidores HTTP, bases de datos, cachés, etc.

## Estructura de Archivos de un Gráfico

Un gráfico se organiza como una colección de archivos dentro de un directorio. El nombre del directorio es el nombre del gráfico (sin información de versión). Por ejemplo, un gráfico que describe WordPress se almacenaría en un directorio `wordpress/`.

Dentro de este directorio, Helm esperará una estructura como la siguiente:

```
wordpress/
  Chart.yaml          # Un archivo YAML que contiene información sobre el gráfico
  LICENSE             # OPCIONAL: Un archivo de texto sin formato que contiene la licencia del gráfico
  README.md           # OPCIONAL: Un archivo README legible por humanos
  values.yaml         # Los valores de configuración por defecto para este gráfico
  charts/             # Un directorio que contiene los gráficos de los que depende este gráfico.
  templates/          # Un directorio de plantillas que, al combinarse con los valores,
                      # generarán archivos de manifiesto de Kubernetes válidos.
  templates/NOTES.txt # OPCIONAL: Un archivo de texto sin formato que contiene breves notas de uso
```

## Ejemplo de Gráfico

A continuación, se muestra un ejemplo de un archivo `Chart.yaml` sencillo:

```yaml
apiVersion: v2
name: my-chart
description: Un gráfico de Helm para Kubernetes

# Un gráfico puede ser de tipo 'application' (aplicación) o 'library' (biblioteca).
#
# Los gráficos de aplicación son una colección de plantillas que se pueden empaquetar en archivos versionados
# para ser desplegados.
#
# Los gráficos de biblioteca proporcionan utilidades o funciones útiles para el desarrollador del gráfico. Se incluyen como
# una dependencia de los gráficos de aplicación para inyectar esas utilidades y funciones en el
# proceso de renderizado. Los gráficos de biblioteca no definen ninguna plantilla y, por lo tanto, no se pueden desplegar.
type: application

# Esta es la versión del gráfico. Este número de versión debe incrementarse cada vez que realices cambios
# en el gráfico y sus plantillas, incluida la versión de la aplicación.
version: 0.1.0

# Este es el número de versión de la aplicación que se está desplegando. Este número de versión debe
# incrementarse cada vez que realices cambios en la aplicación.
appVersion: "1.16.0"
```
