import * as contentService from './content.service.js';

// Content Controller Placeholders (Anvesha Patel)
export const getContentList = async (req, res, next) => {
  try {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Content listing will be available after Day 2 data seeding.' },
    });
  } catch (error) {
    next(error);
  }
};

export const getContentById = async (req, res, next) => {
  try {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Content details will be available after Day 2 data seeding.' },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Category listing will be available after Day 2 data seeding.' },
    });
  } catch (error) {
    next(error);
  }
};

export const getArticles = (req, res, next) => {
  req.query.type = 'ARTICLE';
  return getContentList(req, res, next);
};

export const getVideos = (req, res, next) => {
  req.query.type = 'VIDEO';
  return getContentList(req, res, next);
};

export const getBooks = (req, res, next) => {
  req.query.type = 'BOOK';
  return getContentList(req, res, next);
};

export const addBookmark = async (req, res, next) => {
  try {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Bookmarks will be available after Day 3 API integration.' },
    });
  } catch (error) {
    next(error);
  }
};

export const getBookmarks = async (req, res, next) => {
  try {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Bookmarks will be available after Day 3 API integration.' },
    });
  } catch (error) {
    next(error);
  }
};

export const removeBookmark = async (req, res, next) => {
  try {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Bookmarks will be available after Day 3 API integration.' },
    });
  } catch (error) {
    next(error);
  }
};
