import type { Result } from "@/shared/types/result.types";
import type { GetFinanceAccountByIdUseCase } from "@/features/finance/account/useCase/getFinanceAccountById.useCase";
import type { GetFinanceTransactionsByAccountUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactionsByAccount.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import { createCashBankError } from "@/features/cashBank/overview/useCase/cashBankError";
import type { CashBankAccountStatementData, CashBankStatementItem } from "../types/types";
import type { LoadCashBankAccountStatementUseCase } from "./loadCashBankAccountStatement.useCase";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getFinanceAccountByIdUseCase: GetFinanceAccountByIdUseCase;
  getFinanceTransactionsByAccountUseCase: GetFinanceTransactionsByAccountUseCase;
};

const createFailure = (error: Error): Result<CashBankAccountStatementData> => {
  return { success: false, error };
};

const createStatementTitle = (
  categoryName: string | null,
  counterpartyName: string | null,
  note: string | null,
): string => {
  return counterpartyName || categoryName || note || "Transaction";
};

const mapStatementItem = (
  id: string,
  amount: number,
  occurredAt: number,
  entryType: CashBankStatementItem["entryType"],
  categoryName: string | null,
  counterpartyName: string | null,
  note: string | null,
): CashBankStatementItem => {
  return {
    id,
    title: createStatementTitle(categoryName, counterpartyName, note),
    amount,
    occurredAt,
    entryType,
    note,
  };
};

export const createLoadCashBankAccountStatementUseCase = (
  dependencies: Dependencies,
): LoadCashBankAccountStatementUseCase => ({
  async execute(accountId: string): Promise<Result<CashBankAccountStatementData>> {
    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();

    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createFailure(createCashBankError("no_active_profile"));
    }

    const accountResult = await dependencies.getFinanceAccountByIdUseCase.execute(accountId);

    if (
      !accountResult.success ||
      accountResult.value.profileId !== activeProfileResult.value.profileId
    ) {
      return createFailure(createCashBankError("account_not_found"));
    }

    const statementResult = await dependencies.getFinanceTransactionsByAccountUseCase.execute(
      accountId,
      250,
    );

    if (!statementResult.success) {
      return createFailure(createCashBankError("load_failed"));
    }

    return {
      success: true,
      value: {
        accountId: accountResult.value.id,
        accountName: accountResult.value.accountName,
        accountNumber: accountResult.value.accountNumber,
        currentBalance: accountResult.value.currentBalance,
        currencyCode: accountResult.value.currencyCode,
        statementItems: statementResult.value.map((transaction) =>
          mapStatementItem(
            transaction.id,
            transaction.amount,
            transaction.occurredAt,
            transaction.entryType,
            transaction.categoryName,
            transaction.counterpartyName,
            transaction.note,
          ),
        ),
      },
    };
  },
});
