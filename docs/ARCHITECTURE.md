# Architecture Documentation

## System Overview

Kube Credential is built using a microservices architecture pattern, where each service is independently deployable, scalable, and maintainable.

## Architecture Diagram
```
┌──────────────────────────────────────────────────────────────────────┐
│                           Load Balancer                               │
│                     (Kubernetes Service/Ingress)                      │
└────────────┬─────────────────────────────────────────────────────────┘
             │
             ├──────────────────────────────────────────────────────────┐
             │                                                          │
┌─────────▼─────────┐                                    ┌──────────▼─────────┐
│    Frontend       │                                    │  API Gateway       │
│  (React + Vite)   │                                    │   (Optional)       │
│                   │                                    │                    │
│  - Dashboard      │                                    └──────────┬─────────┘
│  - Issue Page     │                                               │
│  - Verify Page    │                                               │
└─────────┬─────────┘                                               │
          │                                                          │
          └────────────┬─────────────────────────────────────────────┘
                       │
          ┌────────────┴────────────────┐
          │                             │
┌─────────▼─────────┐         ┌────────▼──────────┐
│  Issuance Service │         │ Verification      │
│    (Node.js)      │         │   Service         │
│                   │         │  (Node.js)        │
│  Port: 3001       │◄────────┤                   │
│                   │  HTTP   │  Port: 3002       │
│  ┌──────────────┐ │         │                   │
│  │   SQLite     │ │         │  ┌──────────────┐ │
│  │   Database   │ │         │  │   SQLite     │ │
│  │              │ │         │  │   Database   │ │
│  │ - credentials│ │         │  │              │ │
│  │              │ │         │  │ - logs       │ │
│  └──────────────┘ │         │  └──────────────┘ │
│                   │         │                   │
│  Replicas: 3      │         │  Replicas: 3      │
└───────────────────┘         └───────────────────┘
```

## Components

### 1. Frontend Application

**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Zustand for state management
- Axios for HTTP requests

**Key Features:**
- Single Page Application (SPA)
- Client-side routing
- Responsive design (mobile-first)
- Theme switching (dark/light mode)
- Real-time form validation
- Toast notifications

**Pages:**
1. **Dashboard** - System overview and statistics
2. **Issue Credential** - Form for issuing new credentials
3. **Verify Credential** - Interface for credential verification

**State Management:**
```typescript
// Theme Store
interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Credential Store
interface CredentialState {
  credentials: IssuedCredential[];
  setCredentials: (credentials: IssuedCredential[]) => void;
  addCredential: (credential: IssuedCredential) => void;
}
```

### 2. Issuance Service

**Responsibility:** Issue and manage credentials

**Technology Stack:**
- Node.js 20.x
- Express.js
- TypeScript
- SQLite (better-sqlite3)
- Zod for validation

**Database Schema:**
```sql
CREATE TABLE credentials (
  id TEXT PRIMARY KEY,
  holder_name TEXT NOT NULL,
  holder_email TEXT NOT NULL,
  credential_type TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  expiry_date TEXT,
  metadata TEXT,
  issued_by TEXT NOT NULL,
  issued_at TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_holder_email ON credentials(holder_email);
CREATE INDEX idx_credential_type ON credentials(credential_type);
```

**Endpoints:**
- `GET /api/health` - Health check
- `POST /api/issue` - Issue new credential
- `GET /api/credentials/:id` - Get credential by ID
- `GET /api/credentials` - Get all credentials

**Business Logic:**
1. Validate input using Zod schema
2. Check for duplicate credential ID
3. Generate issuance metadata (worker ID, timestamp)
4. Store in database
5. Return issued credential with metadata

### 3. Verification Service

**Responsibility:** Verify credential authenticity

**Technology Stack:**
- Node.js 20.x
- Express.js
- TypeScript
- SQLite (better-sqlite3)
- Axios for service-to-service communication

**Database Schema:**
```sql
CREATE TABLE verification_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  credential_id TEXT NOT NULL,
  verified_by TEXT NOT NULL,
  verified_at TEXT NOT NULL,
  is_valid BOOLEAN NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_credential_id ON verification_logs(credential_id);
CREATE INDEX idx_verified_at ON verification_logs(verified_at);
```

**Endpoints:**
- `GET /api/health` - Health check
- `POST /api/verify` - Verify credential
- `GET /api/logs` - Get verification logs

**Business Logic:**
1. Receive credential ID
2. Call Issuance Service to check existence
3. Log verification attempt
4. Return verification result with metadata

## Design Patterns

### 1. Microservices Pattern

**Benefits:**
- Independent scaling
- Fault isolation
- Technology flexibility
- Easier maintenance

**Implementation:**
- Each service has its own database
- Services communicate via HTTP REST APIs
- No shared state between services

### 2. Repository Pattern

**Implementation in Services:**
```typescript
class CredentialRepository {
  private db: Database;
  
  create(credential: Credential): void;
  findById(id: string): Credential | null;
  findAll(): Credential[];
}
```

### 3. Service Layer Pattern

**Separation of concerns:**
```
Routes (HTTP handling)
  ↓
Service Layer (Business logic)
  ↓
Data Access Layer (Database operations)
```

### 4. API Gateway Pattern (Optional)

For production, implement an API Gateway for:
- Request routing
- Rate limiting
- Authentication/Authorization
- Request/response transformation

## Data Flow

### Credential Issuance Flow
```
1. User fills form in Frontend
   ↓
2. Frontend validates input
   ↓
3. POST /api/issue to Issuance Service
   ↓
4. Issuance Service validates request
   ↓
5. Check for duplicate ID in database
   ↓
6. Insert credential with metadata
   ↓
7. Return success with worker ID
   ↓
8. Frontend updates UI with toast notification
```

### Credential Verification Flow
```
1. User enters credential ID in Frontend
   ↓
2. POST /api/verify to Verification Service
   ↓
3. Verification Service calls Issuance Service
   ↓
4. GET /api/credentials/:id
   ↓
5. Issuance Service returns credential data
   ↓
6. Verification Service logs attempt
   ↓
7. Return verification result with worker ID
   ↓
8. Frontend displays detailed result
```

## Scalability

### Horizontal Scaling

**Stateless Services:**
- All services are stateless
- Any pod can handle any request
- No session affinity required

**Database Scaling:**
- Current: SQLite (file-based)
- Future: PostgreSQL with connection pooling
- Read replicas for verification service

**Kubernetes Horizontal Pod Autoscaler:**
```yaml
minReplicas: 2
maxReplicas: 10
targetCPUUtilizationPercentage: 70
```

### Load Balancing

**Kubernetes Service:**
- Round-robin load balancing by default
- Health checks ensure traffic to healthy pods only

## Security Considerations

### Current Implementation
- **Input Validation:** Zod schemas on all inputs
- **CORS:** Configured for cross-origin requests
- **Helmet:** Security headers
- **SQL Injection:** Parameterized queries

### Future Enhancements
- **Authentication:** JWT tokens
- **Authorization:** Role-based access control (RBAC)
- **Rate Limiting:** Prevent abuse
- **Encryption:** Encrypt sensitive data at rest
- **HTTPS:** TLS/SSL certificates
- **Audit Logging:** Comprehensive audit trail

## Observability

### Logging

**Current:**
- Console logging
- Request/response logging
- Error logging

**Future:**
- Structured logging (JSON)
- Centralized logging (ELK stack)
- Log levels (debug, info, warn, error)

### Monitoring

**Current:**
- Kubernetes health checks
- Resource metrics via `kubectl top`

**Future:**
- Prometheus for metrics collection
- Grafana for visualization
- Custom business metrics
- Alerting based on thresholds

### Tracing

**Future Implementation:**
- Distributed tracing with Jaeger/Zipkin
- Correlation IDs across services
- Performance profiling

## High Availability

### Database

**Current Limitation:**
- SQLite is file-based, single-writer
- No built-in replication

**Production Solution:**
- Migrate to PostgreSQL or MySQL
- Master-slave replication
- Automatic failover
- Regular backups

### Service Redundancy

**Kubernetes ensures:**
- Multiple replicas per service
- Automatic pod restart on failure
- Rolling updates with zero downtime
- Self-healing capabilities

## Deployment Strategy

### Blue-Green Deployment
```yaml
# Deploy new version alongside old
kubectl apply -f deployment-v2.yaml

# Switch traffic to new version
kubectl patch service app -p '{"spec":{"selector":{"version":"v2"}}}'

# Rollback if needed
kubectl patch service app -p '{"spec":{"selector":{"version":"v1"}}}'
```

### Canary Deployment
```yaml
# Deploy new version with 10% traffic
kubectl apply -f deployment-canary.yaml

# Gradually increase traffic
# Monitor metrics and errors
# Full rollout or rollback based on results
```

## Technology Choices

### Why Node.js?
- JavaScript/TypeScript ecosystem
- Excellent async I/O performance
- Rich package ecosystem (npm)
- Easy containerization
- Good for microservices

### Why SQLite?
- Zero configuration
- File-based (easy backups)
- Perfect for development/testing
- Sufficient for assignment scope
- Easy migration path to PostgreSQL

### Why React?
- Component-based architecture
- Large ecosystem
- Excellent TypeScript support
- Virtual DOM for performance
- Industry standard

### Why Kubernetes?
- Container orchestration
- Automatic scaling
- Self-healing
- Rolling updates
- Industry standard for microservices

## Performance Considerations

### Backend Optimization
- **Database Indexes:** Created on frequently queried fields
- **Connection Pooling:** For production database
- **Caching:** Redis for frequently accessed data (future)
- **Compression:** gzip compression for responses

### Frontend Optimization
- **Code Splitting:** Lazy loading routes
- **Bundle Optimization:** Vite's tree-shaking
- **Image Optimization:** WebP format, lazy loading
- **CDN:** Static assets served from CDN (production)

## Disaster Recovery

### Backup Strategy

**Database:**
```bash
# Automated daily backups
0 2 * * * /scripts/backup-db.sh

# Backup retention: 30 days
# Off-site backup to S3
```

**Configuration:**
- Version controlled in Git
- Infrastructure as Code (IaC)

### Recovery Procedures

**Database Restore:**
```bash
kubectl exec -it pod-name -- sqlite3 /data/db.db < backup.sql
```

**Service Recovery:**
```bash
kubectl rollout undo deployment/service-name
```

## Future Enhancements

1. **Event-Driven Architecture:** Use message queues (RabbitMQ, Kafka)
2. **GraphQL API:** Alternative to REST
3. **Blockchain Integration:** Immutable credential records
4. **Mobile Apps:** React Native applications
5. **Advanced Analytics:** Dashboard with insights
6. **Multi-tenancy:** Support multiple organizations
7. **API Versioning:** Proper version management
8. **WebSocket Support:** Real-time updates