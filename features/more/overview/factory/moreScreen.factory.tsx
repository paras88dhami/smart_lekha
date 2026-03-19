import { createAuthSessionRepository } from "@/features/auth/session/data/repository/authSession.repository.impl";
import { createLocalAuthSessionDataSource } from "@/features/auth/session/data/dataSource/localAuthSession.datasource.impl";
import { createClearAuthSessionUseCase } from "@/features/auth/session/useCase/clearAuthSession.useCase.impl";
import type { Database } from "@nozbe/watermelondb";
import React, { useMemo } from "react";
import MoreScreen from "../ui/MoreScreen";
import { useMoreViewModel } from "../viewModel/more.viewModel.impl";

type Params = {
  database: Database;
  onLoggedOut: () => void;
};

export const createMoreScreenFactory = ({
  database,
  onLoggedOut,
}: Params) => {
  return function MoreScreenFactory(): React.JSX.Element {
    const clearAuthSessionUseCase = useMemo(() => {
      const localAuthSessionDataSource = createLocalAuthSessionDataSource(database);
      const authSessionRepository = createAuthSessionRepository(
        localAuthSessionDataSource,
      );

      return createClearAuthSessionUseCase(authSessionRepository);
    }, [database]);

    const viewModel = useMoreViewModel({
      clearAuthSessionUseCase,
      onLoggedOut,
    });

    return <MoreScreen viewModel={viewModel} />;
  };
};
