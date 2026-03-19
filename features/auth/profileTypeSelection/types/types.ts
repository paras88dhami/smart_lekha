import type { ProfileType } from "../../profile/data/dataSource/profile.model";
import type { StatusType } from "@/shared/types/status.types";

export type ProfileTypeOption = {
  profileType: ProfileType;
  titleKey: string;
  subtitleKey: string;
};

export type BusinessCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export type ProfileTypeSelectionState = {
  status: StatusType;
  profileName: string;
  selectedProfileType: ProfileType;
  options: ProfileTypeOption[];
  businessCategories: BusinessCategoryOption[];
  selectedBusinessCategoryId: string;
  isBusinessCategoriesLoading: boolean;
  errorMessage: string;
};
