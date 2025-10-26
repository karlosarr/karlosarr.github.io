# Deployment in Kubernetes

This document describes how to deploy an application in a Kubernetes cluster using a deployment manifest and how to automate the process with GitHub Actions.

## Prerequisites

- A running Kubernetes cluster.
- `kubectl` installed and configured to communicate with the cluster.
- A Docker image of the application to be deployed, available in a container registry.

## Deployment Manifest

The `minecraft.yaml` file is a Kubernetes manifest that defines a deployment and a service for a Minecraft application.

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

### Manifest Components

- **Deployment:** Defines the desired state for the application, including the number of replicas, the container image, and the ports.
- **Service:** Exposes the application through a load balancer, allowing access to the application from outside the cluster.

## Manual Deployment

To deploy the application, use the following command:

```bash
kubectl apply -f minecraft.yaml
```

This command will create the deployment and the service defined in the manifest.

## Automated Deployment with GitHub Actions

The following GitHub Actions workflow automates the process of building and deploying the application.

### GitHub Actions Workflow

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

### Automated Workflow Steps

- **Image Build and Push:** The workflow builds a Docker image and pushes it to GitHub Container Registry.
- **Manifest Update:** Updates the `minecraft.yaml` file with the new image tag.
- **Commit and Push:** Commits and pushes the changes to the repository, allowing tools like ArgoCD or FluxCD to deploy the new version.
