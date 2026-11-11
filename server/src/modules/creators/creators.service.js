// Creator Service Layer — Ryth Core
// Business logic separate from controllers; fully database-backed via Prisma 7 & PostgreSQL
import prisma from '../../config/db.js';

// Standard UUID format validator
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isValidUUID = (id) => typeof id === 'string' && UUID_REGEX.test(id.trim());

/**
 * Fetch list of creators from PostgreSQL database with optional query filters
 */
export const fetchCreators = async ({ search, category, skill, page = 1, limit = 10 }) => {
  // Validate pagination parameters
  let pageNum = 1;
  if (page !== undefined && page !== null && page !== '') {
    pageNum = Number(page);
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      const error = new Error('Invalid page parameter: must be a positive integer');
      error.statusCode = 400;
      error.code = 'BAD_REQUEST';
      throw error;
    }
  }

  let limitNum = 10;
  if (limit !== undefined && limit !== null && limit !== '') {
    limitNum = Number(limit);
    if (!Number.isInteger(limitNum) || limitNum < 1) {
      const error = new Error('Invalid limit parameter: must be a positive integer');
      error.statusCode = 400;
      error.code = 'BAD_REQUEST';
      throw error;
    }
  }

  const whereConditions = [];

  // 1. Search keyword (name, professional title, organization, biography, introduction)
  const trimmedSearch = typeof search === 'string' ? search.trim() : '';
  if (trimmedSearch) {
    whereConditions.push({
      OR: [
        {
          user: {
            name: {
              contains: trimmedSearch,
              mode: 'insensitive',
            },
          },
        },
        {
          professionalTitle: {
            contains: trimmedSearch,
            mode: 'insensitive',
          },
        },
        {
          organization: {
            contains: trimmedSearch,
            mode: 'insensitive',
          },
        },
        {
          biography: {
            contains: trimmedSearch,
            mode: 'insensitive',
          },
        },
        {
          introduction: {
            contains: trimmedSearch,
            mode: 'insensitive',
          },
        },
      ],
    });
  }

  // 2. Category domain filter
  const trimmedCategory = typeof category === 'string' ? category.trim() : '';
  if (trimmedCategory && trimmedCategory.toLowerCase() !== 'all') {
    whereConditions.push({
      category: {
        equals: trimmedCategory,
        mode: 'insensitive',
      },
    });
  }

  // 3. Skill filter
  const trimmedSkill = typeof skill === 'string' ? skill.trim() : '';
  if (trimmedSkill) {
    whereConditions.push({
      skills: {
        some: {
          skillName: {
            contains: trimmedSkill,
            mode: 'insensitive',
          },
        },
      },
    });
  }

  const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

  const skip = (pageNum - 1) * limitNum;
  const take = limitNum;

  // Execute count and selective relational query in parallel to prevent N+1 queries
  const [total, profiles] = await Promise.all([
    prisma.creatorProfile.count({ where }),
    prisma.creatorProfile.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'asc' },
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
          select: {
            skillName: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    }),
  ]);

  // Map to frontend-compatible flat schema
  const creators = profiles.map((p) => ({
    id: p.id,
    name: p.user?.name || '',
    role: p.professionalTitle,
    company: p.organization || '',
    location: p.location || '',
    avatar: p.profileImage || p.user?.avatarUrl || '',
    profileImage: p.profileImage || p.user?.avatarUrl || '',
    headline: p.introduction || '',
    bio: p.biography || p.introduction || '',
    category: p.category || '',
    skills: p.skills.map((s) => s.skillName),
    experienceYears: p.experienceYears ?? 0,
    contentCount: 0,
  }));

  return {
    creators,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

/**
 * Dedicated database-backed search across creator credentials, name, organization, biography, and skills
 */
export const searchCreators = async ({ query, skill, expertise }) => {
  const trimmedQuery = typeof query === 'string' ? query.trim() : '';
  const trimmedSkill = typeof skill === 'string' ? skill.trim() : '';
  const trimmedExpertise = typeof expertise === 'string' ? expertise.trim() : '';

  const whereConditions = [];

  // Query across name, professional title, organization, biography, introduction, and skills
  if (trimmedQuery) {
    whereConditions.push({
      OR: [
        {
          user: {
            name: {
              contains: trimmedQuery,
              mode: 'insensitive',
            },
          },
        },
        {
          professionalTitle: {
            contains: trimmedQuery,
            mode: 'insensitive',
          },
        },
        {
          organization: {
            contains: trimmedQuery,
            mode: 'insensitive',
          },
        },
        {
          biography: {
            contains: trimmedQuery,
            mode: 'insensitive',
          },
        },
        {
          introduction: {
            contains: trimmedQuery,
            mode: 'insensitive',
          },
        },
        {
          skills: {
            some: {
              skillName: {
                contains: trimmedQuery,
                mode: 'insensitive',
              },
            },
          },
        },
      ],
    });
  }

  // Filter by specific skill
  if (trimmedSkill) {
    whereConditions.push({
      skills: {
        some: {
          skillName: {
            contains: trimmedSkill,
            mode: 'insensitive',
          },
        },
      },
    });
  }

  // Filter by category / domain expertise
  if (trimmedExpertise && trimmedExpertise.toLowerCase() !== 'all') {
    whereConditions.push({
      category: {
        equals: trimmedExpertise,
        mode: 'insensitive',
      },
    });
  }

  const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

  const profiles = await prisma.creatorProfile.findMany({
    where,
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      professionalTitle: true,
      organization: true,
      location: true,
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
        select: {
          skillName: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  const results = profiles.map((p) => ({
    id: p.id,
    name: p.user?.name || '',
    role: p.professionalTitle,
    company: p.organization || '',
    location: p.location || '',
    avatar: p.profileImage || p.user?.avatarUrl || '',
    profileImage: p.profileImage || p.user?.avatarUrl || '',
    category: p.category || '',
    skills: p.skills.map((s) => s.skillName),
    experienceYears: p.experienceYears ?? 0,
  }));

  return {
    results,
    query: trimmedQuery,
    count: results.length,
  };
};

/**
 * Fetch detailed creator profile by unique ID (Profile ID or User ID)
 */
export const fetchCreatorById = async (id) => {
  if (!isValidUUID(id)) {
    return null;
  }

  const trimmedId = id.trim();

  const profile = await prisma.creatorProfile.findFirst({
    where: {
      OR: [
        { id: trimmedId },
        { userId: trimmedId },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          createdAt: true,
        },
      },
      skills: {
        orderBy: { createdAt: 'asc' },
      },
      achievements: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!profile) {
    return null;
  }

  const socialLinksObj = profile.socialLinks && typeof profile.socialLinks === 'object'
    ? profile.socialLinks
    : {};

  const expertiseAreas = Array.isArray(socialLinksObj.expertiseAreas)
    ? socialLinksObj.expertiseAreas
    : [];

  const experienceHistory = Array.isArray(socialLinksObj.experienceHistory)
    ? socialLinksObj.experienceHistory
    : [];

  const detailedBio = profile.biography
    ? profile.biography.split('\n\n')
    : (profile.introduction ? [profile.introduction] : []);

  return {
    id: profile.id,
    userId: profile.userId,
    name: profile.user?.name || '',
    email: profile.user?.email || '',
    role: profile.professionalTitle,
    professionalTitle: profile.professionalTitle,
    company: profile.organization || '',
    organization: profile.organization || '',
    location: profile.location || '',
    avatar: profile.profileImage || profile.user?.avatarUrl || '',
    profileImage: profile.profileImage || profile.user?.avatarUrl || '',
    headline: profile.introduction || '',
    introduction: profile.introduction || '',
    bio: profile.biography || profile.introduction || '',
    biography: profile.biography || profile.introduction || '',
    detailedBio,
    category: profile.category || '',
    experienceYears: profile.experienceYears ?? 0,
    expertiseAreas,
    experienceHistory,
    socialLinks: {
      github: socialLinksObj.github || '',
      linkedin: socialLinksObj.linkedin || '',
      twitter: socialLinksObj.twitter || '',
      website: socialLinksObj.website || '',
    },
    skills: profile.skills.map((s) => s.skillName),
    achievements: profile.achievements.map((a) => ({
      id: a.id,
      title: a.title,
      issuer: a.issuingOrganization || '',
      issuingOrganization: a.issuingOrganization || '',
      achievementType: a.achievementType,
      year: a.year || '',
      description: a.description || '',
    })),
    contentCount: 0,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
};

/**
 * Fetch educational resources and content associated with a creator.
 * Temporary note: Anvesha Patel's Content module is slated for subsequent integration;
 * currently returns a consistent empty content list for existing creators and null (404) for nonexistent IDs.
 */
export const fetchCreatorContent = async (creatorId) => {
  if (!isValidUUID(creatorId)) {
    return null;
  }

  const trimmedId = creatorId.trim();

  const profile = await prisma.creatorProfile.findFirst({
    where: {
      OR: [
        { id: trimmedId },
        { userId: trimmedId },
      ],
    },
    select: {
      id: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!profile) {
    return null;
  }

  return {
    creatorId: profile.id,
    creatorName: profile.user?.name || '',
    content: [],
    count: 0,
  };
};
