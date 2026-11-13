import prisma from '../../config/db.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isValidUuid = (value) => typeof value === 'string' && UUID_PATTERN.test(value.trim());

const createError = (message, statusCode, code) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
};

const badRequest = (message) => createError(message, 400, 'BAD_REQUEST');

const serializeContent = ({ category, ...item }) => ({
  ...item,
  type: item.type.toLowerCase(),
  category: category.name,
  categorySlug: category.slug,
});

const bookmarkContentInclude = {
  content: {
    include: { category: { select: { name: true, slug: true } } },
  },
};

const serializeBookmark = ({ content, ...bookmark }) => ({
  ...bookmark,
  content: serializeContent(content),
});

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
  if (!isValidUuid(id)) {
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

  return serializeContent(content);
};

export const fetchCategories = async () => {
  const items = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true },
  });
  return { items };
};

export const createBookmark = async (userId, contentId) => {
  if (!isValidUuid(userId)) {
    throw badRequest('Invalid user ID: must be a valid UUID');
  }
  if (!isValidUuid(contentId)) {
    throw badRequest('Invalid content ID: must be a valid UUID');
  }

  const normalizedUserId = userId.trim();
  const normalizedContentId = contentId.trim();
  const contentExists = await prisma.content.findUnique({
    where: { id: normalizedContentId },
    select: { id: true },
  });
  if (!contentExists) {
    throw createError('Content not found', 404, 'CONTENT_NOT_FOUND');
  }

  try {
    const bookmark = await prisma.bookmark.create({
      data: { userId: normalizedUserId, contentId: normalizedContentId },
      include: bookmarkContentInclude,
    });
    return serializeBookmark(bookmark);
  } catch (error) {
    if (error.code === 'P2002') {
      throw createError('Content is already bookmarked', 409, 'BOOKMARK_ALREADY_EXISTS');
    }
    if (error.code === 'P2003') {
      throw createError('Content not found', 404, 'CONTENT_NOT_FOUND');
    }
    throw error;
  }
};

export const fetchBookmarksByUser = async (userId) => {
  if (!isValidUuid(userId)) {
    throw badRequest('Invalid user ID: must be a valid UUID');
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: userId.trim() },
    include: bookmarkContentInclude,
    orderBy: { createdAt: 'desc' },
  });
  return { items: bookmarks.map(serializeBookmark) };
};

export const deleteBookmark = async (userId, contentId) => {
  if (!isValidUuid(userId)) {
    throw badRequest('Invalid user ID: must be a valid UUID');
  }
  if (!isValidUuid(contentId)) {
    throw badRequest('Invalid content ID: must be a valid UUID');
  }

  const normalizedContentId = contentId.trim();
  const result = await prisma.bookmark.deleteMany({
    where: { userId: userId.trim(), contentId: normalizedContentId },
  });

  if (result.count === 0) {
    throw createError('Bookmark not found', 404, 'BOOKMARK_NOT_FOUND');
  }

  return { contentId: normalizedContentId };
};
