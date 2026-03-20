import { QuickPosCategorySlotModel } from "../quickPosCategorySlot.model";
import { quickPosCategorySlotTable } from "../quickPosCategorySlot.schema";
import { QuickPosProductSlotModel } from "../quickPosProductSlot.model";
import { quickPosProductSlotTable } from "../quickPosProductSlot.schema";

export const quickPosSlotDbConfig = {
  models: [QuickPosCategorySlotModel, QuickPosProductSlotModel],
  tables: [quickPosCategorySlotTable, quickPosProductSlotTable],
};
