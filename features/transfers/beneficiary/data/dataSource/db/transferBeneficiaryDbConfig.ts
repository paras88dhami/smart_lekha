import { TransferBeneficiaryModel } from "../transferBeneficiary.model";
import { transferBeneficiaryTable } from "../transferBeneficiary.schema";

export const transferBeneficiaryDbConfig = {
  models: [TransferBeneficiaryModel],
  tables: [transferBeneficiaryTable],
};
