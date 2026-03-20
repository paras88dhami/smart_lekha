import { PaymentRecordModel } from "../paymentRecord.model";
import { paymentRecordTable } from "../paymentRecord.schema";

export const paymentRecordDbConfig = {
  models: [PaymentRecordModel],
  tables: [paymentRecordTable],
};
