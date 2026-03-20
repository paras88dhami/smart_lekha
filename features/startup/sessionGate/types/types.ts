export type StartupDestination =
  | "/(auth)/language"
  | "/(auth)/phone-auth"
  | "/profile-selection"
  | "/create-business"
  | "/(tabs)/home";

export type StartupGateState = {
  destination: StartupDestination | null;
};

export interface StartupGateViewModel {
  state: StartupGateState;
  onRetryPress(): Promise<void>;
}
