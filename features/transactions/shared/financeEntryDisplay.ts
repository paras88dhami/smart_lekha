import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";

const OUTFLOW_ENTRY_TYPES: FinanceEntryType[] = [
  "expense",
  "payment_out",
  "transfer_out",
];

const ENTRY_TRANSLATION_KEYS: Record<FinanceEntryType, string> = {
  income: "notifications.entryTypes.income",
  expense: "notifications.entryTypes.expense",
  payment_in: "notifications.entryTypes.paymentIn",
  payment_out: "notifications.entryTypes.paymentOut",
  transfer_in: "notifications.entryTypes.transferIn",
  transfer_out: "notifications.entryTypes.transferOut",
  pos_sale: "notifications.entryTypes.posSale",
};

export const isOutflowFinanceEntryType = (
  entryType: FinanceEntryType,
): boolean => {
  return OUTFLOW_ENTRY_TYPES.includes(entryType);
};

export const getFinanceEntryTranslationKey = (
  entryType: FinanceEntryType,
): string => {
  return ENTRY_TRANSLATION_KEYS[entryType];
};
