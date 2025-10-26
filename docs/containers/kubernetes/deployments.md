# Kubernetes Deployments

A Deployment provides declarative updates for Pods and ReplicaSets.

You describe a desired state in a Deployment, and the Deployment Controller changes the actual state to the desired state at a controlled rate. You can define Deployments to create new ReplicaSets, or to remove existing Deployments and adopt all their resources with new Deployments.

## Example Deployment

Here is an example of a Deployment. It creates a ReplicaSet to bring up three `nginx` Pods.

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

To create this deployment, you would save the manifest to a file named `nginx-deployment.yaml` and run the following command:

```bash
kubectl apply -f nginx-deployment.yaml
```

This will create a deployment named `nginx-deployment` with three replicas of the `nginx` pod.
