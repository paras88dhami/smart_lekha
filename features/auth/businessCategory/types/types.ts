export type BusinessCategory = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  sortOrder: number;
};
