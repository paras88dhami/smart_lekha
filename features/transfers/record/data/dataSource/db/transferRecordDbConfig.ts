import { TransferRecordModel } from "../transferRecord.model";
import { transferRecordTable } from "../transferRecord.schema";

export const transferRecordDbConfig = {
  models: [TransferRecordModel],
  tables: [transferRecordTable],
};
