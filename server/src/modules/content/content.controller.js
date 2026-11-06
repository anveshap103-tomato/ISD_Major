import * as contentService from './content.service.js';

// Content Controller Placeholders (Anvesha Patel)
export const getContentList = async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Get content list not yet implemented' });
  } catch (error) {
    next(error);
  }
};

export const addBookmark = async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Add bookmark not yet implemented' });
  } catch (error) {
    next(error);
  }
};

export const getBookmarks = async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Get bookmarks not yet implemented' });
  } catch (error) {
    next(error);
  }
};

