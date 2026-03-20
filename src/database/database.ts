import { appSchema } from "@nozbe/watermelondb";
import { appSettingsDbConfig } from "@/features/auth/appSettings/data/dataSource/db/appSettingsDbConfig";
import { authSessionDbConfig } from "@/features/auth/session/data/dataSource/db/authSessionDbConfig";
import { profileDbConfig } from "@/features/auth/profile/data/dataSource/db/profileDbConfig";
import { businessCategoryDbConfig } from "@/features/auth/businessCategory/data/dataSource/db/businessCategoryDbConfig";
import { otpRequestDbConfig } from "@/features/auth/otp/data/dataSource/db/otpRequestDbConfig";
import { financeAccountDbConfig } from "@/features/finance/account/data/dataSource/db/financeAccountDbConfig";
import { financeTransactionDbConfig } from "@/features/finance/transaction/data/dataSource/db/financeTransactionDbConfig";
import { homeShortcutDbConfig } from "@/features/home/shortcut/data/dataSource/db/homeShortcutDbConfig";
import { transferBeneficiaryDbConfig } from "@/features/transfers/beneficiary/data/dataSource/db/transferBeneficiaryDbConfig";
import { transferRecordDbConfig } from "@/features/transfers/record/data/dataSource/db/transferRecordDbConfig";
import { posItemDbConfig } from "@/features/pos/item/data/dataSource/db/posItemDbConfig";
import { posSaleDbConfig } from "@/features/pos/sale/data/dataSource/db/posSaleDbConfig";
import { createDatabase } from "@/shared/database/createDatabase";
import { quickPosSlotDbConfig } from "@/features/transactions/quickPos/slot/data/dataSource/db/quickPosSlotDbConfig";
import { migrations } from "./migration";
import { seedDefaultAppSettings } from "./seed/seedDefaultAppSettings";
import { seedBusinessCategories } from "./seed/seedBusinessCategories";

const schema = appSchema({
  version: 5,
  tables: [
    ...appSettingsDbConfig.tables,
    ...authSessionDbConfig.tables,
    ...profileDbConfig.tables,
    ...businessCategoryDbConfig.tables,
    ...otpRequestDbConfig.tables,
    ...financeAccountDbConfig.tables,
    ...financeTransactionDbConfig.tables,
    ...homeShortcutDbConfig.tables,
    ...transferBeneficiaryDbConfig.tables,
    ...transferRecordDbConfig.tables,
    ...posItemDbConfig.tables,
    ...posSaleDbConfig.tables,
    ...quickPosSlotDbConfig.tables,
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
    ...financeAccountDbConfig.models,
    ...financeTransactionDbConfig.models,
    ...homeShortcutDbConfig.models,
    ...transferBeneficiaryDbConfig.models,
    ...transferRecordDbConfig.models,
    ...posItemDbConfig.models,
    ...posSaleDbConfig.models,
    ...quickPosSlotDbConfig.models,
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
