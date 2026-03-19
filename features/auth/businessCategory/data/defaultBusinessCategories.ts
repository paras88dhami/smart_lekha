export type DefaultBusinessCategorySeed = {
  name: string;
  slug: string;
  sortOrder: number;
  parentSlug?: string;
};

export const DEFAULT_BUSINESS_CATEGORY_SEEDS: DefaultBusinessCategorySeed[] = [
  {
    name: "Global - Retail and Ecommerce",
    slug: "global-retail-ecommerce",
    sortOrder: 1,
  },
  {
    name: "Global - Services and Consulting",
    slug: "global-services-consulting",
    sortOrder: 2,
  },
  {
    name: "Global - Restaurant and Cafe",
    slug: "global-restaurant-cafe",
    sortOrder: 3,
  },
  {
    name: "Global - Manufacturing and Wholesale",
    slug: "global-manufacturing-wholesale",
    sortOrder: 4,
  },
  {
    name: "Global - Technology and Digital Agency",
    slug: "global-technology-digital-agency",
    sortOrder: 5,
  },
  {
    name: "Nepal - Kirana and Pasal",
    slug: "nepal-kirana-pasal",
    sortOrder: 6,
  },
  {
    name: "Nepal - Agro Vet and Farm Supply",
    slug: "nepal-agro-vet-farm-supply",
    sortOrder: 7,
  },
  {
    name: "Nepal - Pharmacy",
    slug: "nepal-pharmacy",
    sortOrder: 8,
  },
  {
    name: "Nepal - Tuition and Coaching",
    slug: "nepal-tuition-coaching",
    sortOrder: 9,
  },
  {
    name: "India - Kirana Store",
    slug: "india-kirana-store",
    sortOrder: 10,
  },
  {
    name: "India - Garment and Textile",
    slug: "india-garment-textile",
    sortOrder: 11,
  },
  {
    name: "India - Electronics and Mobile Shop",
    slug: "india-electronics-mobile-shop",
    sortOrder: 12,
  },
  {
    name: "India - Food Stall and Tiffin",
    slug: "india-food-stall-tiffin",
    sortOrder: 13,
  },
  {
    name: "Small Business - Home Business",
    slug: "small-business-home-business",
    sortOrder: 14,
  },
  {
    name: "Small Business - Freelancer",
    slug: "small-business-freelancer",
    sortOrder: 15,
  },
  {
    name: "Small Business - Beauty and Salon",
    slug: "small-business-beauty-salon",
    sortOrder: 16,
  },
  {
    name: "Small Business - Repair Workshop",
    slug: "small-business-repair-workshop",
    sortOrder: 17,
  },
  {
    name: "Other",
    slug: "other",
    sortOrder: 99,
  },
];
