# Despliegue en Kubernetes

Este documento describe cómo desplegar una aplicación en un clúster de Kubernetes utilizando un manifiesto de despliegue.

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

## Despliegue

Para desplegar la aplicación, utilice el siguiente comando:

```bash
kubectl apply -f minecraft.yaml
```

Este comando creará el despliegue y el servicio definidos en el manifiesto.
