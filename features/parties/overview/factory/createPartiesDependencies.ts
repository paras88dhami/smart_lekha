import type { Database } from "@nozbe/watermelondb";
import { createLocalTransferBeneficiaryDataSource } from "@/features/transfers/beneficiary/data/dataSource/localTransferBeneficiary.dataSource.impl";
import { createTransferBeneficiaryRepository } from "@/features/transfers/beneficiary/data/repository/transferBeneficiary.repository.impl";
import { createCreateTransferBeneficiaryUseCase } from "@/features/transfers/beneficiary/useCase/createTransferBeneficiary.useCase.impl";
import { createGetTransferBeneficiariesUseCase } from "@/features/transfers/beneficiary/useCase/getTransferBeneficiaries.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import { createCreatePartyRecordUseCase } from "../useCase/createPartyRecord.useCase.impl";
import { createLoadPartiesOverviewUseCase } from "../useCase/loadPartiesOverview.useCase.impl";
import type { CreatePartyRecordUseCase } from "../useCase/createPartyRecord.useCase";
import type { LoadPartiesOverviewUseCase } from "../useCase/loadPartiesOverview.useCase";

type Params = {
  database: Database;
};

export type PartiesDependencies = {
  loadPartiesOverviewUseCase: LoadPartiesOverviewUseCase;
  createPartyRecordUseCase: CreatePartyRecordUseCase;
};

export const createPartiesDependencies = ({ database }: Params): PartiesDependencies => {
  const activeProfileRepository = createActiveProfileRepository(
    createLocalActiveProfileDataSource(database),
  );
  const transferBeneficiaryRepository = createTransferBeneficiaryRepository(
    createLocalTransferBeneficiaryDataSource(database),
  );

  return {
    loadPartiesOverviewUseCase: createLoadPartiesOverviewUseCase({
      getActiveProfileUseCase: createGetActiveProfileUseCase(activeProfileRepository),
      getTransferBeneficiariesUseCase: createGetTransferBeneficiariesUseCase(
        transferBeneficiaryRepository,
      ),
    }),
    createPartyRecordUseCase: createCreatePartyRecordUseCase({
      getActiveProfileUseCase: createGetActiveProfileUseCase(activeProfileRepository),
      createTransferBeneficiaryUseCase: createCreateTransferBeneficiaryUseCase(
        transferBeneficiaryRepository,
      ),
    }),
  };
};
