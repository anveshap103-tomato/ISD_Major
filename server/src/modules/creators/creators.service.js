// Creator Service Layer — Ryth Core
// Business logic separate from controllers; database-backed listing via Prisma 7
import prisma from '../../config/db.js';

const MOCK_CREATORS = [
  {
    id: 'creator-1',
    name: 'Aarav Sharma',
    role: 'Staff Cloud Architect',
    company: 'Google Cloud',
    location: 'Bengaluru, India',
    headline: 'Architecting planetary-scale distributed cloud systems & mentoring platform engineers.',
    bio: 'Specializing in planetary-scale distributed systems and Kubernetes infrastructure. Passionate about mentoring aspiring platform engineers.',
    category: 'Cloud & DevOps',
    skills: ['Kubernetes', 'GCP', 'Terraform', 'Go', 'Distributed Systems'],
    experienceYears: 9,
    contentCount: 4,
  },
  {
    id: 'creator-2',
    name: 'Dr. Priya Nambiar',
    role: 'Principal AI Research Scientist',
    company: 'DeepMind',
    location: 'London, United Kingdom',
    headline: 'Advancing multimodal reasoning, foundation models, and verifiable AI safety paradigms.',
    bio: 'Working on LLM reasoning and multimodal foundation models. Writer and speaker on AI safety and future tech paradigms.',
    category: 'AI & Machine Learning',
    skills: ['PyTorch', 'LLMs', 'Transformer Models', 'Python', 'MLOps'],
    experienceYears: 11,
    contentCount: 6,
  },
  {
    id: 'creator-3',
    name: 'Marcus Vance',
    role: 'Senior Design Systems Lead',
    company: 'Figma',
    location: 'San Francisco, CA',
    headline: 'Crafting accessible design systems, design tokens, and frontend component architectures.',
    bio: 'Bridging the divide between product design and modern frontend engineering. Creator of popular accessible UI toolkits.',
    category: 'Frontend & Design',
    skills: ['UI/UX', 'Design Systems', 'React', 'Tailwind CSS', 'TypeScript'],
    experienceYears: 7,
    contentCount: 5,
  },
  {
    id: 'creator-4',
    name: 'Neha Kapoor',
    role: 'Lead Security Engineer',
    company: 'Cloudflare',
    location: 'Austin, TX',
    headline: 'Hardening global edge networks against zero-day exploits with zero-trust architectures.',
    bio: 'Defending mission-critical web applications against zero-day threats. Advocate for defensive zero-trust architectures.',
    category: 'Cybersecurity',
    skills: ['Zero Trust', 'AppSec', 'Penetration Testing', 'Cryptography', 'Rust'],
    experienceYears: 8,
    contentCount: 3,
  },
  {
    id: 'creator-5',
    name: 'Vikram Sengupta',
    role: 'Backend Engineering Manager',
    company: 'Stripe',
    location: 'Seattle, WA',
    headline: 'Building ultra-reliable payment ledgers, event-driven backends, and distributed data pipelines.',
    bio: 'Architecting ultra-reliable payments systems with 99.999% uptime. Enthusiast of event-driven architectures and PostgreSQL tuning.',
    category: 'Backend & Systems',
    skills: ['PostgreSQL', 'Node.js', 'Kafka', 'System Design', 'Redis'],
    experienceYears: 10,
    contentCount: 5,
  },
  {
    id: 'creator-6',
    name: 'Elena Rostova',
    role: 'VP of Product',
    company: 'Notion',
    location: 'New York, NY',
    headline: 'Scaling collaborative knowledge products from 0 to 1 with user psychology and PLG.',
    bio: 'Helping product builders scale from 0 to 1 and beyond. Focused on product-led growth and user psychology.',
    category: 'Product & Tech Leadership',
    skills: ['Product Strategy', 'PLG', 'Agile Leadership', 'User Research', 'Analytics'],
    experienceYears: 12,
    contentCount: 7,
  },
];

const MOCK_CREATOR_CONTENT = {
  'creator-1': [
    {
      id: 'content-101',
      title: 'Designing Zero-Downtime Multi-Region Kubernetes Architectures',
      type: 'article',
      url: 'https://example.com/k8s-multi-region',
      publishedAt: '2026-10-15',
    },
    {
      id: 'content-102',
      title: 'Consensus Protocols Explained: Raft vs Paxos in Practice',
      type: 'video',
      url: 'https://example.com/consensus-protocols',
      publishedAt: '2026-10-28',
    },
  ],
  'creator-2': [
    {
      id: 'content-201',
      title: 'Mechanistic Interpretability in Dense Multimodal Transformers',
      type: 'article',
      url: 'https://example.com/interpretability-transformers',
      publishedAt: '2026-10-10',
    },
  ],
};

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
 * Dedicated search across creator credentials, name, and skills
 */
export const searchCreators = async ({ query, skill, expertise }) => {
  const q = (query || '').toLowerCase().trim();

  let results = MOCK_CREATORS.filter((c) => {
    const matchesQuery =
      q === '' ||
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q));

    const matchesSkill =
      !skill || c.skills.some((s) => s.toLowerCase() === skill.toLowerCase());

    const matchesExpertise =
      !expertise || c.category.toLowerCase() === expertise.toLowerCase();

    return matchesQuery && matchesSkill && matchesExpertise;
  });

  return {
    results,
    query: q,
    count: results.length,
  };
};

/**
 * Fetch detailed creator profile by ID
 */
export const fetchCreatorById = async (id) => {
  const creator = MOCK_CREATORS.find((c) => c.id === id);
  return creator || null;
};

/**
 * Fetch educational resources and content associated with a creator
 */
export const fetchCreatorContent = async (creatorId) => {
  const creator = MOCK_CREATORS.find((c) => c.id === creatorId);
  if (!creator) return null;

  const content = MOCK_CREATOR_CONTENT[creatorId] || [];
  return {
    creatorId,
    creatorName: creator.name,
    content,
    count: content.length,
  };
};

