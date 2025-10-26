# Despliegues de Kubernetes

Un "Deployment" (despliegue) proporciona actualizaciones declarativas para Pods y ReplicaSets.

En un despliegue, describes un estado deseado, y el controlador del despliegue cambia el estado actual al estado deseado a un ritmo controlado. Puedes definir despliegues para crear nuevos ReplicaSets o para eliminar despliegues existentes y adoptar todos sus recursos con nuevos despliegues.

## Ejemplo de Despliegue

A continuación, se muestra un ejemplo de un despliegue. Crea un ReplicaSet para levantar tres Pods de `nginx`.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

Para crear este despliegue, guardarías el manifiesto en un archivo llamado `nginx-deployment.yaml` y ejecutarías el siguiente comando:

```bash
kubectl apply -f nginx-deployment.yaml
```

Esto creará un despliegue llamado `nginx-deployment` con tres réplicas del pod `nginx`.
