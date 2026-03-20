import React from "react";
import { router } from "expo-router";
import { createLanguageSelectionFactory } from "@/features/auth/languageSelection/factory/languageSelectionScreenFactory";
import { createLocalAuthSessionDataSource } from "@/features/auth/session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "@/features/auth/session/data/repository/authSession.repository.impl";
import { createLocalAccessSession } from "@/features/auth/session/utils/localAccessSession";
import { createGetCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/getCurrentAuthSession.useCase.impl";
import { createUpsertAuthSessionUseCase } from "@/features/auth/session/useCase/upsertAuthSession.useCase.impl";
import { createValidateCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/validateCurrentAuthSession.useCase.impl";
import { database } from "@/src/database/database";

export default function LanguageScreenRoute(): React.JSX.Element {
  const authSessionRepository = React.useMemo(() => {
    const localAuthSessionDataSource = createLocalAuthSessionDataSource(database);
    return createAuthSessionRepository(localAuthSessionDataSource);
  }, []);

  const getCurrentAuthSessionUseCase = React.useMemo(
    () => createGetCurrentAuthSessionUseCase(authSessionRepository),
    [authSessionRepository],
  );

  const validateCurrentAuthSessionUseCase = React.useMemo(
    () => createValidateCurrentAuthSessionUseCase(authSessionRepository),
    [authSessionRepository],
  );

  const upsertAuthSessionUseCase = React.useMemo(
    () => createUpsertAuthSessionUseCase(authSessionRepository),
    [authSessionRepository],
  );

  const Screen = React.useMemo(
    () =>
      createLanguageSelectionFactory({
        database,
        onContinue: async () => {
          await createLocalAccessSession({
            getCurrentAuthSessionUseCase,
            validateCurrentAuthSessionUseCase,
            upsertAuthSessionUseCase,
          });
          router.replace("/");
        },
      }),
    [
      getCurrentAuthSessionUseCase,
      upsertAuthSessionUseCase,
      validateCurrentAuthSessionUseCase,
    ],
  );

  return <Screen />;
}
