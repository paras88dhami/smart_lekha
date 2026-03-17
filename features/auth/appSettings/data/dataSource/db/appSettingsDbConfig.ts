import { AppSettingModel } from "../appSetting.model";
import { appSettingTable } from "../appSetting.schema";

export const appSettingsDbConfig = {
  models: [AppSettingModel],
  tables: [appSettingTable],
};
