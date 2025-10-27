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

## Despliegues con Volúmenes

También puedes usar volúmenes para almacenar datos persistentes. Este ejemplo muestra cómo montar un `PersistentVolumeClaim` en un despliegue.

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
```

## Horizontal Pod Autoscaler (HPA)

El Horizontal Pod Autoscaler escala automáticamente el número de pods en un controlador de replicación, despliegue, conjunto de réplicas o conjunto con estado en función de la utilización de CPU observada.

A continuación, se muestra un ejemplo de un HPA que apunta al `nginx-deployment` y escala el número de réplicas entre 3 y 10 en función de una utilización de CPU objetivo del 80%.

```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-deployment
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80
```
