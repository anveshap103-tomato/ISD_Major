const notImplemented = (operation) => {
  const error = new Error(`${operation} will be implemented in the next phase`);
  error.statusCode = 501;
  error.code = 'NOT_IMPLEMENTED';
  return error;
};

// Day 1 route skeletons. Database queries and full validation are part of Day 2.
export const fetchContent = async () => {
  throw notImplemented('Content listing');
};

export const fetchContentById = async () => {
  throw notImplemented('Content details');
};

export const fetchCategories = async () => {
  throw notImplemented('Category listing');
};

export const createBookmark = async () => {
  throw notImplemented('Bookmark creation');
};

export const fetchBookmarksByUser = async () => {
  throw notImplemented('Bookmark listing');
};

export const deleteBookmark = async () => {
  throw notImplemented('Bookmark deletion');
};
