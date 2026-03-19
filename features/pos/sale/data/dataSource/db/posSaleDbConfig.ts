import { PosSaleModel } from "../posSale.model";
import { posSaleTable } from "../posSale.schema";

export const posSaleDbConfig = {
  models: [PosSaleModel],
  tables: [posSaleTable],
};
