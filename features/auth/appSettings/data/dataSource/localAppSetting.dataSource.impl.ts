import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import type { AppSettingModel } from "./appSetting.model";
import { AppSettingDataSource } from "./appSetting.dataSource";


const APP_SETTING_TABLE = "app_settings";

type DefaultAppSetting = {
  selectedLanguage: string;
  onboardingCompleted: boolean;
  activeProfileId: string | null;
  lastSelectedCountryIso: string;
};

const getDefaultAppSetting = (): DefaultAppSetting => ({
  selectedLanguage: "en",
  onboardingCompleted: false,
  activeProfileId: null,
  lastSelectedCountryIso: "NP",
});

const getCollection = (database: Database) => {
  return database.get<AppSettingModel>(APP_SETTING_TABLE);
};

const getExistingRecord = async (
  database: Database,
): Promise<AppSettingModel | null> => {
  const records = await getCollection(database).query().fetch();
  return records[0] ?? null;
};

const createRecord = async (
  database: Database,
  input: DefaultAppSetting,
): Promise<AppSettingModel> => {
  const timestamp = Date.now();

  return database.write(async () => {
    return getCollection(database).create((record: AppSettingModel) => {
      record.selectedLanguage = input.selectedLanguage;
      record.onboardingCompleted = input.onboardingCompleted;
      record.activeProfileId = input.activeProfileId;
      record.lastSelectedCountryIso = input.lastSelectedCountryIso;
      record.createdAt = timestamp;
      record.updatedAt = timestamp;
    });
  });
};

const getOrCreateRecord = async (
  database: Database,
): Promise<AppSettingModel> => {
  const existingRecord = await getExistingRecord(database);

  if (existingRecord) {
    return existingRecord;
  }

  return createRecord(database, getDefaultAppSetting());
};

export const createLocalAppSettingDataSource = (
  database: Database,
): AppSettingDataSource => ({
  async getAppSetting(): Promise<Result<AppSettingModel | null>> {
    try {
      const appSetting = await getExistingRecord(database);
      return { success: true, value: appSetting };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to load app setting"),
      };
    }
  },

  async createDefaultAppSetting(): Promise<Result<AppSettingModel>> {
    try {
      const appSetting = await getOrCreateRecord(database);
      return { success: true, value: appSetting };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to create app setting"),
      };
    }
  },

  async updateSelectedLanguage(languageCode: string): Promise<Result<void>> {
    try {
      const appSetting = await getOrCreateRecord(database);

      await database.write(async () => {
        await appSetting.update((record: AppSettingModel) => {
          record.selectedLanguage = languageCode;
          record.updatedAt = Date.now();
        });
      });

      return { success: true, value: undefined };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to update selected language"),
      };
    }
  },
});
