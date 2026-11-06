# API Contracts & Endpoint Specifications — Ryth Core

> **Base URL**: `http://localhost:5000/api` (Development)  
> **Protocol**: RESTful JSON over HTTP/HTTPS  
> **Authentication**: Bearer Token in `Authorization` header (`Bearer <token>`)

---

## 1. Global Response Standards

### Success Response Envelope
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

### Error Response Envelope
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid input parameters provided",
    "details": []
  }
}
```

---

## 2. Module Endpoints

### 2.1 Authentication & Profile (`/api/auth`, `/api/users`) — Jatin

#### `POST /api/auth/register`
- **Description**: Register a new user account.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123",
    "name": "Alex Morgan",
    "interests": ["Web Development", "AI/ML"]
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "uuid", "email": "user@example.com", "name": "Alex Morgan" },
      "token": "jwt_token_string"
    }
  }
  ```

#### `POST /api/auth/login`
- **Description**: Authenticate user and return JWT token.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "uuid", "email": "user@example.com", "name": "Alex Morgan" },
      "token": "jwt_token_string"
    }
  }
  ```

#### `GET /api/users/profile`
- **Auth**: Required
- **Response (200 OK)**: Returns authenticated user's profile and selected interests.

---

### 2.2 Content & Knowledge Hub (`/api/content`) — Anvesha Patel

#### `GET /api/content`
- **Description**: Fetch content with optional filters.
- **Query Parameters**:
  - `type`: `article` | `video` | `book`
  - `category`: string (e.g. `technology`, `design`)
  - `search`: string
  - `page`: integer (default: 1)
  - `limit`: integer (default: 10)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "uuid",
          "title": "Introduction to Modern System Design",
          "type": "article",
          "category": "Technology",
          "url": "https://example.com/article",
          "author": "Tech Digest",
          "createdAt": "2026-11-07T00:00:00Z"
        }
      ],
      "total": 1,
      "page": 1,
      "totalPages": 1
    }
  }
  ```

#### `POST /api/content/bookmarks`
- **Auth**: Required
- **Description**: Bookmark an article, video, or book.
- **Request Body**:
  ```json
  {
    "contentId": "uuid"
  }
  ```

#### `GET /api/content/bookmarks`
- **Auth**: Required
- **Description**: Retrieve user's saved bookmarks.

---

### 2.3 Creator Discovery & Profiles (`/api/creators`) — Tushar Singh

#### `GET /api/creators`
- **Description**: Search and list creators and professionals.
- **Query Parameters**:
  - `search`: string (query creator name or headline)
  - `skill`: string (filter by specific skill)
  - `expertise`: string (domain filter)
  - `page`: integer
  - `limit`: integer
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "creators": [
        {
          "id": "uuid",
          "userId": "uuid",
          "name": "Sarah Connor",
          "headline": "Lead Systems Architect at Robotics Inc",
          "bio": "Building scalable distributed systems and mentoring aspiring engineers.",
          "skills": ["Distributed Systems", "Go", "PostgreSQL"],
          "domains": ["Cloud Computing", "AI"]
        }
      ]
    }
  }
  ```

#### `GET /api/creators/:id`
- **Description**: Get full public profile of a creator including published content & social links.

---

### 2.4 Connections & Networking (`/api/connections`) — Jatin

#### `POST /api/connections/request`
- **Auth**: Required
- **Description**: Send a connection request to a creator or peer.
- **Request Body**:
  ```json
  {
    "receiverId": "uuid",
    "note": "Hi Sarah, I would love to connect and learn more about your journey in Cloud Computing."
  }
  ```

#### `GET /api/connections`
- **Auth**: Required
- **Description**: Fetch all active connections and pending connection requests.

#### `PATCH /api/connections/:id`
- **Auth**: Required
- **Description**: Accept or reject a connection request.
- **Request Body**:
  ```json
  {
    "status": "ACCEPTED"
  }
  ```

---

### 2.5 Personalized Feed (`/api/feed`) — Jatin

#### `GET /api/feed`
- **Auth**: Required
- **Description**: Returns a blended personalized feed containing recommended content and relevant creators based on user's registered interests and connection graph.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "recommendedContent": [],
      "suggestedCreators": []
    }
  }
  ```

