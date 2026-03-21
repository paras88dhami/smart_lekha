import type { Result } from "@/shared/types/result.types";
import type { ArchiveFinanceAccountUseCase } from "@/features/finance/account/useCase/archiveFinanceAccount.useCase";
import type { GetFinanceAccountByIdUseCase } from "@/features/finance/account/useCase/getFinanceAccountById.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import { createCashBankError } from "@/features/cashBank/overview/useCase/cashBankError";
import type { ArchiveCashBankAccountFormUseCase } from "./archiveCashBankAccountForm.useCase";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getFinanceAccountByIdUseCase: GetFinanceAccountByIdUseCase;
  archiveFinanceAccountUseCase: ArchiveFinanceAccountUseCase;
};

const createFailure = (error: Error): Result<void> => {
  return { success: false, error };
};

export const createArchiveCashBankAccountFormUseCase = (
  dependencies: Dependencies,
): ArchiveCashBankAccountFormUseCase => ({
  async execute(accountId: string | null): Promise<Result<void>> {
    if (!accountId) {
      return createFailure(createCashBankError("account_not_found"));
    }

    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();

    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createFailure(createCashBankError("no_active_profile"));
    }

    const accountResult = await dependencies.getFinanceAccountByIdUseCase.execute(accountId);

    if (
      !accountResult.success ||
      accountResult.value.profileId !== activeProfileResult.value.profileId ||
      accountResult.value.isArchived
    ) {
      return createFailure(createCashBankError("account_not_found"));
    }

    if (accountResult.value.isPrimary) {
      return createFailure(createCashBankError("cannot_archive_primary"));
    }

    if (Math.abs(accountResult.value.currentBalance) > 0.001) {
      return createFailure(createCashBankError("cannot_archive_with_balance"));
    }

    const archiveAccountResult = await dependencies.archiveFinanceAccountUseCase.execute(accountId);

    if (!archiveAccountResult.success) {
      return createFailure(createCashBankError("archive_failed"));
    }

    return { success: true, value: undefined };
  },
});
