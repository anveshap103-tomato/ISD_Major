import { readFile } from 'node:fs/promises';

const seedDataUrl = new URL('./content-seed-data.json', import.meta.url);
const CONTENT_TYPES = new Set(['ARTICLE', 'VIDEO', 'BOOK']);

export const seedContent = async (prisma) => {
  const { categories, contents } = JSON.parse(await readFile(seedDataUrl, 'utf8'));
  const categoriesBySlug = new Map();

  for (const category of categories) {
    const savedCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
    categoriesBySlug.set(savedCategory.slug, savedCategory);
  }

  let createdCount = 0;
  let updatedCount = 0;

  for (const item of contents) {
    if (!CONTENT_TYPES.has(item.type)) {
      throw new Error(`Unsupported content type: ${item.type}`);
    }

    const category = categoriesBySlug.get(item.categorySlug);
    if (!category) {
      throw new Error(`Unknown content category slug: ${item.categorySlug}`);
    }

    const { categorySlug, ...contentFields } = item;
    const data = {
      ...contentFields,
      categoryId: category.id,
    };

    // Content URLs are stable seed keys; the schema intentionally has no URL constraint.
    const existingContent = await prisma.content.findFirst({
      where: { url: item.url },
      select: { id: true },
    });

    if (existingContent) {
      await prisma.content.update({
        where: { id: existingContent.id },
        data,
      });
      updatedCount += 1;
    } else {
      await prisma.content.create({ data });
      createdCount += 1;
    }
  }

  console.log(`   - Content categories upserted: ${categories.length}`);
  console.log(`   - Content items created: ${createdCount}`);
  console.log(`   - Content items updated: ${updatedCount}`);
};
