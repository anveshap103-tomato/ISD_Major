import * as feedService from './feed.service.js';

export const getPersonalizedFeed = async (req, res, next) => {
  try {
    const feed = await feedService.generateFeedForUser(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data: feed,
    });
  } catch (error) {
    next(error);
  }
};
