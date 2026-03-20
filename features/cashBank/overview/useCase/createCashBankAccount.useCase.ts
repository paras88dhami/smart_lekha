import type { FinanceAccountType } from "@/features/finance/account/data/dataSource/financeAccount.model";
import type { Result } from "@/shared/types/result.types";

export type CreateCashBankAccountCommand = {
  accountNameInput: string;
  accountNumberInput: string;
  openingBalanceInput: string;
  selectedAccountType: FinanceAccountType;
};

export interface CreateCashBankAccountUseCase {
  execute(input: CreateCashBankAccountCommand): Promise<Result<void>>;
}
