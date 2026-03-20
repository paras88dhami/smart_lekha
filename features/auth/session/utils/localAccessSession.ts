import type { AuthSessionModel } from "@/features/auth/session/data/dataSource/authSession.model";
import type { GetCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/getCurrentAuthSession.useCase";
import type { ValidateCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/validateCurrentAuthSession.useCase";

const hasAccessibleSession = (
  session: AuthSessionModel | null | undefined,
): session is AuthSessionModel => {
  return Boolean(session?.isLoggedIn && session?.isVerified && session?.accountId?.trim());
};

type ResolveAccessibleAuthSessionParams = {
  getCurrentAuthSessionUseCase: GetCurrentAuthSessionUseCase;
  validateCurrentAuthSessionUseCase: ValidateCurrentAuthSessionUseCase;
};

export const resolveAccessibleAuthSession = async ({
  getCurrentAuthSessionUseCase,
  validateCurrentAuthSessionUseCase,
}: ResolveAccessibleAuthSessionParams): Promise<AuthSessionModel | null> => {
  const currentSessionResult = await getCurrentAuthSessionUseCase.execute();

  if (
    !currentSessionResult.success ||
    !hasAccessibleSession(currentSessionResult.value)
  ) {
    return null;
  }

  const validatedSessionResult = await validateCurrentAuthSessionUseCase.execute();

  if (
    validatedSessionResult.success &&
    hasAccessibleSession(validatedSessionResult.value)
  ) {
    return validatedSessionResult.value;
  }

  return null;
};
