import type { StatusType } from "@/shared/types/status.types";

export type CreateBusinessCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export type CreateBusinessState = {
  status: StatusType;
  businessNameInput: string;
  selectedCategoryId: string;
  categories: CreateBusinessCategoryOption[];
  isCategoriesLoading: boolean;
  isCategoryDropdownOpen: boolean;
  categorySearchTerm: string;
  errorMessage: string;
};

export interface CreateBusinessViewModel {
  state: CreateBusinessState;
  onBusinessNameChange(value: string): void;
  onCategoryDropdownPress(): void;
  onCategorySearchChange(value: string): void;
  onCategoryPress(categoryId: string): void;
  onCreateBusinessPress(): Promise<void>;
}
