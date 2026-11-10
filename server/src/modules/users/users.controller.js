import * as usersService from './users.service.js';

export const updateMe = async (req, res, next) => {
  try {
    const { name, avatarUrl } = req.body;

    if (name === undefined && avatarUrl === undefined) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'At least one profile field is required',
        },
      });
    }

    if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name must be a non-empty string',
        },
      });
    }

    if (
      avatarUrl !== undefined &&
      avatarUrl !== null &&
      typeof avatarUrl !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Avatar URL must be a string or null',
        },
      });
    }

    const user = await usersService.updateUserProfile(
      req.user.userId,
      { name, avatarUrl }
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await usersService.getUserProfile(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
