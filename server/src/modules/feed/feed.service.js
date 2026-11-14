import prisma from '../../config/db.js';

const serializeContent = ({ category, ...item }) => ({
  ...item,
  type: item.type.toLowerCase(),
  category: category.name,
  categorySlug: category.slug,
});

export const generateFeedForUser = async (userId) => {
  // Fetch the user's selected interests.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      userInterests: {
        select: {
          interest: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  const interests = user.userInterests.map(({ interest }) => interest);

  if (interests.length === 0) {
    return {
      interests: [],
      recommendedContent: [],
      suggestedCreators: [],
    };
  }

  // Match content against the user's interests and category names/slugs.
  const contentConditions = interests.flatMap(({ name, slug }) => [
    {
      category: {
        name: { contains: name, mode: 'insensitive' },
      },
    },
    {
      category: {
        slug: { contains: slug, mode: 'insensitive' },
      },
    },
    {
      title: { contains: name, mode: 'insensitive' },
    },
    {
      description: { contains: name, mode: 'insensitive' },
    },
  ]);

  const recommendedContent = await prisma.content.findMany({
    where: {
      OR: contentConditions,
    },
    include: {
      category: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

// Map user interests to actual creator categories and relevant keywords.
const interestAliases = {
  technology: [
    'Cloud & DevOps',
    'Backend & Systems',
    'Frontend & Design',
    'Cybersecurity',
    'AI & Machine Learning',
    'Product & Tech Leadership',
  ],
  'ai & ml': [
    'AI & Machine Learning',
    'Artificial Intelligence',
    'Machine Learning',
  ],
  design: [
    'Frontend & Design',
    'UI/UX',
    'Design Systems',
  ],
  business: [
    'Product & Tech Leadership',
    'Product Strategy',
    'Business',
  ],
  entrepreneurship: [
    'Product & Tech Leadership',
    'Entrepreneurship',
    'Growth',
    'Founder',
  ],
};

const creatorInterestTerms = interests.flatMap(({ name }) => {
  const aliases = interestAliases[name.toLowerCase()] || [];
  return [name, ...aliases];
});

const creatorConditions = creatorInterestTerms.flatMap((term) => [
  {
    category: { contains: term, mode: 'insensitive' },
  },
  {
    skills: {
      some: {
        skillName: { contains: term, mode: 'insensitive' },
      },
    },
  },
]);

  const creatorProfiles = await prisma.creatorProfile.findMany({
    where: {
      userId: { not: userId },
      OR: creatorConditions,
    },
    select: {
      id: true,
      professionalTitle: true,
      organization: true,
      location: true,
      introduction: true,
      biography: true,
      profileImage: true,
      category: true,
      experienceYears: true,
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      skills: {
        select: { skillName: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  const suggestedCreators = creatorProfiles.map((profile) => ({
    id: profile.id,
    userId: profile.user.id,
    name: profile.user.name,
    role: profile.professionalTitle,
    company: profile.organization || '',
    location: profile.location || '',
    avatar: profile.profileImage || profile.user.avatarUrl || '',
    profileImage: profile.profileImage || profile.user.avatarUrl || '',
    headline: profile.introduction || '',
    bio: profile.biography || profile.introduction || '',
    category: profile.category || '',
    skills: profile.skills.map(({ skillName }) => skillName),
    experienceYears: profile.experienceYears ?? 0,
  }));

  return {
    interests,
    recommendedContent: recommendedContent.map(serializeContent),
    suggestedCreators,
  };
};
