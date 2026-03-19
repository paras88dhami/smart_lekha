import type { Result } from "@/shared/types/result.types";
import type { TransferRecordType } from "./transferRecord.model";
import type { TransferRecordModel } from "./transferRecord.model";

export interface TransferRecordDataSource {
  getByProfileAndType(
    profileId: string,
    recordType: TransferRecordType,
    limit: number,
  ): Promise<Result<TransferRecordModel[]>>;
  createRecord(payload: TransferRecordModel): Promise<Result<TransferRecordModel>>;
}
