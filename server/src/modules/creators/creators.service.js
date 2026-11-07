// Creator Service Layer — Ryth Core
// Business logic separate from controllers; mock responses without database connection

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
 * Fetch list of creators with optional query filters
 */
export const fetchCreators = async ({ search, category, skill, page = 1, limit = 10 }) => {
  let creators = [...MOCK_CREATORS];

  if (category && category !== 'All') {
    creators = creators.filter(
      (c) => c.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (skill) {
    creators = creators.filter((c) =>
      c.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
    );
  }

  if (search) {
    const q = search.toLowerCase();
    creators = creators.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.bio.toLowerCase().includes(q)
    );
  }

  const startIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const paginatedCreators = creators.slice(startIndex, startIndex + parseInt(limit, 10));

  return {
    creators: paginatedCreators,
    total: creators.length,
    page: parseInt(page, 10),
    totalPages: Math.ceil(creators.length / parseInt(limit, 10)) || 1,
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

