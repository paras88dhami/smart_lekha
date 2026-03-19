import { translate } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_BUSINESS_CATEGORY_SEEDS } from "../../businessCategory/data/defaultBusinessCategories";
import type { GetActiveBusinessCategoriesUseCase } from "../../businessCategory/useCase/getActiveBusinessCategories.useCase";
import { getAuthErrorMessage } from "../../shared/authErrorMessage";
import type { ProfileType } from "../../profile/data/dataSource/profile.model";
import type { CreateProfileUseCase } from "../../profile/useCase/createProfile.useCase";
import type {
  BusinessCategoryOption,
  ProfileTypeOption,
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
  createProfileUseCase: CreateProfileUseCase;
  getActiveBusinessCategoriesUseCase: GetActiveBusinessCategoriesUseCase;
  onContinue: () => void;
  onClose: () => void;
};

export const useProfileTypeSelectionViewModel = (
  params: Params,
): ProfileTypeSelectionViewModel => {
  const {
    accountId,
    createProfileUseCase,
    getActiveBusinessCategoriesUseCase,
    onContinue,
    onClose,
  } = params;

  const isCreatingProfileRef = useRef(false);
  const [state, setState] = useState<ProfileTypeSelectionState>({
    status: Status.Idle,
    profileName: "",
    selectedProfileType: "business",
    options: PROFILE_TYPE_OPTIONS,
    businessCategories: [],
    selectedBusinessCategoryId: "",
    isBusinessCategoriesLoading: true,
    isBusinessCategoryDropdownOpen: false,
    businessCategorySearchTerm: "",
    errorMessage: "",
  });

  const loadBusinessCategories = useCallback(async (): Promise<void> => {
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
  }, [getActiveBusinessCategoriesUseCase]);

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

  const onContinuePress = useCallback(async (): Promise<void> => {
    if (isCreatingProfileRef.current) {
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
      const result = await createProfileUseCase.execute({
        accountId,
        profileType: state.selectedProfileType,
        profileName: trimmedProfileName,
        displayName: trimmedProfileName,
        roleName: state.selectedProfileType === "business" ? "Owner" : null,
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
    state.profileName,
    state.selectedBusinessCategoryId,
    state.selectedProfileType,
  ]);

  const onClosePress = useCallback((): void => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    void loadBusinessCategories();
  }, [loadBusinessCategories]);

  return {
    state,
    onProfileNameChange,
    onProfileTypePress,
    onBusinessCategoryDropdownPress,
    onBusinessCategorySearchChange,
    onBusinessCategoryPress,
    onContinuePress,
    onClosePress,
  };
};
