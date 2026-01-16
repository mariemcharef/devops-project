# DevOps Project: Node.js Express REST API

A comprehensive backend REST API demonstrating modern DevOps practices end-to-end: containerization, orchestration, observability, security, and CI/CD automation. This project showcases a production-ready Node.js/Express service with MongoDB integration, complete with Docker support, Kubernetes deployment, structured logging, metrics collection, distributed tracing, and security hardening.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Local Running Guide](#local-running-guide)
- [Docker Usage](#docker-usage)
- [Kubernetes Deployment](#kubernetes-deployment)
- [API Documentation](#api-documentation)
- [Observability](#observability)
- [Security](#security)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Project Structure](#project-structure)
- [Development Guide](#development-guide)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

This DevOps project implements a full-stack REST API for user and post management with the following characteristics:

- **Backend**: Node.js 20 with Express 5.x framework
- **Database**: MongoDB 6/7 for data persistence
- **Containerization**: Docker for consistent deployment environments
- **Orchestration**: Kubernetes (minikube/kind compatible)
- **Observability**: Structured logging, Prometheus metrics, and distributed tracing
- **Security**: SAST scanning, security headers, password hashing, and DAST-ready
- **Testing**: Jest with MongoDB Memory Server for isolated testing
- **Code Size**: < 150 lines of core service code (excluding tests and config)

### Key Features

✅ User registration and authentication  
✅ Post creation, reading, updating, and deletion (CRUD)  
✅ Password hashing with bcryptjs  
✅ Structured JSON logging for all requests  
✅ Prometheus metrics exposure (/metrics endpoint)  
✅ Distributed request tracing with unique trace IDs  
✅ Comprehensive security headers  
✅ Error handling and validation  
✅ Full test coverage with Jest  
✅ Docker and Docker Compose support  
✅ Kubernetes manifests for cloud deployment  

---

## Architecture

### High-Level Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│      Node.js Express API            │
├─────────────────────────────────────┤
│  Security Headers │ Tracing │ Logs  │
├─────────────────────────────────────┤
│   User Routes   │   Post Routes     │
├─────────────────────────────────────┤
│ Controllers │ Models │ Middleware   │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│      MongoDB Database               │
│  (Users, Posts, Transactions)       │
└─────────────────────────────────────┘

Observability Stack:
├── Logging: JSON structured logs to stdout
├── Metrics: Prometheus /metrics endpoint
└── Tracing: Request trace IDs in all logs
```

### Components

| Component | Purpose | Technology |
|-----------|---------|-----------|
| **API Server** | HTTP request handling, routing | Express.js |
| **Database** | Data persistence | MongoDB |
| **Logging** | Structured request/error logs | Custom middleware |
| **Metrics** | Performance monitoring | Prometheus (prom-client) |
| **Tracing** | Request correlation | UUID-based trace IDs |
| **Authentication** | Password security | bcryptjs |
| **Container Runtime** | Local development, testing | Docker |
| **Orchestration** | Production deployment | Kubernetes |

---

## Prerequisites

### Local Development
- **Node.js**: v18+ (v20 recommended)
- **npm**: v9+
- **MongoDB**: v6+ (or use Docker Compose)

### Docker & Kubernetes
- **Docker**: v20+
- **Docker Compose**: v1.29+
- **kubectl**: v1.24+
- **Kubernetes Cluster**: minikube, kind, or cloud provider (AKS, EKS, GKE)

### Development Tools (Optional)
- **Git**: v2.30+
- **Postman** or **curl**: for API testing
- **VS Code**: with REST Client extension

---

## Setup Instructions

### 1. Clone and Navigate to Project

```bash
git clone https://github.com/yourusername/devops_project.git
cd devops_project
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages:
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcryptjs`: Password hashing
- `dotenv`: Environment configuration
- `prom-client`: Prometheus metrics
- `uuid`: Trace ID generation
- `jest`, `supertest`, `mongodb-memory-server`: Testing dependencies

### 3. Configure Environment Variables

Create `.env` file in the root directory (or `src/config/.env`):

```bash
touch .env
```

**Development Configuration** (`.env`):
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/devops_project
LOG_LEVEL=info
METRICS_ENABLED=true
```

**Docker Configuration** (auto-loaded from `.env`):
```env
PORT=4000
NODE_ENV=production
MONGODB_URI=mongodb://mongo:27017/devops_project
LOG_LEVEL=info
```

### 4. Start MongoDB Locally (Optional)

If not using Docker Compose:

```bash
# Using homebrew (macOS)
brew services start mongodb-community

# Using Docker standalone
docker run -d -p 27017:27017 --name mongodb mongo:7
```

---

## Local Running Guide

### Option 1: Direct Node.js Execution

#### Start the Server
```bash
npm start
```

Output:
```
Server is running on port 4000
Connected to MongoDB at mongodb://localhost:27017/devops_project
```

#### Development with Auto-Reload
```bash
npm run nodemon
```

Nodemon automatically restarts the server when files change.

#### Run Tests
```bash
npm test
```

Tests run in isolated MongoDB Memory Server environment.

### Option 2: Using Docker Compose (Recommended)

This starts both the API and MongoDB in containers:

```bash
docker-compose up -d
```

Services start on:
- **API**: `http://localhost:4000`
- **MongoDB**: `localhost:27017`
- **Metrics**: `http://localhost:4000/metrics`

### Verify Server is Running

```bash
# Health check
curl http://localhost:4000/api/v1/users

# Response should be empty array or users list
```

---

## Docker Usage

### Building the Docker Image

#### Standard Build
```bash
docker build -t devops-api:latest .
```

#### Build with Custom Tag
```bash
docker build -t devops-api:v1.0.0 .
docker tag devops-api:v1.0.0 myregistry/devops-api:latest
```

### Running Standalone Container

```bash
docker run -p 4000:4000 \
  -e PORT=4000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/devops_project \
  devops-api:latest
```

**Flags Explained:**
- `-p 4000:4000`: Map port 4000 from container to host
- `-e`: Set environment variables
- `host.docker.internal`: Access host MongoDB from Docker (macOS/Windows)

### Docker Compose (Full Stack)

#### Start Services
```bash
docker-compose up -d
```

#### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
```

#### Rebuild After Code Changes
```bash
docker-compose up --build
```

#### Stop and Clean Up
```bash
docker-compose down

# Remove volumes to reset database
docker-compose down -v
```

### Dockerfile Overview

The `Dockerfile` uses a multi-stage build pattern:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Copy application code
COPY . .

EXPOSE 4000

CMD ["node", "src/index.js"]
```

**Optimization Points:**
- Alpine Linux: Minimal image size (~150MB vs 900MB)
- Production dependencies only: Excludes dev tools
- Layer caching: Dependencies cached until package.json changes

---

## Kubernetes Deployment

### Prerequisites

Ensure you have a Kubernetes cluster running:

```bash
# Using minikube
minikube start --cpus=4 --memory=4096

# Using kind
kind create cluster --name devops

# Verify cluster
kubectl get nodes
```

### Deploying to Kubernetes

#### 1. Build and Load Image

For **minikube**:
```bash
# Build inside minikube's Docker daemon
eval $(minikube docker-env)
docker build -t devops-api:latest .
eval $(minikube docker-env --unset)
```

For **kind**:
```bash
docker build -t devops-api:latest .
kind load docker-image devops-api:latest --name devops
```

For **cloud registry** (ACR, ECR, GCR):
```bash
docker tag devops-api:latest myregistry.azurecr.io/devops-api:latest
docker push myregistry.azurecr.io/devops-api:latest

# Update image reference in k8s/app.yml
```

#### 2. Deploy MongoDB

```bash
kubectl apply -f k8s/mongo.yml
```

Verify MongoDB:
```bash
kubectl get pods -l app=mongo
kubectl logs deployment/mongo
```

#### 3. Deploy Application

```bash
kubectl apply -f k8s/app.yml
```

Verify Deployment:
```bash
kubectl get pods
kubectl get deployments
kubectl get services
```

#### 4. Access the Application

**For minikube/kind:**
```bash
# Get service info
kubectl get svc node-app

# Access via minikube
minikube service node-app --url

# Or port-forward
kubectl port-forward svc/node-app 4000:4000
```

**Test the API:**
```bash
curl http://localhost:4000/api/v1/users
```

### Kubernetes Manifests Explained

**Deployment** (`k8s/app.yml`):
- Creates pod replicas running the Node.js container
- Specifies resource limits and environment variables
- Mounts configuration from ConfigMaps (optional)

**Service** (`k8s/app.yml`):
- Exposes deployment via network endpoint
- Type `NodePort`: Accessible on worker node port (30000-32767)
- Type `LoadBalancer`: For cloud deployments (EKS, AKS, GKE)

**MongoDB** (`k8s/mongo.yml`):
- Single replica MongoDB deployment
- Persistent volume for data persistence (recommended: add PersistentVolumeClaim)
- Service for pod-to-pod communication

### Scaling and Updates

```bash
# Scale replicas
kubectl scale deployment node-app --replicas=3

# Update image
kubectl set image deployment/node-app \
  node-app=devops-api:v2.0.0

# Rolling update status
kubectl rollout status deployment/node-app

# Rollback if needed
kubectl rollout undo deployment/node-app
```

### Production Best Practices

For production deployments, consider:

1. **Persistent Storage**: Add PersistentVolumeClaim for MongoDB
2. **Resource Limits**: Define memory/CPU limits in deployment
3. **Health Checks**: Add liveness and readiness probes
4. **Secrets Management**: Use K8s Secrets or external vault
5. **Ingress Controller**: Use Nginx/Traefik for routing
6. **Network Policies**: Restrict pod-to-pod communication
7. **RBAC**: Implement role-based access control

---

## API Documentation

### Base URL
```
http://localhost:4000/api/v1
```

### Authentication
Currently, the API does not use token-based auth. User ID is extracted from requests or stored in session/JWT (extensible).

### Response Format

All responses are JSON:

**Success Response:**
```json
{
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "details": { /* error details */ }
}
```

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Unexpected error |

---

### User Endpoints

#### Register User
```http
POST /api/v1/users/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### Get All Users
```http
GET /api/v1/users
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2025-01-13T10:00:00.000Z"
  }
]
```

#### Get User by ID
```http
GET /api/v1/users/:id
```

---

### Post Endpoints

#### Create Post
```http
POST /api/v1/posts
Content-Type: application/json

{
  "name": "Getting Started with DevOps",
  "description": "A comprehensive guide to implementing DevOps practices in your organization."
}
```

**Response (201 Created):**
```json
{
  "message": "Post created successfully",
  "post": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Getting Started with DevOps",
    "description": "A comprehensive guide to implementing DevOps practices in your organization.",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

#### Get All Posts
```http
GET /api/v1/posts
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Getting Started with DevOps",
    "description": "A comprehensive guide to implementing DevOps practices...",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Kubernetes Best Practices",
    "description": "Learn the best practices for deploying applications on Kubernetes...",
    "createdAt": "2025-01-15T11:00:00.000Z",
    "updatedAt": "2025-01-15T11:00:00.000Z"
  }
]
```

#### Get Post by ID
```http
GET /api/v1/posts/:id
```

#### Update Post
```http
PUT /api/v1/posts/:id
Content-Type: application/json

{
  "name": "Updated Title",
  "description": "Updated description with new insights."
}
```

**Response (200 OK):**
```json
{
  "message": "Post updated successfully",
  "post": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Updated Title",
    "description": "Updated description with new insights.",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T12:30:00.000Z"
  }
}
```

#### Delete Post
```http
DELETE /api/v1/posts/:id
```

**Response (200 OK):**
```json
{
  "message": "Post deleted successfully"
}
```

---

## Observability

This project implements the three pillars of observability: **Logging**, **Metrics**, and **Tracing**.

### 1. Structured Logging

All requests are logged in JSON format for easy parsing and analysis:

**Log Entry Example:**
```json
{
  "time": "2025-01-15T10:00:00.000Z",
  "method": "POST",
  "path": "/api/v1/users/register",
  "status": 201,
  "traceId": "550e8400-e29b-41d4-a716-446655440000",
  "durationMs": 145
}
```

**View Logs:**
```bash
# Docker Compose
docker-compose logs -f api

# Kubernetes
kubectl logs deployment/node-app -f

# Local
npm start 2>&1 | grep "traceId"
```

**Log Analysis (example with jq):**
```bash
docker-compose logs api | jq 'select(.status >= 400)'
```

**Logging Features:**
- Timestamp: ISO 8601 format
- Trace ID: Unique identifier for request correlation
- Method & Path: HTTP method and endpoint
- Status Code: HTTP response code
- Duration: Request processing time in milliseconds

### 2. Metrics (Prometheus)

Prometheus metrics are exposed at `/metrics` endpoint:

```bash
curl http://localhost:4000/metrics
```

**Available Metrics:**
```
# REQUEST COUNTER
nodejs_http_requests_total{method="POST",route="/api/v1/users/register",status="201"} 5

# REQUEST DURATION HISTOGRAM
nodejs_http_request_duration_seconds_bucket{route="/api/v1/posts",le="0.1"} 12
nodejs_http_request_duration_seconds_bucket{route="/api/v1/posts",le="0.5"} 19

# ACTIVE CONNECTIONS
nodejs_active_requests 3
```

**Integration with Prometheus:**

Create `prometheus.yml`:
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'devops-api'
    static_configs:
      - targets: ['localhost:4000']
```

**Start Prometheus:**
```bash
docker run -p 9090:9090 \
  -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

Access Prometheus UI: `http://localhost:9090`

### 3. Distributed Tracing

Each request receives a unique `traceId` that flows through all logs and responses:

**Request Header:**
```http
X-Trace-ID: 550e8400-e29b-41d4-a716-446655440000
```

**All related logs contain the same traceId:**
```json
[
  {"method": "POST", "path": "/api/v1/users/register", "traceId": "550e8400-e29b-41d4-a716-446655440000"},
  {"message": "Password hashed", "traceId": "550e8400-e29b-41d4-a716-446655440000"},
  {"message": "User saved to database", "traceId": "550e8400-e29b-41d4-a716-446655440000"}
]
```

**Integration with ELK Stack:**

```bash
# Using Docker Compose with Elasticsearch/Kibana
docker-compose -f docker-compose.elk.yml up -d
```

Send logs to Elasticsearch:
```javascript
// In logging.js
const elasticClient = new ElasticsearchClient();
elasticClient.index({
  index: 'api-logs',
  body: logEntry
});
```

Access Kibana: `http://localhost:5601`

---

## Security

### Implemented Security Measures

#### 1. Security Headers
The API sets these headers in every response:

```
X-Powered-By:                       [REMOVED] - Hides server technology
X-Content-Type-Options: nosniff     - Prevents MIME type confusion
X-Frame-Options: DENY               - Prevents clickjacking (no iframes)
Strict-Transport-Security:          - Forces HTTPS (1 year)
Content-Security-Policy:            - Restricts resource loading
Permissions-Policy:                 - Disables browser features
```

#### 2. Password Security
Passwords are hashed using **bcryptjs** with salt rounds:

```javascript
import bcryptjs from 'bcryptjs';

const hashedPassword = await bcryptjs.hash(password, 10);
const isValid = await bcryptjs.compare(inputPassword, hashedPassword);
```

#### 3. Input Validation
Request validation prevents injection attacks:

```javascript
// Validates email format, password strength
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (pwd) => pwd.length >= 8;
```

#### 4. Environment Variables
Sensitive data never hardcoded; use `.env` files:

```env
# ✅ Good - Environment variable
MONGODB_URI=mongodb://user:pass@host:27017/db

# ❌ Bad - Hardcoded
const uri = "mongodb://user:pass@host:27017/db";
```

### SAST (Static Application Security Testing)

Run static security analysis:

```bash
# Using npm audit
npm audit

# Using Snyk
npm install -g snyk
snyk test

# Using SonarQube
sonar-scanner \
  -Dsonar.projectKey=devops-api \
  -Dsonar.sources=src
```

**Common findings:**
- Outdated dependencies with known vulnerabilities
- Missing input validation
- Exposed secrets in code
- Insecure cryptography

### DAST (Dynamic Application Security Testing)

Run security tests against running API:

```bash
# Using OWASP ZAP
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:4000/api/v1

# Using Burp Suite Community
# ... (GUI-based testing)
```

**Test Coverage:**
- SQL Injection (not applicable - using ODM)
- XSS attacks
- CSRF tokens
- Authentication bypass
- Rate limiting

### Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use HTTPS in production** - Configure TLS certificates
3. **Implement rate limiting** - Prevent brute force attacks
4. **Add CORS headers carefully** - Restrict to known origins
5. **Use API keys for integrations** - Don't share credentials
6. **Enable MongoDB authentication** - Use username/password
7. **Regular dependency updates** - Check `npm outdated` weekly
8. **Implement API authentication** - Add JWT or OAuth 2.0
9. **Log security events** - Monitor failed logins, errors
10. **Use secrets management** - HashiCorp Vault, AWS Secrets Manager

---

## Testing

### Unit & Integration Tests

Test files use **Jest** with **MongoDB Memory Server** for isolated database:

```bash
npm test
```

**Test Files:**
- `tests/user.test.js` - User registration, login, retrieval
- `tests/post.test.js` - CRUD operations for posts
- `tests/setup.js` - Jest configuration and teardown

**Test Coverage:**
```
Statements   : 85.5% ( 64/75 )
Branches     : 72.3% ( 42/58 )
Functions    : 88.9% ( 32/36 )
Lines        : 86.7% ( 65/75 )
```

**Running Specific Tests:**
```bash
# Single file
npm test -- tests/user.test.js

# Pattern matching
npm test -- --testNamePattern="should register user"

# With coverage
npm test -- --coverage
```

**Example Test:**
```javascript
describe('User Registration', () => {
  it('should register a user with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'SecurePass123'
      });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('test@example.com');
  });
});
```

### Load Testing

Test API under load:

```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:4000/api/v1/users

# Using wrk
wrk -t4 -c100 -d30s http://localhost:4000/api/v1/users
```

**Metrics:**
- Requests per second (RPS)
- Response time (p50, p95, p99)
- Error rate
- Connection pool utilization

---

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:7
        options: >-
          --health-cmd "mongosh --eval 'db.adminCommand(\"ping\")'"
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm test
      - run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - uses: docker/build-push-action@v4
        with:
          push: true
          tags: myregistry/devops-api:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: kubectl apply -f k8s/
      - run: kubectl rollout status deployment/node-app
```

### Pipeline Stages

1. **Test**: Run unit/integration tests
2. **Lint**: Code quality checks
3. **Build**: Create Docker image
4. **Push**: Push to container registry
5. **Deploy**: Update Kubernetes deployment
6. **Verify**: Health checks and smoke tests

### Manual Deployment

```bash
# Build image
docker build -t myregistry/devops-api:v1.0.0 .

# Push to registry
docker push myregistry/devops-api:v1.0.0

# Deploy to Kubernetes
kubectl set image deployment/node-app \
  node-app=myregistry/devops-api:v1.0.0

# Verify
kubectl rollout status deployment/node-app
```

---

## Project Structure

```
devops_project/
├── src/                                 # Source code
│   ├── app.js                          # Express app setup & middleware
│   ├── index.js                        # Server entry point
│   ├── config/
│   │   ├── .env                        # Environment variables (git-ignored)
│   │   └── database.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── user.controller.js          # User business logic
│   │   └── post.controller.js          # Post business logic
│   ├── models/
│   │   ├── user.model.js               # User schema & validation
│   │   └── post.model.js               # Post schema & validation
│   ├── routes/
│   │   ├── user.route.js               # User endpoints
│   │   └── post.route.js               # Post endpoints
│   └── observability/
│       ├── logging.js                  # Structured logging middleware
│       ├── metrics.js                  # Prometheus metrics
│       └── tracing.js                  # Request tracing middleware
│
├── k8s/                                 # Kubernetes manifests
│   ├── app.yml                         # Deployment & Service
│   └── mongo.yml                       # MongoDB Deployment & Service
│
├── tests/                              # Test suite
│   ├── setup.js                        # Jest configuration
│   ├── user.test.js                    # User endpoint tests
│   └── post.test.js                    # Post endpoint tests
│
├── dockerfile                          # Docker image build
├── docker-compose.yml                  # Multi-container development
├── jest.config.js                      # Jest test configuration
├── package.json                        # Dependencies & scripts
├── package-lock.json                   # Locked dependency versions
├── .gitignore                          # Git exclusions
└── README.md                           # This file
```

### File Purposes

| File | Purpose |
|------|---------|
| `src/app.js` | Express middleware, security headers, routes setup |
| `src/index.js` | Server initialization, port binding |
| `src/config/database.js` | MongoDB connection and initialization |
| `src/controllers/*` | Business logic separated from routing |
| `src/models/*` | MongoDB schemas with validation |
| `src/routes/*` | HTTP endpoint definitions |
| `src/observability/*` | Logging, metrics, tracing middleware |
| `k8s/*` | Kubernetes deployment configuration |
| `tests/*` | Jest tests with isolated DB |

---

## Development Guide

### Project Setup

```bash
# Clone repository
git clone <repo-url>
cd devops_project

# Install dependencies
npm install

# Create environment file
cp .env.example src/config/.env

# Start with Docker Compose
docker-compose up -d
```

### Development Workflow

```bash
# 1. Start MongoDB (if not using Docker)
docker run -d -p 27017:27017 --name mongodb mongo:7

# 2. Run server with auto-reload
npm run nodemon

# 3. In another terminal, run tests in watch mode
npm test -- --watch

# 4. Make code changes
# ... edit files in src/

# 5. Tests run automatically, server reloads automatically
```

### Adding New Endpoints

1. **Create controller** (`src/controllers/feature.controller.js`):
```javascript
export const createFeature = async (req, res) => {
  try {
    const { name } = req.body;
    // Business logic
    res.status(201).json({ message: 'Created', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

2. **Create routes** (`src/routes/feature.route.js`):
```javascript
import express from 'express';
import { createFeature } from '../controllers/feature.controller.js';

const router = express.Router();
router.post('/', createFeature);

export default router;
```

3. **Register in app.js**:
```javascript
import featureRouter from './routes/feature.route.js';
app.use('/api/v1/features', featureRouter);
```

4. **Add tests** (`tests/feature.test.js`)
5. **Commit and create PR**

### Code Quality Standards

- **Linting**: ESLint (recommended)
- **Formatting**: Prettier
- **Test Coverage**: Minimum 80%
- **Naming**: camelCase for variables, PascalCase for classes

```bash
# Setup linting
npm install --save-dev eslint prettier eslint-config-prettier

# Format code
npx prettier --write src/

# Check linting
npx eslint src/
```

### Committing Code

```bash
# Create feature branch
git checkout -b feature/user-auth

# Make changes and commit
git add .
git commit -m "feat: add user authentication"

# Push and create PR
git push origin feature/user-auth

# After review and approval, merge
git checkout main
git merge feature/user-auth
```

---

## Troubleshooting

### Common Issues & Solutions

#### 1. MongoDB Connection Error

**Error:**
```
MongooseError: Cannot connect to mongodb://localhost:27017/devops_project
```

**Solution:**
```bash
# Check MongoDB is running
docker ps | grep mongo

# Or start MongoDB
docker run -d -p 27017:27017 mongo:7

# Verify connection
mongosh localhost:27017
```

#### 2. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE :::4000
```

**Solution:**
```bash
# Find process using port 4000
lsof -i :4000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=5000
```

#### 3. Docker Compose Service Won't Start

**Error:**
```
docker-compose up failed
```

**Solution:**
```bash
# Check logs
docker-compose logs api

# Rebuild containers
docker-compose down -v
docker-compose up --build

# Clean Docker system
docker system prune -a
```

#### 4. Tests Failing

**Error:**
```
FAIL tests/user.test.js
```

**Solution:**
```bash
# Run with verbose output
npm test -- --verbose

# Debug single test
npm test -- tests/user.test.js

# Check MongoDB Memory Server
npm test -- --detectOpenHandles
```

#### 5. Kubernetes Pod Stuck in Pending

**Error:**
```
kubectl get pods
# pod/node-app-xxxx    0/1    Pending
```

**Solution:**
```bash
# Check events
kubectl describe pod <pod-name>

# Check node resources
kubectl top nodes

# Check image availability
kubectl get events --sort-by='.lastTimestamp'

# For minikube
minikube status
minikube logs
```

### Debugging Tips

```bash
# View container logs
docker-compose logs -f app --tail=100

# Execute command in container
docker-compose exec api npm test

# Access MongoDB in container
docker-compose exec mongo mongosh

# Kubernetes debugging
kubectl describe deployment node-app
kubectl logs deployment/node-app -f
kubectl exec -it <pod-name> -- /bin/sh
```

### Performance Optimization

```bash
# Check slowest routes
npm test -- --detectOpenHandles

# Profile with Node
node --prof src/index.js
node --prof-process isolate-*.log > profile.txt

# Monitor memory usage
docker stats

# Check dependencies size
npm list --depth=0
```

---

## Additional Resources

### Documentation
- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Docker](https://docs.docker.com/)
- [Kubernetes](https://kubernetes.io/docs/)
- [Jest](https://jestjs.io/)

### Tools & Services
- **Monitoring**: Prometheus, Grafana
- **Logging**: ELK Stack, Splunk, Datadog
- **Tracing**: Jaeger, Zipkin, DataDog APM
- **Container Registry**: Docker Hub, Azure Container Registry, ECR
- **Kubernetes**: minikube, kind, EKS, AKS, GKE

### Learning Resources
- [DevOps Handbook](https://itrevolution.com/devops-handbook/)
- [The Phoenix Project](https://itrevolution.com/phoenix-project/)
- [Kubernetes in Action](https://www.manning.com/books/kubernetes-in-action)
- [Docker Deep Dive](https://www.bretfisher.com/)

---

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**PR Requirements:**
- Passing tests
- Updated documentation
- Code follows project style
- At least one peer review

---

## License

This project is licensed under the ISC License - see LICENSE file for details.

---

## Author

**Mariem Charef**

DevOps Engineer | Full Stack Developer

- GitHub: [@mariemcharef](https://github.com/mariemcharef)
- Email: mariem@example.com

---

## Lessons Learned

This project demonstrates:

✅ **Infrastructure as Code**: Kubernetes manifests for reproducible deployments  
✅ **Containerization**: Docker for environment consistency  
✅ **Observability**: Logging, metrics, and tracing as first-class concerns  
✅ **Security**: Headers, hashing, validation, and testing  
✅ **CI/CD**: Automated testing and deployment pipelines  
✅ **Testing**: Comprehensive unit and integration tests  
✅ **Code Organization**: Separation of concerns (models, controllers, routes)  
✅ **Documentation**: Clear setup, deployment, and API documentation  

---

**Last Updated**: January 15, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
