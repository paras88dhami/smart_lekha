import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type { FinanceSummary } from "../../types/types";
import type { FinanceTransactionDataSource } from "./financeTransaction.dataSource";
import type {
  FinanceEntryType,
  FinanceTransactionModel,
} from "./financeTransaction.model";

const getCollection = (database: Database) => {
  return database.get<FinanceTransactionModel>("finance_transactions");
};

const INFLOW_TYPES: FinanceEntryType[] = [
  "income",
  "payment_in",
  "transfer_in",
  "pos_sale",
];

const OUTFLOW_TYPES: FinanceEntryType[] = ["expense", "payment_out", "transfer_out"];

const isSameDay = (timestamp: number, referenceDate: Date): boolean => {
  const date = new Date(timestamp);

  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth() &&
    date.getDate() === referenceDate.getDate()
  );
};

const mapUnknownError = (error: unknown, fallbackMessage: string): Error => {
  return error instanceof Error ? error : new Error(fallbackMessage);
};

export const createLocalFinanceTransactionDataSource = (
  database: Database,
): FinanceTransactionDataSource => ({
  async getRecentByProfileId(
    profileId: string,
    limit: number,
  ): Promise<Result<FinanceTransactionModel[]>> {
    try {
      const records = await getCollection(database)
        .query(
          Q.where("profile_id", profileId),
          Q.sortBy("occurred_at", Q.desc),
          Q.take(limit),
        )
        .fetch();

      return {
        success: true,
        value: records,
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to load recent transactions."),
      };
    }
  },

  async getByProfileId(
    profileId: string,
    limit: number,
  ): Promise<Result<FinanceTransactionModel[]>> {
    try {
      const records = await getCollection(database)
        .query(
          Q.where("profile_id", profileId),
          Q.sortBy("occurred_at", Q.desc),
          Q.take(limit),
        )
        .fetch();

      return {
        success: true,
        value: records,
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to load transactions."),
      };
    }
  },

  async createTransaction(
    payload: FinanceTransactionModel,
  ): Promise<Result<FinanceTransactionModel>> {
    try {
      const collection = getCollection(database);
      const timestamp = Date.now();

      const record = await database.write(async () => {
        return collection.create((currentRecord: FinanceTransactionModel) => {
          currentRecord.profileId = payload.profileId?.trim() ?? "";
          currentRecord.accountId = payload.accountId?.trim() ?? null;
          currentRecord.entryType = payload.entryType;
          currentRecord.categoryName = payload.categoryName?.trim() ?? null;
          currentRecord.counterpartyName = payload.counterpartyName?.trim() ?? null;
          currentRecord.note = payload.note?.trim() ?? null;
          currentRecord.status = payload.status;
          currentRecord.amount = payload.amount ?? 0;
          currentRecord.occurredAt = payload.occurredAt ?? timestamp;
          currentRecord.referenceId = payload.referenceId?.trim() ?? null;
          currentRecord.createdAt = timestamp;
          currentRecord.updatedAt = timestamp;
        });
      });

      return {
        success: true,
        value: record,
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to create transaction."),
      };
    }
  },

  async getSummaryByProfileId(profileId: string): Promise<Result<FinanceSummary>> {
    try {
      const records = await getCollection(database)
        .query(Q.where("profile_id", profileId))
        .fetch();

      const todayDate = new Date();
      let totalInflow = 0;
      let totalOutflow = 0;
      let todayInflow = 0;
      let todayOutflow = 0;

      for (const record of records) {
        const amount = Math.max(0, record.amount ?? 0);
        const entryType = record.entryType;

        if (!entryType) {
          continue;
        }

        if (INFLOW_TYPES.includes(entryType)) {
          totalInflow += amount;

          if (record.occurredAt && isSameDay(record.occurredAt, todayDate)) {
            todayInflow += amount;
          }

          continue;
        }

        if (OUTFLOW_TYPES.includes(entryType)) {
          totalOutflow += amount;

          if (record.occurredAt && isSameDay(record.occurredAt, todayDate)) {
            todayOutflow += amount;
          }
        }
      }

      return {
        success: true,
        value: {
          totalInflow,
          totalOutflow,
          currentNet: totalInflow - totalOutflow,
          todayInflow,
          todayOutflow,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to calculate transaction summary."),
      };
    }
  },
});
