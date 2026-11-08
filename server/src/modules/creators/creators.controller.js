import * as creatorsService from './creators.service.js';

/**
 * GET /api/creators
 * List creators with optional filtering (search, category, skill, pagination)
 */
export const getCreators = async (req, res, next) => {
  try {
    const { search, category, skill, page, limit } = req.query;

    const data = await creatorsService.fetchCreators({
      search,
      category,
      skill,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      data,
      message: 'Creators retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/creators/search
 * Dedicated search endpoint by keyword, skill, and expertise
 */
export const searchCreators = async (req, res, next) => {
  try {
    const { q, query, skill, expertise } = req.query;
    const searchQuery = q || query || '';

    const data = await creatorsService.searchCreators({
      query: searchQuery,
      skill,
      expertise,
    });

    res.status(200).json({
      success: true,
      data,
      message: 'Creator search executed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/creators/:id
 * Retrieve single creator profile by ID
 */
export const getCreatorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const creator = await creatorsService.fetchCreatorById(id);

    if (!creator) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Creator with ID '${id}' not found`,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: { creator },
      message: 'Creator profile retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/creators/:id/content
 * Retrieve published or curated content for a specific creator
 */
export const getCreatorContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contentData = await creatorsService.fetchCreatorContent(id);

    if (!contentData) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Creator with ID '${id}' not found`,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: contentData,
      message: 'Creator content retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

