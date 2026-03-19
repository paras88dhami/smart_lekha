import type { ProfileType } from "@/features/auth/profile/data/dataSource/profile.model";
import type { StatusType } from "@/shared/types/status.types";

export type ProfileSelectionItem = {
  id: string;
  profileName: string;
  displayName: string | null;
  profileType: ProfileType;
  businessCategoryName: string | null;
  isActive: boolean;
};

export type ProfileSelectionState = {
  status: StatusType;
  accountId: string;
  profiles: ProfileSelectionItem[];
  selectedProfileId: string;
  errorMessage: string;
};

export interface ProfileSelectionViewModel {
  state: ProfileSelectionState;
  onRefreshPress(): Promise<void>;
  onSelectProfilePress(profileId: string): void;
  onActivateProfilePress(): Promise<void>;
  onCreateBusinessPress(): void;
}
