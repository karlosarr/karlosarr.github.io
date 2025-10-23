# Deployment in Kubernetes

This document describes how to deploy an application in a Kubernetes cluster using a deployment manifest.

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

## Deployment

To deploy the application, use the following command:

```bash
kubectl apply -f minecraft.yaml
```

This command will create the deployment and the service defined in the manifest.
