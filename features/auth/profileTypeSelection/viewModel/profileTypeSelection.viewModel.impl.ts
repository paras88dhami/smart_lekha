import { translate } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_BUSINESS_CATEGORY_SEEDS } from "../../businessCategory/data/defaultBusinessCategories";
import type { GetActiveBusinessCategoriesUseCase } from "../../businessCategory/useCase/getActiveBusinessCategories.useCase";
import type { SetActiveProfileUseCase } from "../../profile/useCase/setActiveProfile.useCase";
import { getAuthErrorMessage } from "../../shared/authErrorMessage";
import type { ProfileType } from "../../profile/data/dataSource/profile.model";
import type { CreateProfileUseCase } from "../../profile/useCase/createProfile.useCase";
import type { GetProfilesByAccountIdUseCase } from "../../profile/useCase/getProfilesByAccountId.useCase";
import type {
  BusinessCategoryOption,
  ExistingProfileOption,
  ProfileTypeOption,
  ProfileTypeSelectionMode,
  ProfileTypeSelectionState,
} from "../types/types";
import type { ProfileTypeSelectionViewModel } from "./profileTypeSelection.viewModel";

const PROFILE_TYPE_OPTIONS: ProfileTypeOption[] = [
  {
    profileType: "business",
    titleKey: "auth.selectProfile.businessTitle",
    subtitleKey: "auth.selectProfile.businessSubtitle",
  },
  {
    profileType: "personal",
    titleKey: "auth.selectProfile.personalTitle",
    subtitleKey: "auth.selectProfile.personalSubtitle",
  },
];

const FALLBACK_BUSINESS_CATEGORIES: BusinessCategoryOption[] =
  DEFAULT_BUSINESS_CATEGORY_SEEDS.map((category) => ({
    id: category.slug,
    name: category.name,
    slug: category.slug,
  }));

type Params = {
  accountId: string;
  mode: ProfileTypeSelectionMode;
  createProfileUseCase: CreateProfileUseCase;
  getActiveBusinessCategoriesUseCase: GetActiveBusinessCategoriesUseCase;
  getProfilesByAccountIdUseCase: GetProfilesByAccountIdUseCase;
  setActiveProfileUseCase: SetActiveProfileUseCase;
  onContinue: () => void;
  onClose: () => void;
};

const mapExistingProfiles = (
  accountId: string,
  profiles: {
    id: string;
    accountId?: string;
    profileType?: ProfileType;
    profileName?: string;
    displayName?: string | null;
    businessCategoryName?: string | null;
    isActive?: boolean;
  }[],
): ExistingProfileOption[] => {
  return profiles
    .filter((profile) => profile.accountId === accountId)
    .map((profile) => ({
      id: profile.id,
      profileType: profile.profileType ?? "personal",
      profileName: profile.profileName?.trim() || "",
      displayName: profile.displayName?.trim() || null,
      businessCategoryName: profile.businessCategoryName?.trim() || null,
      isActive: Boolean(profile.isActive),
    }))
    .filter((profile) => profile.profileName.length > 0);
};

export const useProfileTypeSelectionViewModel = (
  params: Params,
): ProfileTypeSelectionViewModel => {
  const {
    accountId,
    mode,
    createProfileUseCase,
    getActiveBusinessCategoriesUseCase,
    getProfilesByAccountIdUseCase,
    setActiveProfileUseCase,
    onContinue,
    onClose,
  } = params;

  const isCreatingProfileRef = useRef(false);
  const [state, setState] = useState<ProfileTypeSelectionState>({
    status: Status.Idle,
    mode,
    profileName: "",
    selectedProfileType: "business",
    options: PROFILE_TYPE_OPTIONS,
    businessCategories: [],
    selectedBusinessCategoryId: "",
    isBusinessCategoriesLoading: mode === "create",
    isBusinessCategoryDropdownOpen: false,
    businessCategorySearchTerm: "",
    existingProfiles: [],
    selectedExistingProfileId: "",
    isExistingProfilesLoading: mode === "select-existing",
    errorMessage: "",
  });

  const loadBusinessCategories = useCallback(async (): Promise<void> => {
    if (mode !== "create") {
      return;
    }

    setState((currentState) => ({
      ...currentState,
      isBusinessCategoriesLoading: true,
      errorMessage: "",
    }));

    const result = await getActiveBusinessCategoriesUseCase.execute();

    if (!result.success) {
      setState((currentState) => ({
        ...currentState,
        businessCategories: FALLBACK_BUSINESS_CATEGORIES,
        isBusinessCategoriesLoading: false,
        errorMessage: "",
      }));
      return;
    }

    const categories: BusinessCategoryOption[] = result.value.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }));

    setState((currentState) => ({
      ...currentState,
      businessCategories:
        categories.length > 0 ? categories : FALLBACK_BUSINESS_CATEGORIES,
      isBusinessCategoriesLoading: false,
      errorMessage: "",
    }));
  }, [getActiveBusinessCategoriesUseCase, mode]);

  const loadExistingProfiles = useCallback(async (): Promise<void> => {
    if (mode !== "select-existing") {
      return;
    }

    setState((currentState) => ({
      ...currentState,
      isExistingProfilesLoading: true,
      errorMessage: "",
    }));

    const result = await getProfilesByAccountIdUseCase.execute(accountId);

    if (!result.success) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        isExistingProfilesLoading: false,
        errorMessage: getAuthErrorMessage(result.error),
      }));
      return;
    }

    const profiles = mapExistingProfiles(accountId, result.value);

    if (profiles.length === 0) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        existingProfiles: [],
        selectedExistingProfileId: "",
        isExistingProfilesLoading: false,
        errorMessage: translate("auth.selectProfile.noProfilesFound"),
      }));
      return;
    }

    const activeProfile = profiles.find((profile) => profile.isActive);
    const selectedExistingProfileId = activeProfile?.id ?? profiles[0].id;

    setState((currentState) => ({
      ...currentState,
      status: Status.Success,
      existingProfiles: profiles,
      selectedExistingProfileId,
      isExistingProfilesLoading: false,
      errorMessage: "",
    }));
  }, [accountId, getProfilesByAccountIdUseCase, mode]);

  const onProfileNameChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      profileName: value,
      errorMessage: "",
    }));
  }, []);

  const onProfileTypePress = useCallback((profileType: ProfileType): void => {
    setState((currentState) => ({
      ...currentState,
      selectedProfileType: profileType,
      isBusinessCategoryDropdownOpen:
        profileType === "business"
          ? currentState.isBusinessCategoryDropdownOpen
          : false,
      businessCategorySearchTerm:
        profileType === "business"
          ? currentState.businessCategorySearchTerm
          : "",
      errorMessage: "",
    }));
  }, []);

  const onBusinessCategoryDropdownPress = useCallback((): void => {
    setState((currentState) => ({
      ...currentState,
      isBusinessCategoryDropdownOpen:
        !currentState.isBusinessCategoryDropdownOpen,
      errorMessage: "",
    }));
  }, []);

  const onBusinessCategorySearchChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      businessCategorySearchTerm: value,
      isBusinessCategoryDropdownOpen: true,
      errorMessage: "",
    }));
  }, []);

  const onBusinessCategoryPress = useCallback((categoryId: string): void => {
    setState((currentState) => ({
      ...currentState,
      selectedBusinessCategoryId: categoryId,
      isBusinessCategoryDropdownOpen: false,
      businessCategorySearchTerm: "",
      errorMessage: "",
    }));
  }, []);

  const onExistingProfilePress = useCallback((profileId: string): void => {
    setState((currentState) => ({
      ...currentState,
      selectedExistingProfileId: profileId,
      errorMessage: "",
    }));
  }, []);

  const onContinuePress = useCallback(async (): Promise<void> => {
    if (isCreatingProfileRef.current) {
      return;
    }

    if (state.mode === "select-existing") {
      if (!state.selectedExistingProfileId) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("auth.selectProfile.validationExistingProfile"),
        }));
        return;
      }

      isCreatingProfileRef.current = true;

      setState((currentState) => ({
        ...currentState,
        status: Status.Loading,
        errorMessage: "",
      }));

      try {
        const setActiveResult = await setActiveProfileUseCase.execute(
          state.selectedExistingProfileId,
        );

        if (!setActiveResult.success) {
          setState((currentState) => ({
            ...currentState,
            status: Status.Failure,
            errorMessage: getAuthErrorMessage(setActiveResult.error),
          }));
          return;
        }

        setState((currentState) => ({
          ...currentState,
          status: Status.Success,
          errorMessage: "",
        }));

        onContinue();
      } finally {
        isCreatingProfileRef.current = false;
      }

      return;
    }

    const trimmedProfileName = state.profileName.trim();

    if (trimmedProfileName.length < 2) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: translate("auth.selectProfile.validationProfileName"),
      }));
      return;
    }

    if (
      state.selectedProfileType === "business" &&
      !state.selectedBusinessCategoryId
    ) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: translate("auth.selectProfile.validationBusinessCategory"),
      }));
      return;
    }

    isCreatingProfileRef.current = true;

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    try {
      const selectedBusinessCategory = state.businessCategories.find(
        (category) => category.id === state.selectedBusinessCategoryId,
      );

      const result = await createProfileUseCase.execute({
        accountId,
        profileType: state.selectedProfileType,
        profileName: trimmedProfileName,
        displayName: trimmedProfileName,
        roleName: state.selectedProfileType === "business" ? "Owner" : null,
        businessCategoryId:
          state.selectedProfileType === "business"
            ? selectedBusinessCategory?.id ?? state.selectedBusinessCategoryId
            : null,
        businessCategoryName:
          state.selectedProfileType === "business"
            ? selectedBusinessCategory?.name ?? null
            : null,
        isActive: true,
      });

      if (!result.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: getAuthErrorMessage(result.error),
        }));
        return;
      }

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        errorMessage: "",
      }));

      onContinue();
    } finally {
      isCreatingProfileRef.current = false;
    }
  }, [
    accountId,
    createProfileUseCase,
    onContinue,
    setActiveProfileUseCase,
    state.businessCategories,
    state.mode,
    state.profileName,
    state.selectedBusinessCategoryId,
    state.selectedExistingProfileId,
    state.selectedProfileType,
  ]);

  const onClosePress = useCallback((): void => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (mode === "select-existing") {
      void loadExistingProfiles();
      return;
    }

    void loadBusinessCategories();
  }, [loadBusinessCategories, loadExistingProfiles, mode]);

  return {
    state,
    onProfileNameChange,
    onProfileTypePress,
    onBusinessCategoryDropdownPress,
    onBusinessCategorySearchChange,
    onBusinessCategoryPress,
    onExistingProfilePress,
    onContinuePress,
    onClosePress,
  };
};
