import * as feedService from './feed.service.js';

// Feed Controller Placeholders (Jatin)
export const getPersonalizedFeed = async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Get personalized feed not yet implemented' });
  } catch (error) {
    next(error);
  }
};

