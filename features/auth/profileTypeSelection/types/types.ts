import type { StatusType } from "@/shared/types/status.types";
import type { ProfileType } from "../../profile/data/dataSource/profile.model";

export type ProfileTypeSelectionMode = "create" | "select-existing";

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

export type ExistingProfileOption = {
  id: string;
  profileType: ProfileType;
  profileName: string;
  displayName: string | null;
  businessCategoryName: string | null;
  isActive: boolean;
};

export type ProfileTypeSelectionState = {
  status: StatusType;
  mode: ProfileTypeSelectionMode;
  profileName: string;
  selectedProfileType: ProfileType;
  options: ProfileTypeOption[];
  businessCategories: BusinessCategoryOption[];
  selectedBusinessCategoryId: string;
  isBusinessCategoriesLoading: boolean;
  isBusinessCategoryDropdownOpen: boolean;
  businessCategorySearchTerm: string;
  existingProfiles: ExistingProfileOption[];
  selectedExistingProfileId: string;
  isExistingProfilesLoading: boolean;
  errorMessage: string;
};
