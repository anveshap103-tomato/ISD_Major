import * as contentService from './content.service.js';

const runService = (serviceCall, statusCode = 200) => async (req, res, next) => {
  try {
    const data = await serviceCall(req);
    res.status(statusCode).json({
      success: true,
      data,
      message: 'Operation completed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getContentList = runService((req) =>
  contentService.fetchContent(req.query)
);

export const getContentById = runService((req) =>
  contentService.fetchContentById(req.params.id)
);

export const getCategories = runService(() => contentService.fetchCategories());

export const addBookmark = (req, res, next) => {
  const { contentId } = req.body || {};
  if (typeof contentId !== 'string' || contentId.trim() === '') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'contentId is required',
      },
    });
  }

  return runService(
    (request) => contentService.createBookmark(request.user.userId, contentId.trim()),
    201
  )(req, res, next);
};

export const getBookmarks = runService((req) =>
  contentService.fetchBookmarksByUser(req.user.userId)
);

export const removeBookmark = runService((req) =>
  contentService.deleteBookmark(req.user.userId, req.params.contentId)
);
