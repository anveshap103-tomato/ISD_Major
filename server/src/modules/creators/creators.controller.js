import * as creatorsService from './creators.service.js';

// Creator Controller Placeholders (Tushar Singh)
export const getCreators = async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Get creators not yet implemented' });
  } catch (error) {
    next(error);
  }
};

export const getCreatorById = async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Get creator by ID not yet implemented' });
  } catch (error) {
    next(error);
  }
};

