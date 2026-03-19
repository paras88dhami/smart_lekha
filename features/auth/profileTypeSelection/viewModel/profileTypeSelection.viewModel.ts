import type { ProfileType } from "../../profile/data/dataSource/profile.model";
import type { ProfileTypeSelectionState } from "../types/types";

export interface ProfileTypeSelectionViewModel {
  state: ProfileTypeSelectionState;
  onProfileNameChange(value: string): void;
  onProfileTypePress(profileType: ProfileType): void;
  onBusinessCategoryDropdownPress(): void;
  onBusinessCategorySearchChange(value: string): void;
  onBusinessCategoryPress(categoryId: string): void;
  onContinuePress(): Promise<void>;
  onClosePress(): void;
}
