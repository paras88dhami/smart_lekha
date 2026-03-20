import { translate } from "@/shared/i18n/resources";
import type { TransactionsError } from "../useCase/transactionsError";

export const getTransactionsErrorMessage = (
  error: TransactionsError,
): string => {
  return translate(`transactions.errors.${error.code}`);
};
