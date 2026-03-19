import { PosItemModel } from "../posItem.model";
import { posItemTable } from "../posItem.schema";

export const posItemDbConfig = {
  models: [PosItemModel],
  tables: [posItemTable],
};
