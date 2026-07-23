#!/bin/bash
# =============================================================
# MedMCQ Platform - Complete Kubernetes Deployment Script
# This script sets up minikube, builds Docker image, and deploys
# the application on a Kubernetes cluster on AWS EC2
# =============================================================

set -e

echo "=============================================="
echo "  MedMCQ Kubernetes Deployment Script"
echo "=============================================="

# ------------------------------------------
# Step 1: Update system packages
# ------------------------------------------
echo ""
echo "[Step 1/9] Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# ------------------------------------------
# Step 2: Install Docker
# ------------------------------------------
echo ""
echo "[Step 2/9] Installing Docker..."
if ! command -v docker &> /dev/null; then
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
    echo "Docker installed successfully."
else
    echo "Docker is already installed."
fi

# ------------------------------------------
# Step 3: Install kubectl
# ------------------------------------------
echo ""
echo "[Step 3/9] Installing kubectl..."
if ! command -v kubectl &> /dev/null; then
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
    rm kubectl
    echo "kubectl installed successfully."
else
    echo "kubectl is already installed."
fi

# ------------------------------------------
# Step 4: Install minikube
# ------------------------------------------
echo ""
echo "[Step 4/9] Installing minikube..."
if ! command -v minikube &> /dev/null; then
    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    sudo install minikube-linux-amd64 /usr/local/bin/minikube
    rm minikube-linux-amd64
    echo "minikube installed successfully."
else
    echo "minikube is already installed."
fi

# ------------------------------------------
# Step 5: Start minikube cluster
# ------------------------------------------
echo ""
echo "[Step 5/9] Starting minikube cluster..."
minikube start --driver=docker --force

# Enable metrics-server addon for HPA
echo "Enabling metrics-server addon..."
minikube addons enable metrics-server

# Enable dashboard addon
echo "Enabling dashboard addon..."
minikube addons enable dashboard

echo "minikube cluster is running."

# ------------------------------------------
# Step 6: Build Docker image inside minikube
# ------------------------------------------
echo ""
echo "[Step 6/9] Building Docker image inside minikube..."
eval $(minikube docker-env)
docker build -t medmcq-web:latest .
echo "Docker image built successfully."

# ------------------------------------------
# Step 7: Apply Kubernetes manifests
# ------------------------------------------
echo ""
echo "[Step 7/9] Applying Kubernetes manifests..."

echo "  -> Applying MongoDB Persistent Volume Claim..."
kubectl apply -f k8s/mongo-pvc.yaml

echo "  -> Applying MongoDB Deployment..."
kubectl apply -f k8s/mongo-deployment.yaml

echo "  -> Applying MongoDB Service..."
kubectl apply -f k8s/mongo-service.yaml

echo "  -> Applying Web App Deployment..."
kubectl apply -f k8s/web-deployment.yaml

echo "  -> Applying Web App Service..."
kubectl apply -f k8s/web-service.yaml

echo "  -> Applying Horizontal Pod Autoscaler..."
kubectl apply -f k8s/web-hpa.yaml

echo "All manifests applied successfully."

# ------------------------------------------
# Step 8: Wait for pods to be ready
# ------------------------------------------
echo ""
echo "[Step 8/9] Waiting for pods to be ready..."
echo "  Waiting for MongoDB pod..."
kubectl wait --for=condition=Ready pod -l app=mongo --timeout=120s
echo "  Waiting for Web App pod..."
kubectl wait --for=condition=Ready pod -l app=medmcq-web --timeout=180s
echo "All pods are ready."

# ------------------------------------------
# Step 9: Display cluster status
# ------------------------------------------
echo ""
echo "[Step 9/9] Deployment Status"
echo "=============================================="
echo ""
echo "--- Pods ---"
kubectl get pods -o wide
echo ""
echo "--- Services ---"
kubectl get services
echo ""
echo "--- Deployments ---"
kubectl get deployments
echo ""
echo "--- HPA ---"
kubectl get hpa
echo ""
echo "--- PVC ---"
kubectl get pvc
echo ""
echo "=============================================="
echo "  DEPLOYMENT COMPLETE!"
echo "=============================================="
echo ""
echo "To expose the web application externally, run:"
echo "  minikube service web-service --url"
echo ""
echo "To expose the minikube dashboard, run:"
echo "  minikube dashboard --url"
echo ""
echo "Both commands will output tunneled URLs."
echo "Keep both terminal sessions open during evaluation."
echo "=============================================="
