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
  - `type`: `article` | `video` | `book` (case-insensitive)
  - `category`: string (e.g. `technology`, `design`)
  - `search`: string
  - `page`: integer (default: 1)
  - `limit`: integer (default: 10, maximum: 50)
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

#### `GET /api/content/:id`
- **Description**: Retrieve one content item by its UUID.
- **Response (200 OK)**: Uses the success envelope above and returns the content item, including its category.
- **Response (404 Not Found)**: Returned when the content item does not exist.

#### `GET /api/content/categories`
- **Description**: Retrieve the available content categories.
- **Response (200 OK)**: `{ "success": true, "data": { "items": [] }, "message": "Categories retrieved successfully" }`

#### `POST /api/content/bookmarks`
- **Auth**: Required
- **Description**: Bookmark an article, video, or book.
- **Request Body**:
  ```json
  {
    "contentId": "uuid"
  }
  ```
- **Response (201 Created)**: Returns the created bookmark in the standard success envelope.
- **Response (409 Conflict)**: Returned if the user already bookmarked this content.

#### `GET /api/content/bookmarks`
- **Auth**: Required
- **Description**: Retrieve user's saved bookmarks.
- **Response (200 OK)**: Returns `{ "items": [] }` in the standard success envelope.

#### `DELETE /api/content/bookmarks/:contentId`
- **Auth**: Required
- **Description**: Remove the current user's bookmark for the specified content UUID.
- **Response (200 OK)**: Returns the removed content ID in the standard success envelope.
- **Response (404 Not Found)**: Returned if the current user has no bookmark for that content.

> **Day 1 status:** Routes and contracts are in place. Content queries and bookmark persistence will be implemented on Day 2; these endpoints currently return the standard `NOT_IMPLEMENTED` error until then.

---

### 2.3 Creator Discovery & Profiles (`/api/creators`) — Tushar Singh

> **Implementation Note**: Fully database-backed via PostgreSQL and Prisma ORM 7 (`@prisma/adapter-pg`). All creator records are keyed by standard PostgreSQL UUIDs and resolved through relational queries across `CreatorProfile`, `User`, `CreatorSkill`, and `CreatorAchievement` models.

---

#### 2.3.1 `GET /api/creators`
- **Purpose**: Retrieve a paginated list of creators and practitioners with optional multi-attribute filtering by search keywords, category domains, or skills.
- **HTTP Method**: `GET`
- **Endpoint**: `/api/creators`
- **Authentication**: Public
- **Query Parameters**:
  | Parameter | Type | Required | Default | Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `search` | `string` | No | — | Case-insensitive match across `user.name`, `professionalTitle`, `organization`, `biography`, or `introduction`. |
  | `category` | `string` | No | `All` | Filter by domain category (e.g. `Cloud & DevOps`, `AI & Machine Learning`, `Frontend & Design`, `Backend & Systems`, `Cybersecurity`, `Product & Tech Leadership`). |
  | `skill` | `string` | No | — | Filter creators possessing a specific skill tag (e.g. `Kubernetes`, `PyTorch`). |
  | `page` | `integer` | No | `1` | Page number for pagination (must be a positive integer $\ge 1$). |
  | `limit` | `integer` | No | `10` | Maximum number of creator records to return per page (capped at `50`). |

- **HTTP Status Codes**:
  - `200 OK`: Request succeeded, returns creator array and pagination metadata.
  - `400 Bad Request`: Malformed, non-integer, or negative pagination values.
  - `500 Internal Server Error`: Unhandled server exception.

- **Example 200 OK Response**:
  ```json
  {
    "success": true,
    "data": {
      "creators": [
        {
          "id": "1eb08dc3-f87d-4634-8117-477a8fa48e46",
          "name": "Aarav Sharma",
          "role": "Staff Cloud Architect",
          "company": "Google Cloud",
          "location": "Bengaluru, India",
          "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
          "profileImage": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
          "headline": "Architecting planetary-scale distributed cloud systems & mentoring platform engineers.",
          "bio": "Specializing in planetary-scale distributed systems and Kubernetes infrastructure. Passionate about mentoring aspiring platform engineers.",
          "category": "Cloud & DevOps",
          "skills": ["Kubernetes", "GCP", "Terraform", "Go", "Distributed Systems"],
          "experienceYears": 9,
          "contentCount": 0
        }
      ],
      "total": 8,
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
- **Purpose**: Dedicated search endpoint querying across creator credentials (`professionalTitle`), display name, company/organization, biography, introduction, and skill taxonomies.
- **HTTP Method**: `GET`
- **Endpoint**: `/api/creators/search`
- **Authentication**: Public
- **Query Parameters**:
  | Parameter | Type | Required | Default | Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `q` / `query` | `string` | No | `""` | Search keyword string matching against creator name, role, organization, bio, or skills. |
  | `skill` | `string` | No | — | Filter creators by matching a specific skill name. |
  | `expertise` / `category` | `string` | No | — | Domain category filter match (e.g., `AI & Machine Learning`). |

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
          "id": "1eb08dc3-f87d-4634-8117-477a8fa48e46",
          "name": "Aarav Sharma",
          "role": "Staff Cloud Architect",
          "company": "Google Cloud",
          "location": "Bengaluru, India",
          "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
          "profileImage": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
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
- **Purpose**: Retrieve the full profile of a single creator by their unique PostgreSQL UUID (`CreatorProfile.id` or `User.id`), including headline, detailed biography, location, credentials, skills, achievements, and social links.
- **HTTP Method**: `GET`
- **Endpoint**: `/api/creators/:id`
- **Authentication**: Public
- **Route Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `string` | Yes | Unique creator identifier (PostgreSQL UUID format). |

- **HTTP Status Codes**:
  - `200 OK`: Creator found and complete profile returned.
  - `404 Not Found`: No creator exists matching the supplied UUID or malformed UUID provided.
  - `500 Internal Server Error`: Unhandled server exception.

- **Example 200 OK Response**:
  ```json
  {
    "success": true,
    "data": {
      "creator": {
        "id": "1eb08dc3-f87d-4634-8117-477a8fa48e46",
        "userId": "d7411283-d9ea-4df2-a398-3162a87c5364",
        "name": "Aarav Sharma",
        "email": "aarav.sharma@example.com",
        "role": "Staff Cloud Architect",
        "professionalTitle": "Staff Cloud Architect",
        "company": "Google Cloud",
        "organization": "Google Cloud",
        "location": "Bengaluru, India",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        "profileImage": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        "headline": "Architecting planetary-scale distributed cloud systems & mentoring platform engineers.",
        "introduction": "Architecting planetary-scale distributed cloud systems & mentoring platform engineers.",
        "bio": "Specializing in planetary-scale distributed systems and Kubernetes infrastructure. Passionate about mentoring aspiring platform engineers.",
        "biography": "Specializing in planetary-scale distributed systems and Kubernetes infrastructure. Passionate about mentoring aspiring platform engineers.",
        "detailedBio": [
          "Specializing in planetary-scale distributed systems and Kubernetes infrastructure. Passionate about mentoring aspiring platform engineers."
        ],
        "category": "Cloud & DevOps",
        "experienceYears": 9,
        "expertiseAreas": [
          { "area": "Cloud Architecture", "description": "Designing multi-region disaster-resilient systems." },
          { "area": "Kubernetes & Containers", "description": "Production orchestration, service mesh & GitOps." }
        ],
        "experienceHistory": [
          { "role": "Staff Cloud Architect", "company": "Google Cloud", "period": "2022 - Present", "description": "Leading architecture for enterprise clients." }
        ],
        "socialLinks": {
          "github": "https://github.com",
          "linkedin": "https://linkedin.com",
          "twitter": "https://twitter.com",
          "website": "https://aaravsharma.dev"
        },
        "skills": ["Kubernetes", "GCP", "Terraform", "Go", "Distributed Systems"],
        "achievements": [
          {
            "id": "766e4a29-b68a-45c1-90ef-8671fc51c223",
            "title": "CNCF Community Ambassador",
            "issuer": "Cloud Native Computing Foundation",
            "issuingOrganization": "Cloud Native Computing Foundation",
            "achievementType": "AWARD",
            "year": "2025",
            "description": "Recognized for contributions to the Kubernetes mentorship program."
          }
        ],
        "contentCount": 0,
        "createdAt": "2026-11-08T00:00:00.000Z",
        "updatedAt": "2026-11-08T00:00:00.000Z"
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
      "message": "Creator with ID '00000000-0000-0000-0000-000000000000' not found"
    }
  }
  ```

---

#### 2.3.4 `GET /api/creators/:id/content`
- **Purpose**: Retrieve curated educational resources and content published by a specific creator.
- **HTTP Method**: `GET`
- **Endpoint**: `/api/creators/:id/content`
- **Authentication**: Public
- **Route Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `string` | Yes | Unique creator identifier (PostgreSQL UUID format). |

- **Integration Status**:
  > **Teammate Integration Notice**: Returns a guaranteed empty collection `{ content: [], count: 0 }` for existing creators until Anvesha Patel's Content Hub module is connected. Non-existent creator IDs return `404 Not Found`.

- **HTTP Status Codes**:
  - `200 OK`: Request succeeded, returns creator identity and content array.
  - `404 Not Found`: Creator with the specified UUID does not exist.
  - `500 Internal Server Error`: Unhandled server exception.

- **Example 200 OK Response**:
  ```json
  {
    "success": true,
    "data": {
      "creatorId": "1eb08dc3-f87d-4634-8117-477a8fa48e46",
      "creatorName": "Aarav Sharma",
      "content": [],
      "count": 0
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
      "message": "Creator with ID '00000000-0000-0000-0000-000000000000' not found"
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

