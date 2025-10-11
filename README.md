# Kube Credential - Microservice-Based Credential Management System

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5)](https://kubernetes.io/)

A production-ready microservice-based system for issuing and verifying digital credentials, built with Node.js, TypeScript, React, and deployed on AWS.

---

## 🌐 Live Demo

**Deployed Application:**
- **Frontend:** [http://kube-credential-sahilk21-frontend.s3-website-us-east-1.amazonaws.com](http://kube-credential-sahilk21-frontend.s3-website-us-east-1.amazonaws.com)
- **Issuance API:** [http://204.236.253.106:3001/api](http://204.236.253.106:3001/api)
- **Verification API:** [http://204.236.253.106:3002/api](http://204.236.253.106:3002/api)

**Health Check Endpoints:**
- Issuance Service: [http://204.236.253.106:3001/api/health](http://204.236.253.106:3001/api/health)
- Verification Service: [http://204.236.253.106:3002/api/health](http://204.236.253.106:3002/api/health)

---

## 📸 Application Preview

### Dashboard Overview
![Dashboard Light Mode](https://res.cloudinary.com/djqkofsv0/image/upload/v1760181750/Screenshot_2025-10-11_163714_auobzz.png)

*Modern dashboard with system statistics, service health indicators, and quick access to credential management features.*

---

### Issue Credential Interface
![Issue Credentials Form](https://res.cloudinary.com/djqkofsv0/image/upload/v1760181750/Screenshot_2025-10-11_163911_xy9c7m.png)

*Clean, intuitive form for issuing new credentials with real-time validation and preview functionality.*

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [Design Decisions](#design-decisions)
- [Submission Details](#submission-details)
- [Author](#author)

---

## 🎯 Overview

Kube Credential is a comprehensive credential issuance and verification system designed with microservices architecture. The system consists of two independent backend services and a React-based frontend, all containerized and deployed on AWS free tier.

### Key Capabilities

- ✅ Issue digital credentials with unique identifiers
- ✅ Verify credential authenticity in real-time
- ✅ Track which worker (pod) handled each operation
- ✅ Prevent duplicate credential issuance
- ✅ Maintain independent persistence layers for each service
- ✅ Horizontally scalable microservices
- ✅ Modern, responsive UI with dark/light theme support
- ✅ RESTful API design with JSON communication
- ✅ Production-ready deployment on AWS

---

## ✨ Features

### Backend Features

- **Two Independent Microservices:**
  - **Issuance Service** (Port 3001): Handles credential creation and management
  - **Verification Service** (Port 3002): Validates credential authenticity

- **Worker ID Tracking:**
  - Each operation returns the worker/pod that handled it
  - Format: "credential issued by worker-n"
  - Timestamp included with every operation

- **Data Persistence:**
  - Independent SQLite databases for each service
  - Automatic database creation
  - Data persistence across container restarts

- **Duplicate Prevention:**
  - Prevents issuing credentials with duplicate IDs
  - Returns 409 Conflict error for duplicates

- **Type-Safe APIs:**
  - TypeScript for end-to-end type safety
  - Zod for runtime validation
  - Comprehensive error handling

### Frontend Features

- **Three Main Pages:**
  - **Dashboard:** System overview and health status
  - **Issue Credential:** Form to create new credentials
  - **Verify Credential:** Interface to validate credentials

- **Modern UI/UX:**
  - Built with React 18 and TypeScript
  - Tailwind CSS for styling
  - shadcn/ui components
  - Fully responsive design (mobile, tablet, desktop)
  - Dark/Light theme toggle with persistence

- **State Management:**
  - Zustand for efficient state management
  - Persistent theme preferences
  - Real-time credential list updates

- **User Experience:**
  - Toast notifications for all actions
  - Loading states and spinners
  - Form validation with instant feedback
  - Live preview before credential issuance

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     AWS S3 (Static Host)                 │
│                  Frontend (React + Vite)                 │
│   http://kube-credential-sahilk21-frontend...            │
└────────────┬────────────────────────────────────────────┘
             │
             ├──────────────────┬────────────────────
             │                  │
    ┌────────▼─────────┐  ┌────▼──────────────┐
    │  Issuance API    │  │  Verification     │
    │  (Node.js)       │  │  API (Node.js)    │
    │  Port: 3001      │  │  Port: 3002       │
    │                  │  │                   │
    │  ┌────────────┐  │  │  ┌─────────────┐ │
    │  │  SQLite    │  │  │  │  SQLite     │ │
    │  │  Database  │  │  │  │  Database   │ │
    │  └────────────┘  │  │  └─────────────┘ │
    └──────────────────┘  └───────────────────┘
         Worker IDs            Worker IDs
       (Tracked & Logged)   (Tracked & Logged)
```

### Microservices Design

**1. Issuance Service (Port 3001)**
- Handles credential creation and issuance
- Maintains its own SQLite database
- Returns worker ID with each operation: "credential issued by worker-n"
- RESTful API endpoints for CRUD operations
- Independent scaling capability
- Prevents duplicate credentials

**2. Verification Service (Port 3002)**
- Validates credential authenticity
- Maintains verification logs in separate SQLite database
- Communicates with Issuance Service to check credentials
- Returns worker ID and timestamp for each verification
- Independent scaling capability
- Logs all verification attempts

**3. Frontend Application**
- React SPA with TypeScript
- Hosted on AWS S3 as static website
- Responsive design with Tailwind CSS
- Three main pages: Dashboard, Issue, Verify
- Dark/Light theme support
- Real-time communication with backend services

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js 20.x
- **Language:** TypeScript 5.x
- **Framework:** Express.js
- **Database:** SQLite (better-sqlite3)
- **Validation:** Zod
- **Security:** Helmet, CORS
- **Testing:** Jest, Supertest
- **Containerization:** Docker

### Frontend
- **Framework:** React 18.x
- **Language:** TypeScript 5.x
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Notifications:** Sonner
- **Icons:** Lucide React

### DevOps & Deployment
- **Container Orchestration:** Kubernetes (manifests included)
- **Container Runtime:** Docker
- **Deployment Platform:** AWS (EC2 + S3)
- **Auto-scaling:** Horizontal Pod Autoscaler (HPA)
- **Load Balancing:** Kubernetes Services
- **CI/CD:** Docker Compose for local development

---

## 📁 Project Structure

```
kube-credential/
├── backend/
│   ├── issuance-service/
│   │   ├── src/
│   │   │   ├── __tests__/
│   │   │   │   └── service.test.ts
│   │   │   ├── database.ts
│   │   │   ├── index.ts
│   │   │   ├── routes.ts
│   │   │   ├── service.ts
│   │   │   ├── types.ts
│   │   │   └── validators.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env
│   │
│   └── verification-service/
│       ├── src/
│       │   ├── __tests__/
│       │   │   └── service.test.ts
│       │   ├── database.ts
│       │   ├── index.ts
│       │   ├── routes.ts
│       │   ├── service.ts
│       │   └── types.ts
│       ├── Dockerfile
│       ├── package.json
│       ├── tsconfig.json
│       └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   └── [8 UI components]
│   │   │   ├── CredentialCard.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── VerificationResult.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── IssuancePage.tsx
│   │   │   └── VerificationPage.tsx
│   │   ├── store/
│   │   │   ├── useCredentialStore.ts
│   │   │   └── useThemeStore.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── k8s/
│   ├── namespace.yaml
│   ├── issuance-deployment.yaml
│   ├── verification-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── hpa.yaml
│   └── ingress.yaml
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT_GUIDE.md
│
├── tests/
│   └── api-tests.http
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** >= 20.x
- **npm:** >= 9.x
- **Docker:** >= 24.x (optional)
- **Docker Compose:** >= 2.x (optional)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kube-credential
   ```

2. **Set up environment variables**
   ```bash
   # Backend services already have .env files
   # Frontend .env is already configured
   ```

3. **Install dependencies and run services**

   **Option A: Manual (3 Terminals)**
   
   Terminal 1 - Issuance Service:
   ```bash
   cd backend/issuance-service
   npm install
   npm run dev
   ```
   
   Terminal 2 - Verification Service:
   ```bash
   cd backend/verification-service
   npm install
   npm run dev
   ```
   
   Terminal 3 - Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   **Option B: Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - **Frontend:** http://localhost:5173 (dev) or http://localhost (Docker)
   - **Issuance API:** http://localhost:3001/api
   - **Verification API:** http://localhost:3002/api

---

## 📚 API Documentation

### Issuance Service API

**Base URL:** `http://204.236.253.106:3001/api`

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Issuance service is healthy",
  "data": { "workerId": "worker-1" }
}
```

#### Issue Credential
```http
POST /issue
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": "CRED-1234567890-ABC",
  "holderName": "John Doe",
  "holderEmail": "john@example.com",
  "credentialType": "Academic Certificate",
  "issueDate": "2025-01-15T10:00:00.000Z",
  "expiryDate": "2026-01-15T10:00:00.000Z",
  "metadata": {
    "department": "Engineering",
    "level": "Bachelor"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Credential issued by worker-issuance-1",
  "data": {
    "id": "CRED-1234567890-ABC",
    "holderName": "John Doe",
    "holderEmail": "john@example.com",
    "credentialType": "Academic Certificate",
    "issueDate": "2025-01-15T10:00:00.000Z",
    "expiryDate": "2026-01-15T10:00:00.000Z",
    "metadata": { "department": "Engineering", "level": "Bachelor" },
    "issuedBy": "worker-issuance-1",
    "issuedAt": "2025-01-15T10:05:30.123Z"
  }
}
```

**Duplicate Error (409):**
```json
{
  "success": false,
  "message": "Credential already issued",
  "error": "Credential already issued"
}
```

#### Get All Credentials
```http
GET /credentials
```

#### Get Credential by ID
```http
GET /credentials/:id
```

### Verification Service API

**Base URL:** `http://204.236.253.106:3002/api`

#### Verify Credential
```http
POST /verify
Content-Type: application/json
```

**Request:**
```json
{
  "id": "CRED-1234567890-ABC"
}
```

**Valid Credential Response:**
```json
{
  "success": true,
  "message": "Credential verified by worker-verification-1",
  "data": {
    "valid": true,
    "credential": { /* full credential details */ },
    "verifiedBy": "worker-verification-1",
    "verifiedAt": "2025-01-15T11:20:45.789Z",
    "message": "Credential verified by worker-verification-1"
  }
}
```

**Invalid Credential Response:**
```json
{
  "success": false,
  "message": "Credential not found",
  "data": {
    "valid": false,
    "verifiedBy": "worker-verification-1",
    "verifiedAt": "2025-01-15T11:20:45.789Z",
    "message": "Credential not found"
  }
}
```

For complete API documentation, see [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

---

## 🚢 Deployment

### Current Deployment

**Platform:** AWS Free Tier

**Architecture:**
- **Frontend:** S3 Static Website Hosting
- **Backend Services:** EC2 Instance (t2.micro)
- **Databases:** SQLite (file-based, persisted on EC2)

**URLs:**
- Frontend: http://kube-credential-sahilk21-frontend.s3-website-us-east-1.amazonaws.com
- Issuance API: http://204.236.253.106:3001
- Verification API: http://204.236.253.106:3002

### Kubernetes Deployment (Optional)

Complete Kubernetes manifests are included in the `k8s/` directory for production deployment with:
- 3 replicas per backend service
- Horizontal Pod Autoscaler (HPA)
- Persistent Volume Claims
- Service networking
- Ingress routing

See [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 🧪 Testing

### Unit Tests

```bash
# Issuance Service
cd backend/issuance-service
npm test

# Verification Service
cd backend/verification-service
npm test
```

### API Testing

Use the provided `tests/api-tests.http` file with the REST Client extension in VS Code:

```http
### Test deployed issuance service
GET http://204.236.253.106:3001/api/health

### Issue a credential
POST http://204.236.253.106:3001/api/issue
Content-Type: application/json

{
  "id": "CRED-TEST-001",
  "holderName": "Test User",
  "holderEmail": "test@example.com",
  "credentialType": "Test Certificate",
  "issueDate": "2025-01-10T10:00:00.000Z"
}
```

### Integration Testing

1. Issue a credential via the frontend
2. Copy the credential ID
3. Verify the credential in the verification page
4. Check that worker IDs are displayed
5. Attempt to issue duplicate credential (should fail)

---

## 📸 Screenshots

### Application Screenshots

**Dashboard:**
- System overview showing service health
- Total credentials issued
- Worker IDs for each service
- Real-time status indicators

**Issue Credential Page:**
- Complete form with validation
- Real-time preview
- Success message with worker ID
- Recently issued credentials list

**Verify Credential Page:**
- Credential ID input
- Verification results with worker ID
- Timestamp of verification
- Full credential details if valid

**Mobile Responsive:**
- All pages work on mobile devices
- Touch-friendly interface
- Responsive navigation

**Dark Mode:**
- Complete theme support
- Persistent theme preference

For detailed screenshots and visual documentation, see [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md)

---

## 💡 Design Decisions

### 1. Microservices Architecture
**Decision:** Separate services for issuance and verification

**Rationale:**
- Independent scaling based on load
- Fault isolation
- Clear separation of concerns
- Follows single responsibility principle

### 2. SQLite as Database
**Decision:** Use SQLite for each service

**Rationale:**
- Lightweight and file-based
- Perfect for free-tier deployments
- Easy to backup and restore
- Can be migrated to PostgreSQL/MySQL later

### 3. Worker ID Implementation
**Decision:** Use environment variable or pod name as worker ID

**Rationale:**
- Automatic identification in Kubernetes
- Helpful for debugging and tracing
- Demonstrates scalability

### 4. AWS S3 for Frontend
**Decision:** Static hosting on S3

**Rationale:**
- Cost-effective (free tier)
- Fast global delivery
- No server management
- Perfect for React SPAs

### 5. Tailwind CSS + shadcn/ui
**Decision:** Utility-first CSS with pre-built components

**Rationale:**
- Rapid UI development
- Consistent design system
- Production-ready components
- Excellent dark mode support

---


**Deployed Application:**
- Frontend: http://kube-credential-sahilk21-frontend.s3-website-us-east-1.amazonaws.com
- Issuance API: http://204.236.253.106:3001
- Verification API: http://204.236.253.106:3002

**Key Features Implemented:**
- ✅ Two independent microservices
- ✅ Worker ID tracking (format: "credential issued by worker-n")
- ✅ Duplicate credential prevention
- ✅ JSON-based credential handling
- ✅ Independent persistence layers
- ✅ Kubernetes-ready with scaling
- ✅ Complete frontend with two pages
- ✅ Responsive UI/UX
- ✅ Cloud deployment on AWS

---

## 👤 Author

**Name:** [Sahil Kishor]  
**Email:** [sahilkishor8@gmail.com]  
**Phone:** +91-[7562007896]  
**GitHub:** [https://github.com/SahilKishor21]  
**LinkedIn:** [https://www.linkedin.com/in/45-sahil/]

---


## 🙏 Acknowledgments

- Zupple Labs for the assignment opportunity
- shadcn for the beautiful UI components
- The open-source community for the amazing tools and libraries

---
