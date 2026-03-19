import { appSchema } from "@nozbe/watermelondb";
import { appSettingsDbConfig } from "@/features/auth/appSettings/data/dataSource/db/appSettingsDbConfig";
import { authSessionDbConfig } from "@/features/auth/session/data/dataSource/db/authSessionDbConfig";
import { profileDbConfig } from "@/features/auth/profile/data/dataSource/db/profileDbConfig";
import { businessCategoryDbConfig } from "@/features/auth/businessCategory/data/dataSource/db/businessCategoryDbConfig";
import { otpRequestDbConfig } from "@/features/auth/otp/data/dataSource/db/otpRequestDbConfig";
import { createDatabase } from "@/shared/database/createDatabase";
import { migrations } from "./migration";
import { seedDefaultAppSettings } from "./seed/seedDefaultAppSettings";
import { seedBusinessCategories } from "./seed/seedBusinessCategories";

const schema = appSchema({
  version: 3,
  tables: [
    ...appSettingsDbConfig.tables,
    ...authSessionDbConfig.tables,
    ...profileDbConfig.tables,
    ...businessCategoryDbConfig.tables,
    ...otpRequestDbConfig.tables,
  ],
});

export const database = createDatabase({
  schema,
  models: [
    ...appSettingsDbConfig.models,
    ...authSessionDbConfig.models,
    ...profileDbConfig.models,
    ...businessCategoryDbConfig.models,
    ...otpRequestDbConfig.models,
  ],
  migrations,
});

export const runAuthSeeds = async (): Promise<void> => {
  try {
    await seedDefaultAppSettings(database);
    await seedBusinessCategories(database);
  } catch (error) {
    console.error("Auth database seed failed", error);
  }
};

export default database;
