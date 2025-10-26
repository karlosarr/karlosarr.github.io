# Despliegue en Kubernetes

Este documento describe cómo desplegar una aplicación en un clúster de Kubernetes utilizando un manifiesto de despliegue y cómo automatizar el proceso con GitHub Actions.

## Prerrequisitos

- Un clúster de Kubernetes en funcionamiento.
- `kubectl` instalado y configurado para comunicarse con el clúster.
- Una imagen de Docker de la aplicación a desplegar, disponible en un registro de contenedores.

## Manifiesto de Despliegue

El archivo `minecraft.yaml` es un manifiesto de Kubernetes que define un despliegue y un servicio para una aplicación de Minecraft.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minecraft
  labels:
    app: minecraft
spec:
  replicas: 1
  selector:
    matchLabels:
      app: minecraft
  template:
    metadata:
      labels:
        app: minecraft
    spec:
      containers:
      - name: minecraft
        image: openhack/minecraft-server:2.0
        ports:
        - containerPort: 25565
          name: tcp-port
        - containerPort: 19132
          name: udp-port
        volumeMounts:
        - name: disk
          mountPath: /data
      volumes:
      - name: disk
        persistentVolumeClaim:
          claimName: minecraft-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: minecraft-service
spec:
  selector:
    app: minecraft
  ports:
  - name: tcp-port
    protocol: TCP
    port: 25565
    targetPort: 25565
  - name: udp-port
    protocol: UDP
    port: 19132
    targetPort: 19132
  type: LoadBalancer
```

### Componentes del Manifiesto

- **Deployment:** Define el estado deseado para la aplicación, incluyendo el número de réplicas, la imagen del contenedor y los puertos.
- **Service:** Expone la aplicación a través de un balanceador de carga, permitiendo el acceso a la aplicación desde fuera del clúster.

## Despliegue Manual

Para desplegar la aplicación, utilice el siguiente comando:

```bash
kubectl apply -f minecraft.yaml
```

Este comando creará el despliegue y el servicio definidos en el manifiesto.

## Despliegue Automatizado con GitHub Actions

El siguiente flujo de trabajo de GitHub Actions automatiza el proceso de construcción y despliegue de la aplicación.

### Flujo de Trabajo de GitHub Actions

```yaml
name: Build, Push, and Update Manifest

on:
  push:
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}/minecraft-server:latest

      - name: Update Kubernetes manifest
        run: |
          sed -i "s|CONTAINER_REGISTRY_NAME.azurecr.io/minecraft-server:latest|ghcr.io/${{ github.repository }}/minecraft-server:latest|g" minecraft.yaml

      - name: Commit and push changes
        run: |
          git config --global user.name 'github-actions[bot]'
          git config --global user.email 'github-actions[bot]@users.noreply.github.com'
          git add minecraft.yaml
          if git diff --staged --quiet; then
            echo "No changes to commit."
          else
            git commit -m "Update minecraft.yaml with new image tag"
            git push
          fi
```

### Pasos del Flujo de Trabajo Automatizado

- **Construcción y Envío de la Imagen:** El flujo de trabajo construye una imagen de Docker y la sube a GitHub Container Registry.
- **Actualización del Manifiesto:** Actualiza el archivo `minecraft.yaml` con la nueva etiqueta de la imagen.
- **Commit y Push:** Confirma y sube los cambios al repositorio, lo que permite que herramientas como ArgoCD o FluxCD puedan desplegar la nueva versión.
