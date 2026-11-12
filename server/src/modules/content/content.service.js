import prisma from '../../config/db.js';

const notImplemented = (operation) => {
  const error = new Error(`${operation} will be implemented in the next phase`);
  error.statusCode = 501;
  error.code = 'NOT_IMPLEMENTED';
  return error;
};

const badRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = 'BAD_REQUEST';
  return error;
};

const parsePositiveInteger = (value, fallback, name) => {
  if (value === undefined || value === null || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw badRequest(`Invalid ${name} parameter: must be a positive integer`);
  }
  return parsed;
};

// Fetch a page of content, optionally filtered by type, category, and search text.
export const fetchContent = async ({ type, category, search, page, limit } = {}) => {
  const pageNum = parsePositiveInteger(page, 1, 'page');
  const limitNum = parsePositiveInteger(limit, 10, 'limit');
  if (limitNum > 50) {
    throw badRequest('Invalid limit parameter: maximum is 50');
  }

  const where = {};
  const normalizedType = typeof type === 'string' ? type.trim().toUpperCase() : '';
  if (normalizedType) {
    if (!['ARTICLE', 'VIDEO', 'BOOK'].includes(normalizedType)) {
      throw badRequest('Invalid type parameter: expected article, video, or book');
    }
    where.type = normalizedType;
  }

  const normalizedCategory = typeof category === 'string' ? category.trim() : '';
  if (normalizedCategory) {
    where.category = {
      OR: [
        { slug: { equals: normalizedCategory, mode: 'insensitive' } },
        { name: { equals: normalizedCategory, mode: 'insensitive' } },
      ],
    };
  }

  const normalizedSearch = typeof search === 'string' ? search.trim() : '';
  if (normalizedSearch) {
    where.OR = [
      { title: { contains: normalizedSearch, mode: 'insensitive' } },
      { description: { contains: normalizedSearch, mode: 'insensitive' } },
      { author: { contains: normalizedSearch, mode: 'insensitive' } },
      { category: { name: { contains: normalizedSearch, mode: 'insensitive' } } },
    ];
  }

  const [items, total] = await prisma.$transaction([
    prisma.content.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    }),
    prisma.content.count({ where }),
  ]);

  return {
    items: items.map(({ category: contentCategory, ...item }) => ({
      ...item,
      type: item.type.toLowerCase(),
      category: contentCategory.name,
      categorySlug: contentCategory.slug,
    })),
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
  };
};

export const fetchContentById = async (id) => {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (typeof id !== 'string' || !uuidPattern.test(id.trim())) {
    throw badRequest('Invalid content ID: must be a valid UUID');
  }

  const content = await prisma.content.findUnique({
    where: { id: id.trim() },
    include: { category: { select: { name: true, slug: true } } },
  });

  if (!content) {
    const error = new Error(`Content with ID '${id.trim()}' not found`);
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  const { category: contentCategory, ...item } = content;
  return {
    ...item,
    type: item.type.toLowerCase(),
    category: contentCategory.name,
    categorySlug: contentCategory.slug,
  };
};

export const fetchCategories = async () => {
  const items = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true },
  });
  return { items };
};

export const createBookmark = async () => {
  throw notImplemented('Bookmark creation');
};

export const fetchBookmarksByUser = async () => {
  throw notImplemented('Bookmark listing');
};

export const deleteBookmark = async () => {
  throw notImplemented('Bookmark deletion');
};
