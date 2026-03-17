import { BusinessProfileModel } from "../businessProfile.model";
import { businessProfileTable } from "../businessProfile.schema";

export const businessProfileDbConfig = {
  models: [BusinessProfileModel],
  tables: [businessProfileTable],
};
