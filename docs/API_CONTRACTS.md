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

> **Phase Note**: The endpoints currently return mock data defined in `server/src/modules/creators/creators.service.js` with identifiers like `creator-1`, `creator-2`. In the subsequent database integration phase, IDs will be PostgreSQL UUIDs and data will be resolved through Prisma models (`CreatorProfile`, `User`, `CreatorSkill`, `CreatorAchievement`).

---

#### 2.3.1 `GET /api/creators`
- **Purpose**: Retrieve a paginated list of creators and practitioners with optional multi-attribute filtering by search keywords, category domains, or skills.
- **HTTP Method**: `GET`
- **Endpoint**: `/api/creators`
- **Authentication**: Public
- **Query Parameters**:
  | Parameter | Type | Required | Default | Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `search` | `string` | No | — | Case-insensitive match across `name`, `role`, `company`, or `bio`. |
  | `category` | `string` | No | `All` | Filter by domain category (e.g. `Cloud & DevOps`, `AI & Machine Learning`, `Frontend & Design`, `Backend & Systems`, `Cybersecurity`, `Product & Tech Leadership`). |
  | `skill` | `string` | No | — | Filter creators possessing a specific skill tag (e.g. `Kubernetes`, `PyTorch`). |
  | `page` | `integer` | No | `1` | Page number for pagination. |
  | `limit` | `integer` | No | `10` | Maximum number of creator records to return per page. |

- **HTTP Status Codes**:
  - `200 OK`: Request succeeded, returns creator array and pagination metadata.
  - `400 Bad Request`: Malformed or negative pagination values.
  - `500 Internal Server Error`: Unhandled server exception.

- **Example 200 OK Response**:
  ```json
  {
    "success": true,
    "data": {
      "creators": [
        {
          "id": "creator-1",
          "name": "Aarav Sharma",
          "role": "Staff Cloud Architect",
          "company": "Google Cloud",
          "location": "Bengaluru, India",
          "headline": "Architecting planetary-scale distributed cloud systems & mentoring platform engineers.",
          "bio": "Specializing in planetary-scale distributed systems and Kubernetes infrastructure. Passionate about mentoring aspiring platform engineers.",
          "category": "Cloud & DevOps",
          "skills": ["Kubernetes", "GCP", "Terraform", "Go", "Distributed Systems"],
          "experienceYears": 9,
          "contentCount": 4
        }
      ],
      "total": 1,
      "page": 1,
      "totalPages": 1
    },
    "message": "Creators retrieved successfully"
  }
  ```

- **Example 400 Bad Request Error**:
  ```json
  {
    "success": false,
    "error": {
      "code": "BAD_REQUEST",
      "message": "Invalid page parameter: must be a positive integer"
    }
  }
  ```

---

#### 2.3.2 `GET /api/creators/search`
- **Purpose**: Dedicated search endpoint optimized for real-time auto-complete and search bars, querying across creator credentials, names, and skill taxonomies.
- **HTTP Method**: `GET`
- **Endpoint**: `/api/creators/search`
- **Authentication**: Public
- **Query Parameters**:
  | Parameter | Type | Required | Default | Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `q` / `query` | `string` | No | `""` | Search keyword string matching against creator name, role, or skills. |
  | `skill` | `string` | No | — | Exact skill filter match. |
  | `expertise` | `string` | No | — | Domain category filter match. |

- **HTTP Status Codes**:
  - `200 OK`: Search query executed successfully.
  - `500 Internal Server Error`: Unhandled server exception.

- **Example 200 OK Response**:
  ```json
  {
    "success": true,
    "data": {
      "results": [
        {
          "id": "creator-1",
          "name": "Aarav Sharma",
          "role": "Staff Cloud Architect",
          "company": "Google Cloud",
          "location": "Bengaluru, India",
          "category": "Cloud & DevOps",
          "skills": ["Kubernetes", "GCP", "Terraform", "Go", "Distributed Systems"],
          "experienceYears": 9
        }
      ],
      "query": "kubernetes",
      "count": 1
    },
    "message": "Creator search executed successfully"
  }
  ```

- **Example 500 Internal Server Error**:
  ```json
  {
    "success": false,
    "error": {
      "code": "INTERNAL_SERVER_ERROR",
      "message": "An unexpected error occurred while executing search"
    }
  }
  ```

---

#### 2.3.3 `GET /api/creators/:id`
- **Purpose**: Retrieve the full profile of a single creator by their unique ID, including headline, biography, location, credentials, and associated skills.
- **HTTP Method**: `GET`
- **Endpoint**: `/api/creators/:id`
- **Authentication**: Public
- **Route Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `string` | Yes | Unique creator identifier (e.g. `creator-1` during mock phase; UUID in DB phase). |

- **HTTP Status Codes**:
  - `200 OK`: Creator found and profile data returned.
  - `404 Not Found`: No creator exists matching the supplied ID.
  - `500 Internal Server Error`: Unhandled server exception.

- **Example 200 OK Response (Current Mock Implementation)**:
  ```json
  {
    "success": true,
    "data": {
      "creator": {
        "id": "creator-1",
        "name": "Aarav Sharma",
        "role": "Staff Cloud Architect",
        "company": "Google Cloud",
        "location": "Bengaluru, India",
        "headline": "Architecting planetary-scale distributed cloud systems & mentoring platform engineers.",
        "bio": "Specializing in planetary-scale distributed systems and Kubernetes infrastructure. Passionate about mentoring aspiring platform engineers.",
        "category": "Cloud & DevOps",
        "skills": ["Kubernetes", "GCP", "Terraform", "Go", "Distributed Systems"],
        "experienceYears": 9,
        "contentCount": 4
      }
    },
    "message": "Creator profile retrieved successfully"
  }
  ```

- **Example 200 OK Response (Planned Prisma/PostgreSQL DB-Backed Phase)**:
  ```json
  {
    "success": true,
    "data": {
      "creator": {
        "id": "c4b1a78e-6c2e-4b95-a223-9f5e1f0e4d01",
        "userId": "u1a9f8b2-3c4d-4e5f-a6b7-8c9d0e1f2a3b",
        "name": "Aarav Sharma",
        "professionalTitle": "Staff Cloud Architect",
        "organization": "Google Cloud",
        "location": "Bengaluru, India",
        "introduction": "Architecting planetary-scale distributed cloud systems & mentoring platform engineers.",
        "biography": "Specializing in planetary-scale distributed systems and Kubernetes infrastructure. Passionate about mentoring aspiring platform engineers.",
        "profileImage": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        "socialLinks": {
          "github": "https://github.com",
          "linkedin": "https://linkedin.com",
          "twitter": "https://twitter.com",
          "website": "https://aaravsharma.dev"
        },
        "skills": [
          { "id": "s1", "skillName": "Kubernetes" },
          { "id": "s2", "skillName": "GCP" },
          { "id": "s3", "skillName": "Terraform" }
        ],
        "achievements": [
          {
            "id": "a1",
            "title": "CNCF Community Ambassador",
            "issuingOrganization": "Cloud Native Computing Foundation",
            "achievementType": "AWARD",
            "year": "2025"
          }
        ],
        "createdAt": "2026-11-07T00:00:00.000Z",
        "updatedAt": "2026-11-07T00:00:00.000Z"
      }
    },
    "message": "Creator profile retrieved successfully"
  }
  ```

- **Example 404 Not Found Error**:
  ```json
  {
    "success": false,
    "error": {
      "code": "NOT_FOUND",
      "message": "Creator with ID 'creator-999' not found"
    }
  }
  ```

---

#### 2.3.4 `GET /api/creators/:id/content`
- **Purpose**: Retrieve curated educational content (articles, videos, resources) published or authored by a specific creator.
- **HTTP Method**: `GET`
- **Endpoint**: `/api/creators/:id/content`
- **Authentication**: Public
- **Route Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `string` | Yes | Unique creator identifier. |

- **HTTP Status Codes**:
  - `200 OK`: Request succeeded, returns array of content items (may be empty `[]`).
  - `404 Not Found`: Creator with the specified ID does not exist.
  - `500 Internal Server Error`: Unhandled server exception.

- **Example 200 OK Response**:
  ```json
  {
    "success": true,
    "data": {
      "creatorId": "creator-1",
      "creatorName": "Aarav Sharma",
      "content": [
        {
          "id": "content-101",
          "title": "Designing Zero-Downtime Multi-Region Kubernetes Architectures",
          "type": "article",
          "url": "https://example.com/k8s-multi-region",
          "publishedAt": "2026-10-15"
        },
        {
          "id": "content-102",
          "title": "Consensus Protocols Explained: Raft vs Paxos in Practice",
          "type": "video",
          "url": "https://example.com/consensus-protocols",
          "publishedAt": "2026-10-28"
        }
      ],
      "count": 2
    },
    "message": "Creator content retrieved successfully"
  }
  ```

- **Example 404 Not Found Error**:
  ```json
  {
    "success": false,
    "error": {
      "code": "NOT_FOUND",
      "message": "Creator with ID 'invalid-id' not found"
    }
  }
  ```

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

