import { Database } from "@nozbe/watermelondb";

type BusinessCategorySeed = {
  name: string;
  parentId?: string;
  slug: string;
  sortOrder: number;
};

const categorySeeds: BusinessCategorySeed[] = [
  { name: "Retail", slug: "retail", sortOrder: 1 },
  { name: "Food", slug: "food", sortOrder: 2 },
  { name: "Service", slug: "service", sortOrder: 3 },
  { name: "Manufacturing", slug: "manufacturing", sortOrder: 4 },
  { name: "Clothing", parentId: "retail", slug: "clothing", sortOrder: 10 },
  { name: "Grocery", parentId: "retail", slug: "grocery", sortOrder: 11 },
  { name: "Pharmacy", parentId: "retail", slug: "pharmacy", sortOrder: 12 },
  { name: "Electronics", parentId: "retail", slug: "electronics", sortOrder: 13 },
  { name: "Mobile Shop", parentId: "retail", slug: "mobile-shop", sortOrder: 14 },
  { name: "Cosmetics", parentId: "retail", slug: "cosmetics", sortOrder: 15 },
  { name: "Stationery", parentId: "retail", slug: "stationery", sortOrder: 16 },
  { name: "Furniture", parentId: "retail", slug: "furniture", sortOrder: 17 },
  { name: "Jewelry", parentId: "retail", slug: "jewelry", sortOrder: 18 },
  { name: "Online Store", parentId: "retail", slug: "online-store", sortOrder: 19 },
  { name: "Restaurant", parentId: "food", slug: "restaurant", sortOrder: 20 },
  { name: "Bakery", parentId: "food", slug: "bakery", sortOrder: 21 },
  { name: "Repair Service", parentId: "service", slug: "repair-service", sortOrder: 30 },
  { name: "Consultancy", parentId: "service", slug: "consultancy", sortOrder: 31 },
  { name: "Education", parentId: "service", slug: "education", sortOrder: 32 },
  { name: "Wholesale", parentId: "manufacturing", slug: "wholesale", sortOrder: 40 },
  { name: "Manufacturer", parentId: "manufacturing", slug: "manufacturer", sortOrder: 41 },
  { name: "Agriculture", parentId: "manufacturing", slug: "agriculture", sortOrder: 42 },
  { name: "Other", slug: "other", sortOrder: 99 },
];

export async function seedBusinessCategories(database: Database): Promise<void> {
  const collection = database.get("business_categories");
  const existingRows = await collection.query().fetch();

  if (existingRows.length > 0) {
    return;
  }

  const timestamp = Date.now();

  await database.write(async () => {
    for (const item of categorySeeds) {
      await collection.create((record: any) => {
        record.name = item.name;
        record.parentId = item.parentId ?? null;
        record.slug = item.slug;
        record.isActive = true;
        record.sortOrder = item.sortOrder;
        record.createdAt = timestamp;
        record.updatedAt = timestamp;
      });
    }
  });
}
