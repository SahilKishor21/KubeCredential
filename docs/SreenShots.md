# Kube Credential - Application Screenshots

**Project:** Kube Credential - Microservices Credential Management System  
**Date:** October 9, 2025  
**Deployment:** AWS (Docker + Kubernetes)

---

## Application Screenshots

### 1. Dashboard - Light Mode
![Dashboard Light Mode](https://res.cloudinary.com/djqkofsv0/image/upload/v1760181750/Screenshot_2025-10-11_163714_auobzz.png)

Main dashboard interface featuring system statistics, navigation menu, and quick access to credential management features. Built with React TypeScript and Tailwind CSS.

---

### 2. Dashboard - Dark Mode
![Dashboard Dark Mode](https://res.cloudinary.com/djqkofsv0/image/upload/v1760181750/Screenshot_2025-10-11_163737_zziwak.png)

Same dashboard with dark theme support, demonstrating theme switching functionality for improved user experience and accessibility.

---

### 3. Issue Credentials - Empty Form
![Issue Credentials Empty Form](https://res.cloudinary.com/djqkofsv0/image/upload/v1760181750/Screenshot_2025-10-11_163911_xy9c7m.png)

Credential issuance page with an empty form. Includes fields for credential ID, holder name, holder email, credential type, issue date, expiry date, and metadata.

---

### 4. Issue Credentials - Filled Form with License Preview
![Issue Credentials Full Form](https://res.cloudinary.com/djqkofsv0/image/upload/v1760181750/Screenshot_2025-10-11_163957_uql33b.png)

Complete credential issuance form with all fields filled and a real-time preview of the professional license card. Shows the credential design before submission.

---

### 5. Verify Credentials - Input Interface
![Verification Interface](https://res.cloudinary.com/djqkofsv0/image/upload/v1760181750/Screenshot_2025-10-11_164106_o2tgoa.png)

Credential verification page where users can enter a credential ID to verify its authenticity. Simple and clean interface for quick verification.

---

### 6. Dashboard - Mobile View
![Dashboard Mobile View](https://res.cloudinary.com/djqkofsv0/image/upload/v1760181751/Screenshot_2025-10-11_164304_zbz6h7.png)

Responsive mobile version of the dashboard. Demonstrates mobile-first design with optimized layout, touch-friendly interface, and proper content stacking.

---

### 7. Issue Credentials - Mobile View
![Issue Credentials Mobile View](https://res.cloudinary.com/djqkofsv0/image/upload/v1760181751/Screenshot_2025-10-11_164343_f0k1zm.png)

Mobile-optimized credential issuance form. Features full-width inputs, large touch targets, and mobile-friendly form controls for easy data entry on smaller screens.

---

### 8. Recently Issued License
![Recently Issued License](https://res.cloudinary.com/djqkofsv0/image/upload/v1760181751/Screenshot_2025-10-11_164035_nsvpit.png)

Successfully issued credential display showing complete credential details, worker/pod ID that handled the request (`issuance-service-xxxxx`), timestamp, and success confirmation.

---

### 9. Successfully Verified License Details
![Successfully Verified License](https://res.cloudinary.com/djqkofsv0/image/upload/v1760181752/Screenshot_2025-10-11_164132_rf4jvn.png)

Verification result displaying full credential information after successful validation. Shows verification status, worker/pod ID (`verification-service-xxxxx`), verification timestamp, and complete credential data retrieved from the issuance service.

---

### 10. Kubernetes Services
![Kubernetes Services](https://res.cloudinary.com/djqkofsv0/image/upload/v1760181751/Screenshot_2025-10-11_164636_tkftdp.png)

Output of `kubectl get services -n kubecredentials` showing all deployed services in the Kubernetes cluster:
- **frontend-service** (LoadBalancer) - External access to React frontend
- **issuance-service** (ClusterIP) - Internal service on port 3001
- **verification-service** (ClusterIP) - Internal service on port 3002

---

### 11. Kubernetes Horizontal Pod Autoscaler
![Kubernetes HPA](https://res.cloudinary.com/djqkofsv0/image/upload/v1760181964/Screenshot_2025-10-11_165530_wnznvn.png)

Output of `kubectl get hpa` showing Horizontal Pod Autoscaler configuration for all services:
- **frontend-hpa:** 2-10 replicas, targeting 70% CPU utilization
- **issuance-service-hpa:** 2-10 replicas, targeting 70% CPU utilization  
- **verification-hpa:** 2-10 replicas, targeting 70% CPU utilization

Current status shows healthy auto-scaling with services running at optimal capacity.

---

## System Architecture

### Architecture Diagram

```
                            ┌─────────────────────┐
                            │   AWS Cloud (EKS)   │
                            └──────────┬──────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │    Kubernetes Load Balancer         │
                    │    (Service/Ingress)                │
                    └──────────────────┬──────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │                                     │
         ┌──────────▼──────────┐            ┌───────────▼───────────┐
         │   Frontend Service  │            │   Backend Services    │
         │   (LoadBalancer)    │            │                       │
         │   Port: 80/30000    │            └───────────┬───────────┘
         │                     │                        │
         │  ┌──────────────┐   │          ┌─────────────┴─────────────┐
         │  │  React App   │   │          │                           │
         │  │  (3 Pods)    │   │   ┌──────▼──────┐         ┌─────────▼─────────┐
         │  └──────────────┘   │   │  Issuance   │         │  Verification     │
         └─────────────────────┘   │  Service    │◄────────┤  Service          │
                                   │  (ClusterIP)│  HTTP   │  (ClusterIP)      │
                                   │  Port: 3001 │         │  Port: 3002       │
                                   │             │         │                   │
                                   │  ┌────────┐ │         │  ┌────────┐       │
                                   │  │SQLite  │ │         │  │SQLite  │       │
                                   │  │DB      │ │         │  │DB      │       │
                                   │  │        │ │         │  │        │       │
                                   │  │Creds   │ │         │  │Logs    │       │
                                   │  └────────┘ │         │  └────────┘       │
                                   │             │         │                   │
                                   │  3 Pods     │         │  2-3 Pods         │
                                   │  HPA: 2-10  │         │  HPA: 2-10        │
                                   └─────────────┘         └───────────────────┘
```

### Components

#### 1. Frontend Service (React Application)
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Deployment:** 3 replicas with HPA (2-10 pods)
- **Service Type:** LoadBalancer (External access)
- **Port:** 80 (mapped to 30000)
- **Container:** Docker image hosted on AWS ECR

#### 2. Issuance Service (Backend Microservice)
- **Runtime:** Node.js 20 with TypeScript
- **Framework:** Express.js
- **Database:** SQLite (credentials storage)
- **Deployment:** 3 replicas with HPA (2-10 pods)
- **Service Type:** ClusterIP (Internal only)
- **Port:** 3001
- **Container:** Docker image hosted on AWS ECR
- **Endpoints:**
  - `POST /api/issue` - Issue new credentials
  - `GET /api/credentials` - Get all credentials
  - `GET /api/credentials/:id` - Get credential by ID
  - `GET /api/health` - Health check

#### 3. Verification Service (Backend Microservice)
- **Runtime:** Node.js 20 with TypeScript
- **Framework:** Express.js
- **Database:** SQLite (verification logs)
- **Deployment:** 2-3 replicas with HPA (2-10 pods)
- **Service Type:** ClusterIP (Internal only)
- **Port:** 3002
- **Container:** Docker image hosted on AWS ECR
- **Endpoints:**
  - `POST /api/verify` - Verify credentials
  - `GET /api/logs` - Get verification logs
  - `GET /api/health` - Health check

---

## Deployment Details

### AWS Infrastructure

**Cloud Provider:** Amazon Web Services (AWS)

**Services Used:**
- **EKS (Elastic Kubernetes Service)** - Managed Kubernetes cluster
- **ECR (Elastic Container Registry)** - Docker image storage
- **ELB (Elastic Load Balancer)** - Load balancing for frontend service
- **VPC** - Network isolation and security
- **CloudWatch** - Monitoring and logging

### Containerization

**Docker Images:**
- Each service is containerized using multi-stage Docker builds
- Images are pushed to AWS ECR (Elastic Container Registry)
- Image tags follow semantic versioning (e.g., `v1.0.0`)

**Docker Image Structure:**
```
AWS ECR Repository:
├── frontend:v1.0.0           (React application)
├── issuance-service:v1.0.0   (Node.js API)
└── verification-service:v1.0.0 (Node.js API)
```

### Kubernetes Deployment

**Namespace:** `kubecredentials`

**Cluster Configuration:**
- Managed Kubernetes cluster on AWS EKS
- Multi-node cluster for high availability
- Auto-scaling enabled at both pod and node level

**Deployment Strategy:**
- Rolling updates for zero-downtime deployments
- Health checks (liveness & readiness probes)
- Resource limits and requests defined
- Horizontal Pod Autoscaler (HPA) for automatic scaling

**Auto-Scaling Configuration:**
```yaml
HPA Settings:
- Min Replicas: 2 (High availability)
- Max Replicas: 10 (Handle traffic spikes)
- Target CPU Utilization: 70%
- Scale up/down based on actual load
```

**Service Discovery:**
- Kubernetes DNS for inter-service communication
- Verification service discovers Issuance service via K8s DNS
- Services communicate using internal ClusterIP addresses

**Load Balancing:**
- AWS Elastic Load Balancer for external traffic (Frontend)
- Kubernetes Service load balancing for internal traffic
- Round-robin distribution across pod replicas

---

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client

### Backend
- **Node.js 20** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **SQLite** - Database
- **Zod** - Schema validation
- **Helmet** - Security headers
- **CORS** - Cross-origin requests

### DevOps
- **Docker** - Containerization
- **Kubernetes** - Orchestration
- **AWS EKS** - Managed K8s cluster
- **AWS ECR** - Container registry
- **kubectl** - K8s CLI tool
- **HPA** - Horizontal Pod Autoscaler

---

## Features Demonstrated

### Application Features
✅ Credential issuance with real-time preview  
✅ Credential verification with detailed results  
✅ Worker/Pod ID tracking for each request  
✅ Dark and light theme support  
✅ Fully responsive mobile design  
✅ Success and error notifications  
✅ Form validation and error handling  

### Infrastructure Features
✅ Microservices architecture  
✅ Docker containerization  
✅ Kubernetes deployment on AWS EKS  
✅ Horizontal Pod Autoscaling (HPA)  
✅ Service discovery and load balancing  
✅ High availability with multiple replicas  
✅ Zero-downtime deployments  
✅ Health checks and monitoring  

---

## Deployment URLs

**AWS Hosted Application:**
- Frontend: `http://kube-credential-sahilk21-frontend.s3-website-us-east-1.amazonaws.com/` 
- Kubernetes Dashboard: Available via `kubectl proxy`
- API Documentation: Available at frontend `/docs`


---

## Conclusion

This application demonstrates a complete microservices architecture deployed on AWS using Docker containers and Kubernetes orchestration. The system is production-ready with auto-scaling, load balancing, and high availability features.