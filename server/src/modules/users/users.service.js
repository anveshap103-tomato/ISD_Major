import prisma from '../../config/db.js';

export const updateUserProfile = async (userId, profileData) => {
  const { name, avatarUrl } = profileData;

  const data = {};

  if (name !== undefined) {
    data.name = name.trim();
  }

  if (avatarUrl !== undefined) {
    data.avatarUrl = avatarUrl;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
      userInterests: {
        select: {
          interest: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return user;
};
