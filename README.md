# DevOps Project: Node.js Express API with Docker
A modern Node.js Express API with user authentication, post management, and Docker support.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Local Running Guide](#local-running-guide)
- [Docker Usage](#docker-usage)
- [API Examples](#api-examples)
- [Project Structure](#project-structure)

---

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- npm 
- Docker & Docker Compose (for containerized setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mariemcharef/devops-project.git
   cd devops_project 
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in src/config/ directory
   touch src/config/.env
   ```

   Add the following to `.env`:
   ```
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/devops_project
   ```

---

## Local Running Guide

### Run with Node.js

1. **Start the server**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:8000`

2. **Run with auto-reload (development)**
   ```bash
   npm run nodemon
   ```
   Uses Nodemon for automatic restart on file changes.

### Verify Server is Running

```bash
curl http://localhost:8000/api/v1/health
```

---

## Docker Usage

### Build and Run with Docker

1. **Build the Docker image**
   ```bash
   docker build -t devops-api:latest .
   ```

2. **Run the container**
   ```bash
   docker run -p 8000:8000 \
     -e PORT=8000 \
     -e MONGODB_URI=mongodb://host.docker.internal:27017/devops_project \
     devops-api:latest
   ```

### Docker Compose

1. **Start all services**
   ```bash
   docker-compose up
   ```

2. **Start in background**
   ```bash
   docker-compose up -d
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

4. **View logs**
   ```bash
   docker-compose logs -f app
   ```

### Docker Compose Services

- **app**: Node.js API server (port 8000)
- **mongodb**: MongoDB database (port 27017)

---

## API Examples

### Users Endpoints

#### Register User
```bash
POST /api/v1/users/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "username": "john_doe"
  }
}
```

#### Login User
```bash
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "username": "john_doe"
  }
}
```

---

### Posts Endpoints

#### Create Post
```bash
POST /api/v1/posts
Content-Type: application/json

{
  "name": "My First Post",
  "description": "This is an interesting post about technology."
}
```

**Response (201):**
```json
{
  "post": {
    "id": 1,
    "name": "My First Post",
    "description": "This is an interesting post about technology."
  }
}
```

#### Get All Posts
```bash
GET /api/v1/posts
```

**Response (200):**
```json
[
  {
    "_id": 1,
    "name": "My First Post",
    "description": "This is an interesting post about technology.",
    "createdAt": "2025-01-13T10:00:00.000Z",
    "updatedAt": "2025-01-13T10:00:00.000Z"
  },
  {
    "_id": 2,
    "name": "Second Post",
    "description": "Another interesting post.",
    "createdAt": "2025-01-13T11:00:00.000Z",
    "updatedAt": "2025-01-13T11:00:00.000Z"
  }
]
```

#### Update Post
```bash
PUT /api/v1/posts/:id
Content-Type: application/json

{
  "name": "Updated Post Title",
  "description": "Updated description with new content."
}
```

**Response (200):**
```json
{
  "message": "Post updated successfully",
  "post": {
    "_id": 1,
    "name": "Updated Post Title",
    "description": "Updated description with new content.",
    "createdAt": "2025-01-13T10:00:00.000Z",
    "updatedAt": "2025-01-13T12:30:00.000Z"
  }
}
```

---

## Project Structure

```
devops_project/
├── src/
│   ├── config/
│   │   ├── .env                 # Environment variables
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── post.controller.js   # Post business logic
│   │   └── user.controller.js   # User business logic
│   ├── models/
│   │   ├── post.model.js        # Post schema
│   │   └── user.model.js        # User schema
│   ├── routes/
│   │   ├── post.route.js        # Post routes
│   │   └── user.route.js        # User routes
│   ├── app.js                   # Express app setup
│   └── index.js                 # Server entry point
├── dockerfile                   # Docker build configuration
├── docker-compose.yml           # Multi-container setup
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **bcryptjs**: Password hashing
- **dotenv**: Environment variable management
- **nodemon**: Development auto-reload tool

---

**Common Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (missing/invalid fields)
- `404`: Not Found
- `500`: Server Error

---

## Development Tips

1. **Check logs in Docker**
   ```bash
   docker-compose logs -f app
   ```

2. **Rebuild containers after dependency changes**
   ```bash
   docker-compose up --build
   ```

3. **Clean Docker resources**
   ```bash
   docker-compose down -v
   ```

4. **Test with curl or Postman**
   - Import the API endpoints from examples above
   - Use raw JSON for request bodies

---

## Author

Mariem
