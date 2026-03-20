import type { StartupDestination } from "../types/types";

export interface ResolveStartupDestinationUseCase {
  execute(): Promise<StartupDestination>;
}
