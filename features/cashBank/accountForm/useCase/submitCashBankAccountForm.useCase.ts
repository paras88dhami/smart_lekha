import type { Result } from "@/shared/types/result.types";
import type { FinanceAccountType } from "@/features/finance/account/data/dataSource/financeAccount.model";

export type SubmitCashBankAccountFormCommand = {
  accountId: string | null;
  accountNameInput: string;
  accountNumberInput: string;
  openingBalanceInput: string;
  selectedAccountType: FinanceAccountType;
};

export interface SubmitCashBankAccountFormUseCase {
  execute(command: SubmitCashBankAccountFormCommand): Promise<Result<void>>;
}
