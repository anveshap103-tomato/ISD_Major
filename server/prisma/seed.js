import crypto from 'node:crypto';
import prisma from '../src/config/db.js';

// Realistic seed data matching client/src/features/creators/data/mockCreators.js
const CREATORS_SEED_DATA = [
  {
    email: 'aarav.sharma@example.com',
    name: 'Aarav Sharma',
    role: 'Staff Cloud Architect',
    company: 'Google Cloud',
    location: 'Bengaluru, India',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    headline: 'Architecting planetary-scale distributed cloud systems & mentoring future platform engineers.',
    bio: 'Specializing in planetary-scale distributed systems and Kubernetes infrastructure. Passionate about mentoring aspiring platform engineers.',
    detailedBio: [
      'Aarav is a Staff Cloud Architect at Google Cloud, where he designs and reviews mission-critical multi-region Kubernetes deployments for global enterprises. Over the past 9 years, he has led technical transformations across fintech, telecom, and distributed computing.',
      'He is a frequent keynote speaker at KubeCon and Cloud Native Days, an active contributor to the CNCF ecosystem, and a passionate technical mentor who has guided over 150 early-career engineers into cloud infrastructure roles.',
      'When not optimizing cluster topologies, Aarav writes deep-dive technical essays on failure-mode analysis, consensus algorithms, and zero-downtime infrastructure migrations.'
    ],
    category: 'Cloud & DevOps',
    skills: ['Kubernetes', 'GCP', 'Terraform', 'Go', 'Distributed Systems', 'Service Mesh', 'CI/CD Pipelines'],
    expertiseAreas: [
      'Multi-Region Cloud Topology',
      'Kubernetes Infrastructure & Operators',
      'Site Reliability & Chaos Engineering',
      'Zero-Downtime Database Migrations'
    ],
    experienceYears: 9,
    achievements: [
      {
        title: 'CNCF Community Ambassador',
        issuer: 'Cloud Native Computing Foundation',
        year: '2025',
        achievementType: 'HONOR',
        description: 'Recognized for pioneering open-source cloud native workshops across South Asia.'
      },
      {
        title: 'Google Cloud Certified Fellow',
        issuer: 'Google Cloud',
        year: '2024',
        achievementType: 'CERTIFICATION',
        description: 'Elite technical credential for hybrid cloud architecture and operational resilience.'
      },
      {
        title: 'Author of "Scaling Cloud Native Systems"',
        issuer: 'O’Reilly Media',
        year: '2023',
        achievementType: 'PUBLICATION',
        description: 'Technical handbook downloaded by 40,000+ platform engineers globally.'
      }
    ],
    experienceHistory: [
      {
        role: 'Staff Cloud Architect',
        company: 'Google Cloud',
        period: '2022 — Present',
        description: 'Leading strategic architectural design for tier-1 hybrid cloud customers, focusing on multi-cloud resilience and container orchestration.'
      },
      {
        role: 'Senior Infrastructure Engineer',
        company: 'Flipkart',
        period: '2018 — 2022',
        description: 'Scaled internal Kubernetes platform to handle 10x traffic during flagship festive sales events with 99.995% availability.'
      },
      {
        role: 'Systems Engineer',
        company: 'Red Hat',
        period: '2015 — 2018',
        description: 'Contributed upstream patches to Linux kernel cgroups and early OpenShift container tools.'
      }
    ],
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://aaravsharma.dev'
    }
  },
  {
    email: 'priya.nambiar@example.com',
    name: 'Dr. Priya Nambiar',
    role: 'Principal AI Research Scientist',
    company: 'DeepMind',
    location: 'London, United Kingdom',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    headline: 'Advancing multimodal reasoning, foundation models, and verifiable AI safety paradigms.',
    bio: 'Working on LLM reasoning and multimodal foundation models. Writer and speaker on AI safety and future tech paradigms.',
    detailedBio: [
      'Dr. Priya Nambiar is a Principal AI Research Scientist at DeepMind focusing on chain-of-thought verification, neuro-symbolic reasoning, and interpretability in large multimodal foundation models.',
      'Holding a Ph.D. in Computer Science from the University of Oxford, she has published over 25 papers in top-tier conferences including NeurIPS, ICML, and ICLR. Her work bridges the frontier between theoretical machine learning and verifiable alignment.',
      'Priya regularly consults on international ethical AI frameworks and mentors doctoral and postgraduate students navigating careers in applied artificial intelligence.'
    ],
    category: 'AI & Machine Learning',
    skills: ['PyTorch', 'LLMs', 'Transformer Models', 'Python', 'MLOps', 'Neuro-symbolic AI', 'Reinforcement Learning'],
    expertiseAreas: [
      'Multimodal Foundation Architectures',
      'Chain-of-Thought Reasoning & Verification',
      'AI Alignment & Safety Frameworks',
      'Large-Scale Distributed Pretraining'
    ],
    experienceYears: 11,
    achievements: [
      {
        title: 'NeurIPS Outstanding Paper Award',
        issuer: 'Neural Information Processing Systems',
        year: '2024',
        achievementType: 'AWARD',
        description: 'Recognized for novel work on mechanistic interpretability in dense transformer blocks.'
      },
      {
        title: 'MIT Tech Review 35 Innovators Under 35',
        issuer: 'MIT Technology Review',
        year: '2023',
        achievementType: 'HONOR',
        description: 'Honored in the AI & Robotics category for contributions to verifiable model reasoning.'
      }
    ],
    experienceHistory: [
      {
        role: 'Principal AI Research Scientist',
        company: 'DeepMind',
        period: '2021 — Present',
        description: 'Directing reasoning safety benchmarks and post-training alignment research on next-generation multimodal architectures.'
      },
      {
        role: 'Senior Research Scientist',
        company: 'OpenAI',
        period: '2017 — 2021',
        description: 'Conducted exploratory research into sample-efficient reinforcement learning and transformer attention mechanisms.'
      }
    ],
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://priyanambiar.ai'
    }
  },
  {
    email: 'marcus.vance@example.com',
    name: 'Marcus Vance',
    role: 'Senior Design Systems Lead',
    company: 'Figma',
    location: 'San Francisco, CA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    headline: 'Crafting accessible design systems, design tokens, and frontend component architectures.',
    bio: 'Bridging the divide between product design and modern frontend engineering. Creator of popular accessible UI toolkits.',
    detailedBio: [
      'Marcus Vance is a hybrid design engineering leader who bridges visual craftsmanship with rigorous frontend systems. At Figma, he leads initiatives standardizing design tokens, accessibility primitives, and component interoperability across web and native platforms.',
      'He created and open-sourced "Loom UI", an accessible headless design system library adopted by thousands of developers worldwide. He writes frequently on the convergence of code, accessibility (WCAG AAA), and design tokens.',
      'Marcus is deeply committed to mentoring designers who want to learn TypeScript and frontend engineers looking to sharpen their visual and interaction design sensibilities.'
    ],
    category: 'Frontend & Design',
    skills: ['UI/UX', 'Design Systems', 'React', 'Tailwind CSS', 'TypeScript', 'Accessibility (WCAG)', 'Figma Tokens'],
    expertiseAreas: [
      'Design Token Orchestration',
      'Accessible Headless Components',
      'Design-Engineering Workflow Bridges',
      'Micro-Interactions & Motion Design'
    ],
    experienceYears: 7,
    achievements: [
      {
        title: 'Design Systems Pioneer Award',
        issuer: 'Design System Leaders Guild',
        year: '2025',
        achievementType: 'AWARD',
        description: 'Recognized for pioneering multi-brand design token synchronization in Figma.'
      },
      {
        title: 'Awwwards Site of the Year Nominee',
        issuer: 'Awwwards International',
        year: '2023',
        achievementType: 'HONOR',
        description: 'Nominated for exceptional typography and interaction performance on Loom UI documentation.'
      }
    ],
    experienceHistory: [
      {
        role: 'Senior Design Systems Lead',
        company: 'Figma',
        period: '2022 — Present',
        description: 'Spearheading design token standards, component parity between design files and React code, and enterprise accessibility guidelines.'
      },
      {
        role: 'Lead Frontend Designer',
        company: 'Stripe',
        period: '2019 — 2022',
        description: 'Built interactive dashboard components and documentation sites supporting millions of merchant interactions daily.'
      }
    ],
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://marcusvance.design'
    }
  },
  {
    email: 'neha.kapoor@example.com',
    name: 'Neha Kapoor',
    role: 'Lead Security Engineer',
    company: 'Cloudflare',
    location: 'Austin, TX',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    headline: 'Hardening global edge networks against zero-day exploits with zero-trust architectures.',
    bio: 'Defending mission-critical web applications against zero-day threats. Advocate for defensive zero-trust architectures.',
    detailedBio: [
      'Neha Kapoor is a defensive security specialist and Lead Security Engineer at Cloudflare. She oversees threat modeling, edge security mitigations, and protocol-level cryptography across global point-of-presence datacenters.',
      'She is an active speaker at Black Hat and DEF CON, focusing on WebAssembly sandboxing, post-quantum cryptography migrations, and preventing sophisticated supply chain vulnerabilities in modern CI/CD pipelines.',
      'Neha mentors women in cybersecurity through collegiate capture-the-flag competitions and provides tactical career advice on navigating offensive and defensive security disciplines.'
    ],
    category: 'Cybersecurity',
    skills: ['Zero Trust', 'AppSec', 'Penetration Testing', 'Cryptography', 'Rust', 'Wasm Security', 'Threat Modeling'],
    expertiseAreas: [
      'Edge Threat Mitigation & DDoS Defense',
      'Zero-Trust Network Access (ZTNA)',
      'Memory-Safe Systems in Rust',
      'Post-Quantum Cryptographic Readiness'
    ],
    experienceYears: 8,
    achievements: [
      {
        title: 'Black Hat Keynote Presenter',
        issuer: 'Black Hat USA',
        year: '2024',
        achievementType: 'HONOR',
        description: 'Presented novel research on memory-safe isolation at the HTTP edge.'
      },
      {
        title: 'Top 50 Women in Cybersecurity',
        issuer: 'CyberScoop',
        year: '2023',
        achievementType: 'AWARD',
        description: 'Honored for defending global public internet infrastructure against automated botnets.'
      }
    ],
    experienceHistory: [
      {
        role: 'Lead Security Engineer',
        company: 'Cloudflare',
        period: '2021 — Present',
        description: 'Architecting zero-trust authorization systems and real-time edge security rules intercepting billions of daily malicious requests.'
      },
      {
        role: 'Security Consultant',
        company: 'NCC Group',
        period: '2017 — 2021',
        description: 'Performed red team engagements, web application penetration tests, and cryptographic audits for Fortune 100 clients.'
      }
    ],
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://nehakapoor.sec'
    }
  },
  {
    email: 'vikram.sengupta@example.com',
    name: 'Vikram Sengupta',
    role: 'Backend Engineering Manager',
    company: 'Stripe',
    location: 'Seattle, WA',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    headline: 'Building ultra-reliable payment ledgers, event-driven backends, and distributed data pipelines.',
    bio: 'Architecting ultra-reliable payments systems with 99.999% uptime. Enthusiast of event-driven architectures and PostgreSQL tuning.',
    detailedBio: [
      'Vikram Sengupta leads the core ledger backend engineering teams at Stripe. His organization is responsible for double-entry financial ledger integrity, transactional consistency across geo-distributed databases, and idempotent webhook distribution.',
      'With over a decade of deep systems experience, Vikram has engineered platforms processing hundreds of billions in transaction volume. He is a passionate advocate of pragmatic engineering, write-ahead logs, and database schema evolution.',
      'He frequently mentors engineers transitioning from individual contributor roles to engineering management and backend system design leaders.'
    ],
    category: 'Backend & Systems',
    skills: ['PostgreSQL', 'Node.js', 'Kafka', 'System Design', 'Redis', 'Distributed Transactions', 'Go'],
    expertiseAreas: [
      'Idempotent Event-Driven Systems',
      'High-Throughput Financial Ledgers',
      'PostgreSQL Query Optimization & Partitioning',
      'Engineering Management & Team Scaling'
    ],
    experienceYears: 10,
    achievements: [
      {
        title: 'High-Availability Architect Award',
        issuer: 'Fintech Engineering Summit',
        year: '2024',
        achievementType: 'AWARD',
        description: 'Recognized for achieving 99.999% availability on mission-critical payments infrastructure.'
      }
    ],
    experienceHistory: [
      {
        role: 'Backend Engineering Manager',
        company: 'Stripe',
        period: '2021 — Present',
        description: 'Managing a team of 14 distributed systems engineers responsible for core ledger services and transaction idempotency.'
      },
      {
        role: 'Staff Software Engineer',
        company: 'Uber',
        period: '2016 — 2021',
        description: 'Engineered real-time trip pricing engines and geospatial dispatch systems.'
      }
    ],
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://vikramsengupta.com'
    }
  },
  {
    email: 'elena.rostova@example.com',
    name: 'Elena Rostova',
    role: 'VP of Product',
    company: 'Notion',
    location: 'New York, NY',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    headline: 'Scaling collaborative knowledge products from 0 to 1 with user psychology and PLG.',
    bio: 'Helping product builders scale from 0 to 1 and beyond. Focused on product-led growth and user psychology.',
    detailedBio: [
      'Elena Rostova is Vice President of Product at Notion, steering product-led growth, enterprise workspaces, and collaborative authoring experiences. She has spent 12 years at the intersection of consumer software, product psychology, and viral enterprise loops.',
      'Prior to Notion, Elena helped scale core workspace features at Slack and Dropbox. She writes extensively on the mechanics of bottoms-up software adoption, user onboarding friction, and modern product roadmaps.',
      'Elena mentors aspiring product managers, founders, and career-switchers on developing sharp product taste and quantitative user intuition.'
    ],
    category: 'Product & Tech Leadership',
    skills: ['Product Strategy', 'PLG', 'Agile Leadership', 'User Research', 'Analytics', 'Growth Loops', 'Roadmap Design'],
    expertiseAreas: [
      'Product-Led Growth (PLG) Mechanics',
      'Collaborative Document UX & Workspaces',
      'Behavioral User Psychology & Onboarding',
      'Product Strategy & Organizational Scaling'
    ],
    experienceYears: 12,
    achievements: [
      {
        title: 'Product Leader of the Year',
        issuer: 'Product Management Festival',
        year: '2024',
        achievementType: 'AWARD',
        description: 'Awarded for leading breakthrough collaborative features reaching tens of millions of knowledge workers.'
      }
    ],
    experienceHistory: [
      {
        role: 'VP of Product',
        company: 'Notion',
        period: '2022 — Present',
        description: 'Leading global product teams across collaborative authoring, templates ecosystem, and enterprise growth loops.'
      },
      {
        role: 'Group Product Manager',
        company: 'Slack',
        period: '2017 — 2022',
        description: 'Directed workspace search, channels discovery, and cross-organization shared channels (Slack Connect).'
      }
    ],
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://elenarostova.co'
    }
  },
  {
    email: 'rohan.mehra@example.com',
    name: 'Rohan Mehra',
    role: 'Senior Full Stack Developer',
    company: 'Vercel',
    location: 'Toronto, Canada',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    headline: 'Pioneering edge runtime web apps, Next.js server components, and developer experience.',
    bio: 'Obsessed with developer experience, web performance, and edge computing. Active open source contributor and tech educator.',
    detailedBio: [
      'Rohan Mehra is a Senior Full Stack Developer at Vercel where he contributes to the Next.js runtime, edge compute primitives, and developer tooling. He is deeply committed to rendering speed, streaming SSR, and simplifying modern web deployment workflows.',
      'With over 6 years of focused full-stack development, Rohan has published tutorials read by hundreds of thousands of developers. He frequently collaborates with open-source communities to benchmark web performance and bundle optimization.',
      'Rohan mentors self-taught developers and computer science graduates seeking their first full-stack software engineering roles.'
    ],
    category: 'Frontend & Design',
    skills: ['Next.js', 'React', 'TypeScript', 'Serverless', 'GraphQL', 'Tailwind CSS', 'Node.js'],
    expertiseAreas: [
      'React Server Components & Streaming SSR',
      'Edge Middleware & Global Caching',
      'Web Performance & Core Web Vitals',
      'Full-Stack TypeScript Architecture'
    ],
    experienceYears: 6,
    achievements: [
      {
        title: 'Open Source Contributor of the Year',
        issuer: 'Next.js Global Community',
        year: '2024',
        achievementType: 'AWARD',
        description: 'Recognized for performance improvements and documentation in Next.js app directory.'
      }
    ],
    experienceHistory: [
      {
        role: 'Senior Full Stack Developer',
        company: 'Vercel',
        period: '2022 — Present',
        description: 'Building developer-facing edge infrastructure, streaming rendering tools, and starter templates.'
      },
      {
        role: 'Frontend Engineer',
        company: 'Shopify',
        period: '2019 — 2022',
        description: 'Engineered storefront rendering pipelines and high-speed checkout interfaces.'
      }
    ],
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://rohanmehra.dev'
    }
  },
  {
    email: 'kavita.sundaram@example.com',
    name: 'Kavita Sundaram',
    role: 'Staff ML Engineer',
    company: 'Meta AI',
    location: 'Menlo Park, CA',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    headline: 'Designing graph neural networks, large-scale recommendation systems, and real-time data pipelines.',
    bio: 'Building real-time recommendation engines and graph neural networks. Helping university students transition into applied machine learning.',
    detailedBio: [
      'Kavita Sundaram is a Staff Machine Learning Engineer at Meta AI working on large-scale recommendation systems, graph representation learning, and real-time retrieval ranking. Her algorithms process multi-billion-node graph embeddings serving billions of daily active users.',
      'She has co-authored multiple papers on efficient graph neural networks and negative sampling strategies at KDD and RecSys. Kavita holds a Master of Science in Computer Science from Carnegie Mellon University.',
      'She is passionate about democratizing machine learning education and runs mentorship programs helping university students transition into applied AI roles in industry.'
    ],
    category: 'AI & Machine Learning',
    skills: ['Recommendation Systems', 'GNN', 'PyTorch', 'C++', 'Data Pipelines', 'Embedding Search', 'Feature Stores'],
    expertiseAreas: [
      'Graph Representation Learning (GNN)',
      'Sub-millisecond Vector Similarity Search',
      'Real-Time Recommendation Engines',
      'Scalable Feature Store Architecture'
    ],
    experienceYears: 8,
    achievements: [
      {
        title: 'ACM RecSys Best Research Paper',
        issuer: 'ACM RecSys Conference',
        year: '2024',
        achievementType: 'AWARD',
        description: 'Awarded for pioneering work on low-latency candidate generation using graph embeddings.'
      }
    ],
    experienceHistory: [
      {
        role: 'Staff ML Engineer',
        company: 'Meta AI',
        period: '2021 — Present',
        description: 'Architecting graph embedding pipelines and low-latency inference systems powering discovery feeds.'
      },
      {
        role: 'Senior Machine Learning Engineer',
        company: 'Pinterest',
        period: '2017 — 2021',
        description: 'Engineered visual search retrieval systems and collaborative filtering models.'
      }
    ],
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://kavitasundaram.ai'
    }
  }
];

async function seed() {
  console.log('🌱 Starting Creator Discovery database seed...');

  // Standard hashed password for test accounts
  const defaultPasswordHash = crypto.createHash('sha256').update('RythCoreDemo2026!').digest('hex');

  let seededUsersCount = 0;
  let seededProfilesCount = 0;
  let seededSkillsCount = 0;
  let seededAchievementsCount = 0;

  for (const creator of CREATORS_SEED_DATA) {
    // 1. Idempotently upsert User record
    const user = await prisma.user.upsert({
      where: { email: creator.email },
      update: {
        name: creator.name,
        avatarUrl: creator.avatar
      },
      create: {
        email: creator.email,
        name: creator.name,
        avatarUrl: creator.avatar,
        passwordHash: defaultPasswordHash
      }
    });
    seededUsersCount++;

    // Prepare rich social links and metadata payload
    const socialLinksPayload = {
      ...creator.socialLinks,
      expertiseAreas: creator.expertiseAreas,
      experienceHistory: creator.experienceHistory
    };

    const biographyText = Array.isArray(creator.detailedBio)
      ? creator.detailedBio.join('\n\n')
      : creator.bio;

    // 2. Idempotently upsert CreatorProfile record linked to User
    const profile = await prisma.creatorProfile.upsert({
      where: { userId: user.id },
      update: {
        professionalTitle: creator.role,
        organization: creator.company,
        location: creator.location,
        introduction: creator.headline || creator.bio,
        biography: biographyText,
        profileImage: creator.avatar,
        socialLinks: socialLinksPayload,
        category: creator.category,
        experienceYears: creator.experienceYears
      },
      create: {
        userId: user.id,
        professionalTitle: creator.role,
        organization: creator.company,
        location: creator.location,
        introduction: creator.headline || creator.bio,
        biography: biographyText,
        profileImage: creator.avatar,
        socialLinks: socialLinksPayload,
        category: creator.category,
        experienceYears: creator.experienceYears
      }
    });
    seededProfilesCount++;

    // 3. Idempotently replace skills for this profile
    await prisma.creatorSkill.deleteMany({
      where: { creatorProfileId: profile.id }
    });

    if (creator.skills && creator.skills.length > 0) {
      await prisma.creatorSkill.createMany({
        data: creator.skills.map((skillName) => ({
          creatorProfileId: profile.id,
          skillName
        }))
      });
      seededSkillsCount += creator.skills.length;
    }

    // 4. Idempotently replace achievements for this profile
    await prisma.creatorAchievement.deleteMany({
      where: { creatorProfileId: profile.id }
    });

    if (creator.achievements && creator.achievements.length > 0) {
      await prisma.creatorAchievement.createMany({
        data: creator.achievements.map((ach) => ({
          creatorProfileId: profile.id,
          title: ach.title,
          issuingOrganization: ach.issuer,
          achievementType: ach.achievementType || 'AWARD',
          year: ach.year ? String(ach.year) : null,
          description: ach.description || null
        }))
      });
      seededAchievementsCount += creator.achievements.length;
    }

    console.log(`  ✓ Seeded creator: ${creator.name} (${creator.role} at ${creator.company})`);
  }

  console.log('\n✅ Database seeding completed successfully:');
  console.log(`   - Users upserted: ${seededUsersCount}`);
  console.log(`   - Creator profiles upserted: ${seededProfilesCount}`);
  console.log(`   - Creator skills seeded: ${seededSkillsCount}`);
  console.log(`   - Creator achievements seeded: ${seededAchievementsCount}`);
}

seed()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

