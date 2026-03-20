import { translate } from "@/shared/i18n/resources";
import type { FinanceTransaction } from "@/features/finance/transaction/types/types";
import type { TransferRecord } from "@/features/transfers/record/types/types";
import type { NotificationTimelineItem } from "../types/types";

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

export const mapTransactionNotification = (
  transaction: FinanceTransaction,
): NotificationTimelineItem => {
  return {
    id: `txn-${transaction.id}`,
    title: translate(ENTRY_TYPE_LABEL_MAP[transaction.entryType]),
    description:
      transaction.note?.trim() ||
      transaction.counterpartyName?.trim() ||
      transaction.categoryName?.trim() ||
      translate("notifications.defaultTransactionDescription"),
    timestamp: transaction.occurredAt,
    kind: "transaction",
  };
};

export const mapScheduledTransferNotification = (
  transferRecord: TransferRecord,
): NotificationTimelineItem => {
  return {
    id: `scheduled-${transferRecord.id}`,
    title: translate("notifications.scheduledTransferTitle"),
    description:
      transferRecord.note?.trim() ||
      translate("notifications.scheduledTransferDescription"),
    timestamp: transferRecord.scheduledFor ?? transferRecord.createdAt,
    kind: "scheduled_transfer",
  };
};
