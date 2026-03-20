import type { AuthError } from "@/features/auth/shared/authError.types";
import { getAuthErrorMessage } from "@/features/auth/shared/authErrorMessage";
import { translate } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GetProfilesByAccountIdUseCase } from "@/features/auth/profile/useCase/getProfilesByAccountId.useCase";
import type { GetCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/getCurrentAuthSession.useCase";
import type { ActivateSelectedProfileUseCase } from "../useCase/activateSelectedProfile.useCase";
import type { ProfileSelectionState, ProfileSelectionViewModel } from "./profileSelection.viewModel";

type Params = {
  getCurrentAuthSessionUseCase: GetCurrentAuthSessionUseCase;
  getProfilesByAccountIdUseCase: GetProfilesByAccountIdUseCase;
  activateSelectedProfileUseCase: ActivateSelectedProfileUseCase;
  onActivated: () => void;
  onCreateBusiness: () => void;
};

const getProfileSelectionErrorMessage = (error: AuthError | Error): string => {
  if ("type" in error) {
    return getAuthErrorMessage(error);
  }

  return error.message;
};

export const useProfileSelectionViewModel = (
  params: Params,
): ProfileSelectionViewModel => {
  const {
    getCurrentAuthSessionUseCase,
    getProfilesByAccountIdUseCase,
    activateSelectedProfileUseCase,
    onActivated,
    onCreateBusiness,
  } = params;

  const isLoadingRef = useRef(false);
  const isSubmittingRef = useRef(false);

  const [state, setState] = useState<ProfileSelectionState>({
    status: Status.Idle,
    accountId: "",
    profiles: [],
    selectedProfileId: "",
    errorMessage: "",
  });

  const loadProfiles = useCallback(async (): Promise<void> => {
    if (isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;

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
          accountId: "",
          profiles: [],
          selectedProfileId: "",
          errorMessage: translate("profile.profileSelection.errors.noAccount"),
        }));
        return;
      }

      const profilesResult = await getProfilesByAccountIdUseCase.execute(accountId);

      if (!profilesResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          accountId,
          profiles: [],
          selectedProfileId: "",
          errorMessage: getAuthErrorMessage(profilesResult.error),
        }));
        return;
      }

      const profiles = profilesResult.value.map((profile) => ({
        id: profile.id,
        profileName: profile.profileName?.trim() ?? "",
        displayName: profile.displayName?.trim() ?? null,
        profileType: profile.profileType ?? "personal",
        businessCategoryName: profile.businessCategoryName?.trim() ?? null,
        isActive: Boolean(profile.isActive),
      }));

      const activeProfile = profiles.find((profile) => profile.isActive);
      const selectedProfileId = activeProfile?.id ?? profiles[0]?.id ?? "";

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        accountId,
        profiles,
        selectedProfileId,
        errorMessage: "",
      }));
    } finally {
      isLoadingRef.current = false;
    }
  }, [getCurrentAuthSessionUseCase, getProfilesByAccountIdUseCase]);

  const onSelectProfilePress = useCallback((profileId: string): void => {
    setState((currentState) => ({
      ...currentState,
      selectedProfileId: profileId,
      errorMessage: "",
    }));
  }, []);

  const onActivateProfilePress = useCallback(async (): Promise<void> => {
    if (isSubmittingRef.current || !state.selectedProfileId) {
      return;
    }

    isSubmittingRef.current = true;

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    try {
      const result = await activateSelectedProfileUseCase.execute(
        state.selectedProfileId,
      );

      if (!result.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: getProfileSelectionErrorMessage(result.error),
        }));
        return;
      }

      await loadProfiles();
      onActivated();
    } finally {
      isSubmittingRef.current = false;
    }
  }, [
    activateSelectedProfileUseCase,
    loadProfiles,
    onActivated,
    state.selectedProfileId,
  ]);

  const onCreateBusinessPress = useCallback((): void => {
    onCreateBusiness();
  }, [onCreateBusiness]);

  useEffect(() => {
    void loadProfiles();
  }, [loadProfiles]);

  return {
    state,
    onRefreshPress: loadProfiles,
    onSelectProfilePress,
    onActivateProfilePress,
    onCreateBusinessPress,
  };
};
