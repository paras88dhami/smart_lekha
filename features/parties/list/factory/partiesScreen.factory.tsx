import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createLocalTransferBeneficiaryDataSource } from "@/features/transfers/beneficiary/data/dataSource/localTransferBeneficiary.dataSource.impl";
import { createTransferBeneficiaryRepository } from "@/features/transfers/beneficiary/data/repository/transferBeneficiary.repository.impl";
import { createCreateTransferBeneficiaryUseCase } from "@/features/transfers/beneficiary/useCase/createTransferBeneficiary.useCase.impl";
import { createGetTransferBeneficiariesUseCase } from "@/features/transfers/beneficiary/useCase/getTransferBeneficiaries.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import PartiesScreen from "../ui/PartiesScreen";
import { usePartiesViewModel } from "../viewModel/parties.viewModel.impl";

type Params = {
  database: Database;
};

export const createPartiesScreenFactory = ({ database }: Params) => {
  return function PartiesScreenFactory(): React.JSX.Element {
    const getActiveProfileUseCase = React.useMemo(() => {
      const localDataSource = createLocalActiveProfileDataSource(database);
      const repository = createActiveProfileRepository(localDataSource);

      return createGetActiveProfileUseCase(repository);
    }, [database]);

    const transferBeneficiaryRepository = React.useMemo(() => {
      const localDataSource = createLocalTransferBeneficiaryDataSource(database);
      return createTransferBeneficiaryRepository(localDataSource);
    }, [database]);

    const getTransferBeneficiariesUseCase = React.useMemo(
      () => createGetTransferBeneficiariesUseCase(transferBeneficiaryRepository),
      [transferBeneficiaryRepository],
    );

    const createTransferBeneficiaryUseCase = React.useMemo(
      () => createCreateTransferBeneficiaryUseCase(transferBeneficiaryRepository),
      [transferBeneficiaryRepository],
    );

    const viewModel = usePartiesViewModel({
      getActiveProfileUseCase,
      getTransferBeneficiariesUseCase,
      createTransferBeneficiaryUseCase,
    });

    return <PartiesScreen viewModel={viewModel} />;
  };
};
