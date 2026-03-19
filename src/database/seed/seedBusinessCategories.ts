import { DEFAULT_BUSINESS_CATEGORY_SEEDS } from "@/features/auth/businessCategory/data/defaultBusinessCategories";
import type { BusinessCategoryModel } from "@/features/auth/businessCategory/data/dataSource/businessCategory.model";
import type { Database } from "@nozbe/watermelondb";

export async function seedBusinessCategories(database: Database): Promise<void> {
  const collection = database.get<BusinessCategoryModel>("business_categories");
  const existingRecords = await collection.query().fetch();
  const existingBySlug = new Map<string, BusinessCategoryModel>();
  const defaultSlugs = new Set(
    DEFAULT_BUSINESS_CATEGORY_SEEDS.map((seed) => seed.slug),
  );

  for (const record of existingRecords) {
    if (record.slug) {
      existingBySlug.set(record.slug, record);
    }
  }

  const timestamp = Date.now();

  await database.write(async () => {
    for (const item of DEFAULT_BUSINESS_CATEGORY_SEEDS) {
      const existingRecord = existingBySlug.get(item.slug) ?? null;

      if (!existingRecord) {
        await collection.create((record: BusinessCategoryModel) => {
          record.name = item.name;
          record.parentId = item.parentSlug ?? null;
          record.slug = item.slug;
          record.isActive = true;
          record.sortOrder = item.sortOrder;
          record.createdAt = timestamp;
          record.updatedAt = timestamp;
        });
        continue;
      }

      const shouldUpdate =
        existingRecord.name !== item.name ||
        (existingRecord.parentId ?? null) !== (item.parentSlug ?? null) ||
        existingRecord.isActive !== true ||
        (existingRecord.sortOrder ?? 0) !== item.sortOrder;

      if (!shouldUpdate) {
        continue;
      }

      await existingRecord.update((record: BusinessCategoryModel) => {
        record.name = item.name;
        record.parentId = item.parentSlug ?? null;
        record.isActive = true;
        record.sortOrder = item.sortOrder;
        record.updatedAt = timestamp;
      });
    }

    for (const existingRecord of existingRecords) {
      if (!existingRecord.slug || defaultSlugs.has(existingRecord.slug)) {
        continue;
      }

      if (existingRecord.isActive === false) {
        continue;
      }

      await existingRecord.update((record: BusinessCategoryModel) => {
        record.isActive = false;
        record.updatedAt = timestamp;
      });
    }
  });
}
