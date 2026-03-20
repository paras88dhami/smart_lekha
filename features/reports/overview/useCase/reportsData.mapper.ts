import { translate } from "@/shared/i18n/resources";
import type { FinanceTransaction } from "@/features/finance/transaction/types/types";
import type { PosSale } from "@/features/pos/sale/types/types";
import type { ReportEntryTypeTotalItem } from "../types/types";

const ENTRY_TYPE_LABEL_MAP: Record<
  | "income"
  | "expense"
  | "payment_in"
  | "payment_out"
  | "transfer_out"
  | "transfer_in"
  | "pos_sale",
  string
> = {
  income: "notifications.entryTypes.income",
  expense: "notifications.entryTypes.expense",
  payment_in: "notifications.entryTypes.paymentIn",
  payment_out: "notifications.entryTypes.paymentOut",
  transfer_out: "notifications.entryTypes.transferOut",
  transfer_in: "notifications.entryTypes.transferIn",
  pos_sale: "notifications.entryTypes.posSale",
};

export const buildReportEntryTypeTotals = (
  transactions: FinanceTransaction[],
): ReportEntryTypeTotalItem[] => {
  const amountByEntryType = new Map<string, number>();

  for (const transaction of transactions) {
    const currentAmount = amountByEntryType.get(transaction.entryType) ?? 0;
    amountByEntryType.set(transaction.entryType, currentAmount + transaction.amount);
  }

  return Array.from(amountByEntryType.entries())
    .map(([entryType, amount]) => ({
      label: translate(ENTRY_TYPE_LABEL_MAP[entryType as keyof typeof ENTRY_TYPE_LABEL_MAP]),
      amount,
    }))
    .sort((leftItem, rightItem) => rightItem.amount - leftItem.amount);
};

export const calculatePosSalesAmount = (sales: PosSale[]): number => {
  return sales.reduce((totalAmount, sale) => totalAmount + sale.totalAmount, 0);
};
