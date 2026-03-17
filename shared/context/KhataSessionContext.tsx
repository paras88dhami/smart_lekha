import React from "react";
import { createMockKhataDatabase } from "@/shared/database/mockKhataDatabase";

type SessionState = {
  database: ReturnType<typeof createMockKhataDatabase>;
  onboardingComplete: boolean;
  phoneNumber: string;
  selectedProfileId: string;
};

type ContextValue = {
  state: SessionState;
  completeOnboarding: () => void;
  updatePhoneNumber: (value: string) => void;
  selectProfile: (profileId: string) => void;
};

const SessionContext = React.createContext<ContextValue | null>(null);

export function KhataSessionProvider(props: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [state, setState] = React.useState<SessionState>({
    database: createMockKhataDatabase(),
    onboardingComplete: false,
    phoneNumber: "",
    selectedProfileId: "business",
  });

  const completeOnboarding = React.useCallback(() => {
    setState((current) => ({ ...current, onboardingComplete: true }));
  }, []);

  const updatePhoneNumber = React.useCallback((value: string) => {
    setState((current) => ({ ...current, phoneNumber: value }));
  }, []);

  const selectProfile = React.useCallback((profileId: string) => {
    setState((current) => ({ ...current, selectedProfileId: profileId }));
  }, []);

  const value = React.useMemo(
    () => ({ state, completeOnboarding, updatePhoneNumber, selectProfile }),
    [state, completeOnboarding, updatePhoneNumber, selectProfile],
  );
  return (
    <SessionContext.Provider value={value}>
      {props.children}
    </SessionContext.Provider>
  );
}

export function useKhataSession(): ContextValue {
  const context = React.useContext(SessionContext);
  if (!context) {
    throw new Error("KhataSessionProvider is required before useKhataSession.");
  }
  return context;
}
