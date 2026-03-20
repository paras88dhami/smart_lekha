import type { AuthSessionModel } from "@/features/auth/session/data/dataSource/authSession.model";
import type { GetCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/getCurrentAuthSession.useCase";
import type { UpsertAuthSessionUseCase } from "@/features/auth/session/useCase/upsertAuthSession.useCase";
import type { ValidateCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/validateCurrentAuthSession.useCase";

const LOCAL_ACCESS_ACCOUNT_ID = "local-access-account";
const LOCAL_ACCESS_PHONE_NUMBER = "LOCAL_ACCESS";
const LOCAL_ACCESS_COUNTRY_CODE = "LOCAL";
const LOCAL_ACCESS_COUNTRY_ISO = "LOCAL";

const hasAccessibleSession = (
  session: AuthSessionModel | null | undefined,
): session is AuthSessionModel => {
  return Boolean(session?.isLoggedIn && session?.isVerified && session?.accountId?.trim());
};

const isLocalAccessSession = (session: AuthSessionModel | null | undefined): boolean => {
  return Boolean(
    session?.accountId === LOCAL_ACCESS_ACCOUNT_ID &&
      session?.phoneNumber === LOCAL_ACCESS_PHONE_NUMBER &&
      session?.countryCode === LOCAL_ACCESS_COUNTRY_CODE &&
      session?.countryIso === LOCAL_ACCESS_COUNTRY_ISO,
  );
};

type ResolveAccessibleAuthSessionParams = {
  getCurrentAuthSessionUseCase: GetCurrentAuthSessionUseCase;
  validateCurrentAuthSessionUseCase: ValidateCurrentAuthSessionUseCase;
};

type CreateLocalAccessSessionParams = ResolveAccessibleAuthSessionParams & {
  upsertAuthSessionUseCase: UpsertAuthSessionUseCase;
};

export const resolveAccessibleAuthSession = async ({
  getCurrentAuthSessionUseCase,
  validateCurrentAuthSessionUseCase,
}: ResolveAccessibleAuthSessionParams): Promise<AuthSessionModel | null> => {
  const currentSessionResult = await getCurrentAuthSessionUseCase.execute();
  const currentSession =
    currentSessionResult.success && hasAccessibleSession(currentSessionResult.value)
      ? currentSessionResult.value
      : null;

  if (currentSession && isLocalAccessSession(currentSession)) {
    return currentSession;
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

export const createLocalAccessSession = async ({
  getCurrentAuthSessionUseCase,
  validateCurrentAuthSessionUseCase,
  upsertAuthSessionUseCase,
}: CreateLocalAccessSessionParams): Promise<AuthSessionModel | null> => {
  const accessibleSession = await resolveAccessibleAuthSession({
    getCurrentAuthSessionUseCase,
    validateCurrentAuthSessionUseCase,
  });

  if (accessibleSession) {
    return accessibleSession;
  }

  const result = await upsertAuthSessionUseCase.execute({
    accountId: LOCAL_ACCESS_ACCOUNT_ID,
    phoneNumber: LOCAL_ACCESS_PHONE_NUMBER,
    countryCode: LOCAL_ACCESS_COUNTRY_CODE,
    countryIso: LOCAL_ACCESS_COUNTRY_ISO,
    isLoggedIn: true,
    isVerified: true,
    accessToken: null,
    refreshToken: null,
  });

  if (!result.success) {
    return null;
  }

  return result.value;
};
