import { DEFAULT_BUSINESS_CATEGORY_SEEDS } from "@/features/auth/businessCategory/data/defaultBusinessCategories";
import type { GetActiveBusinessCategoriesUseCase } from "@/features/auth/businessCategory/useCase/getActiveBusinessCategories.useCase";
import type { GetCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/getCurrentAuthSession.useCase";
import { getAuthErrorMessage } from "@/features/auth/shared/authErrorMessage";
import type { CreateBusinessProfileBootstrapUseCase } from "../useCase/createBusinessProfileBootstrap.useCase";
import { translate } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CreateBusinessCategoryOption, CreateBusinessState, CreateBusinessViewModel } from "./createBusiness.viewModel";

const FALLBACK_BUSINESS_CATEGORIES: CreateBusinessCategoryOption[] =
  DEFAULT_BUSINESS_CATEGORY_SEEDS.map((category) => ({
    id: category.slug,
    name: category.name,
    slug: category.slug,
  }));

type Params = {
  getCurrentAuthSessionUseCase: GetCurrentAuthSessionUseCase;
  getActiveBusinessCategoriesUseCase: GetActiveBusinessCategoriesUseCase;
  createBusinessProfileBootstrapUseCase: CreateBusinessProfileBootstrapUseCase;
  onCreated: () => void;
};

export const useCreateBusinessViewModel = (
  params: Params,
): CreateBusinessViewModel => {
  const {
    getCurrentAuthSessionUseCase,
    getActiveBusinessCategoriesUseCase,
    createBusinessProfileBootstrapUseCase,
    onCreated,
  } = params;

  const isSubmittingRef = useRef(false);

  const [state, setState] = useState<CreateBusinessState>({
    status: Status.Idle,
    businessNameInput: "",
    selectedCategoryId: "",
    categories: [],
    isCategoriesLoading: true,
    isCategoryDropdownOpen: false,
    categorySearchTerm: "",
    errorMessage: "",
  });

  const loadCategories = useCallback(async (): Promise<void> => {
    setState((currentState) => ({
      ...currentState,
      isCategoriesLoading: true,
      errorMessage: "",
    }));

    const result = await getActiveBusinessCategoriesUseCase.execute();

    if (!result.success) {
      setState((currentState) => ({
        ...currentState,
        categories: FALLBACK_BUSINESS_CATEGORIES,
        isCategoriesLoading: false,
      }));
      return;
    }

    const categories = result.value.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }));

    setState((currentState) => ({
      ...currentState,
      categories: categories.length > 0 ? categories : FALLBACK_BUSINESS_CATEGORIES,
      isCategoriesLoading: false,
    }));
  }, [getActiveBusinessCategoriesUseCase]);

  const onBusinessNameChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      businessNameInput: value,
      errorMessage: "",
    }));
  }, []);

  const onCategoryDropdownPress = useCallback((): void => {
    setState((currentState) => ({
      ...currentState,
      isCategoryDropdownOpen: !currentState.isCategoryDropdownOpen,
      errorMessage: "",
    }));
  }, []);

  const onCategorySearchChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      categorySearchTerm: value,
      isCategoryDropdownOpen: true,
      errorMessage: "",
    }));
  }, []);

  const onCategoryPress = useCallback((categoryId: string): void => {
    setState((currentState) => ({
      ...currentState,
      selectedCategoryId: categoryId,
      isCategoryDropdownOpen: false,
      categorySearchTerm: "",
      errorMessage: "",
    }));
  }, []);

  const onCreateBusinessPress = useCallback(async (): Promise<void> => {
    if (isSubmittingRef.current) {
      return;
    }

    const profileName = state.businessNameInput.trim();

    if (profileName.length < 2) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: translate("profile.createBusiness.errors.invalidBusinessName"),
      }));
      return;
    }

    if (!state.selectedCategoryId) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: translate("profile.createBusiness.errors.categoryRequired"),
      }));
      return;
    }

    isSubmittingRef.current = true;

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    try {
      const sessionResult = await getCurrentAuthSessionUseCase.execute();
      const accountId = sessionResult.success ? sessionResult.value?.accountId?.trim() ?? "" : "";

      if (!accountId) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("profile.createBusiness.errors.noAccount"),
        }));
        return;
      }

      const selectedCategory = state.categories.find(
        (category) => category.id === state.selectedCategoryId,
      );

      const createResult = await createBusinessProfileBootstrapUseCase.execute({
        accountId,
        profileName,
        businessCategoryId: selectedCategory?.id ?? state.selectedCategoryId,
        businessCategoryName: selectedCategory?.name ?? null,
      });

      if (!createResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: getAuthErrorMessage(createResult.error),
        }));
        return;
      }

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        businessNameInput: "",
        selectedCategoryId: "",
        categorySearchTerm: "",
        isCategoryDropdownOpen: false,
        errorMessage: "",
      }));

      onCreated();
    } finally {
      isSubmittingRef.current = false;
    }
  }, [
    createBusinessProfileBootstrapUseCase,
    getCurrentAuthSessionUseCase,
    onCreated,
    state.businessNameInput,
    state.categories,
    state.selectedCategoryId,
  ]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  return {
    state,
    onBusinessNameChange,
    onCategoryDropdownPress,
    onCategorySearchChange,
    onCategoryPress,
    onCreateBusinessPress,
  };
};
