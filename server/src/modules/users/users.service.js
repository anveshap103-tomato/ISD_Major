import prisma from '../../config/db.js';

const INTEREST_OPTIONS = [
  'Technology',
  'Design',
  'Business',
  'Content Creation',
  'AI & ML',
  'Entrepreneurship',
];

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

export const getAvailableInterests = () => {
  return INTEREST_OPTIONS;
};

export const updateUserInterests = async (userId, interests) => {
  return prisma.$transaction(async (tx) => {
    await tx.userInterest.deleteMany({
      where: { userId },
    });

    for (const name of interests) {
      const slug = name.toLowerCase().replace(/\s+/g, '-');

      const interest = await tx.interest.upsert({
        where: { slug },
        update: {},
        create: { name, slug },
      });

      await tx.userInterest.create({
        data: {
          userId,
          interestId: interest.id,
        },
      });
    }

    return tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
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
  });
};