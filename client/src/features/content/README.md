# Content Feature Module

**Owner:** Anvesha Patel
**Scope:** Articles, short-form videos, books, categories, search, filtering and bookmarks.

## Day 1 foundation

- `pages/ContentHubPage.jsx` provides the responsive content-feed screen at `/content`.
- `components/` contains reusable content cards and filtering controls.
- `data/mockContent.js` supplies local sample records until live API integration on Day 3.
- `services/contentService.js` centralizes the future Axios API calls.

## API contract

- Public: `GET /api/content`, `GET /api/content/:id`, `GET /api/content/categories`, `GET /api/content/articles`, `GET /api/content/videos`, `GET /api/content/books`
- Authenticated: `GET /api/content/bookmarks`, `POST /api/content/bookmarks`, `DELETE /api/content/bookmarks/:contentId`

The database uses one `Content` model with a type of `ARTICLE`, `VIDEO` or `BOOK`; `Category` organizes content and `Bookmark` links a user to a saved resource. The unique bookmark constraint prevents a user from saving the same resource twice.
