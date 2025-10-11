# Deployment Guide

## Local Development

### Using Docker Compose
```powershell
docker-compose up -d
```

### Manual Development
```powershell
# Terminal 1
cd backend\issuance-service
npm run dev

# Terminal 2
cd backend\verification-service
npm run dev

# Terminal 3
cd frontend
npm run dev
```

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster
- kubectl configured
- Docker images built and pushed

### Deploy
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/issuance-deployment.yaml
kubectl apply -f k8s/verification-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/hpa.yaml
```

### Verify
```bash
kubectl get pods -n kube-credential
kubectl get services -n kube-credential
```

## AWS Deployment

See AWS documentation for deploying to ECS or EKS.
