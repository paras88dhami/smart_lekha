import type { Result } from "@/shared/types/result.types";
import type {
  CreateFinanceTransactionInput,
  FinanceSummary,
  FinanceTransaction,
} from "../../types/types";
import type { FinanceTransactionDataSource } from "../dataSource/financeTransaction.dataSource";
import type { FinanceTransactionModel } from "../dataSource/financeTransaction.model";
import type { FinanceTransactionRepository } from "./financeTransaction.repository";

const mapTransaction = (record: FinanceTransactionModel): FinanceTransaction => {
  return {
    id: record.id,
    profileId: record.profileId?.trim() ?? "",
    accountId: record.accountId?.trim() ?? null,
    entryType: record.entryType ?? "expense",
    categoryName: record.categoryName?.trim() ?? null,
    counterpartyName: record.counterpartyName?.trim() ?? null,
    note: record.note?.trim() ?? null,
    status: record.status ?? "success",
    amount: record.amount ?? 0,
    occurredAt: record.occurredAt ?? record.createdAt ?? Date.now(),
    referenceId: record.referenceId?.trim() ?? null,
  };
};

const toPayload = (input: CreateFinanceTransactionInput): FinanceTransactionModel => {
  return {
    profileId: input.profileId.trim(),
    accountId: input.accountId?.trim() ?? null,
    entryType: input.entryType,
    categoryName: input.categoryName?.trim() ?? null,
    counterpartyName: input.counterpartyName?.trim() ?? null,
    note: input.note?.trim() ?? null,
    status: input.status,
    amount: Math.max(0, input.amount),
    occurredAt: input.occurredAt,
    referenceId: input.referenceId?.trim() ?? null,
  } as FinanceTransactionModel;
};

const createFailure = <T>(error: Error): Result<T> => ({
  success: false,
  error,
});

export const createFinanceTransactionRepository = (
  localDataSource: FinanceTransactionDataSource,
): FinanceTransactionRepository => ({
  async getRecentByProfileId(
    profileId: string,
    limit: number,
  ): Promise<Result<FinanceTransaction[]>> {
    const result = await localDataSource.getRecentByProfileId(profileId.trim(), limit);

    if (!result.success) {
      return createFailure<FinanceTransaction[]>(result.error);
    }

    return {
      success: true,
      value: result.value.map(mapTransaction),
    };
  },

  async getByProfileId(
    profileId: string,
    limit: number,
  ): Promise<Result<FinanceTransaction[]>> {
    const result = await localDataSource.getByProfileId(profileId.trim(), limit);

    if (!result.success) {
      return createFailure<FinanceTransaction[]>(result.error);
    }

    return {
      success: true,
      value: result.value.map(mapTransaction),
    };
  },

  async createTransaction(
    input: CreateFinanceTransactionInput,
  ): Promise<Result<FinanceTransaction>> {
    const result = await localDataSource.createTransaction(toPayload(input));

    if (!result.success) {
      return createFailure<FinanceTransaction>(result.error);
    }

    return {
      success: true,
      value: mapTransaction(result.value),
    };
  },

  async getSummaryByProfileId(profileId: string): Promise<Result<FinanceSummary>> {
    return localDataSource.getSummaryByProfileId(profileId.trim());
  },
});
