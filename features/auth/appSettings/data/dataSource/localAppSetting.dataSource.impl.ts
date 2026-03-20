import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import type { AppSettingDataSource } from "./appSetting.dataSource";
import type { AppSettingModel } from "./appSetting.model";

const APP_SETTING_TABLE = "app_settings";

type DefaultAppSetting = {
  selectedLanguage: string;
  onboardingCompleted: boolean;
  activeProfileId: string | null;
  activeAccountId: string | null;
  lastSelectedCountryIso: string;
};

const createDefaultAppSettingInput = (): DefaultAppSetting => ({
  selectedLanguage: "en",
  onboardingCompleted: false,
  activeProfileId: null,
  activeAccountId: null,
  lastSelectedCountryIso: "NP",
});

const getAppSettingCollection = (database: Database) =>
  database.get<AppSettingModel>(APP_SETTING_TABLE);

const getFirstAppSettingRecord = async (
  database: Database,
): Promise<AppSettingModel | null> => {
  const records = await getAppSettingCollection(database).query().fetch();
  return records[0] ?? null;
};

const createAppSettingRecord = async (
  database: Database,
  input: DefaultAppSetting,
): Promise<AppSettingModel> => {
  const createdTimestamp = Date.now();

  return database.write(async (): Promise<AppSettingModel> => {
    return getAppSettingCollection(database).create(
      (record: AppSettingModel) => {
        record.selectedLanguage = input.selectedLanguage;
        record.onboardingCompleted = input.onboardingCompleted;
        record.activeProfileId = input.activeProfileId;
        record.activeAccountId = input.activeAccountId;
        record.lastSelectedCountryIso = input.lastSelectedCountryIso;
        record.createdAt = createdTimestamp;
        record.updatedAt = createdTimestamp;
      },
    );
  });
};

const getOrCreateAppSettingRecord = async (
  database: Database,
): Promise<AppSettingModel> => {
  const existingRecord = await getFirstAppSettingRecord(database);

  if (existingRecord) {
    return existingRecord;
  }

  return createAppSettingRecord(database, createDefaultAppSettingInput());
};

const mapUnknownError = (error: unknown, fallbackMessage: string): Error => {
  return error instanceof Error ? error : new Error(fallbackMessage);
};

export const createLocalAppSettingDataSource = (
  database: Database,
): AppSettingDataSource => ({
  async getAppSetting(): Promise<Result<AppSettingModel | null>> {
    try {
      const appSetting = await getFirstAppSettingRecord(database);
      return { success: true, value: appSetting };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to load app setting."),
      };
    }
  },

  async createDefaultAppSetting(): Promise<Result<AppSettingModel>> {
    try {
      const appSetting = await getOrCreateAppSettingRecord(database);
      return { success: true, value: appSetting };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to create app setting."),
      };
    }
  },

  async updateSelectedLanguage(languageCode: string): Promise<Result<void>> {
    try {
      const appSetting = await getOrCreateAppSettingRecord(database);

      await database.write(async (): Promise<void> => {
        await appSetting.update((record: AppSettingModel) => {
          record.selectedLanguage = languageCode;
          record.updatedAt = Date.now();
        });
      });

      return { success: true, value: undefined };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to update selected language."),
      };
    }
  },

  async completeOnboarding(): Promise<Result<void>> {
    try {
      const appSetting = await getOrCreateAppSettingRecord(database);

      await database.write(async (): Promise<void> => {
        await appSetting.update((record: AppSettingModel) => {
          record.onboardingCompleted = true;
          record.updatedAt = Date.now();
        });
      });

      return { success: true, value: undefined };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to complete onboarding."),
      };
    }
  },

  async setActiveProfileId(profileId: string): Promise<Result<void>> {
    try {
      const appSetting = await getOrCreateAppSettingRecord(database);

      await database.write(async (): Promise<void> => {
        await appSetting.update((record: AppSettingModel) => {
          record.activeProfileId = profileId;
          record.updatedAt = Date.now();
        });
      });

      return { success: true, value: undefined };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to set active profile."),
      };
    }
  },

  async clearActiveProfileId(): Promise<Result<void>> {
    try {
      const appSetting = await getOrCreateAppSettingRecord(database);

      await database.write(async (): Promise<void> => {
        await appSetting.update((record: AppSettingModel) => {
          record.activeProfileId = null;
          record.updatedAt = Date.now();
        });
      });

      return { success: true, value: undefined };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to clear active profile."),
      };
    }
  },

  async setActiveAccountId(accountId: string): Promise<Result<void>> {
    try {
      const appSetting = await getOrCreateAppSettingRecord(database);

      await database.write(async (): Promise<void> => {
        await appSetting.update((record: AppSettingModel) => {
          record.activeAccountId = accountId;
          record.updatedAt = Date.now();
        });
      });

      return { success: true, value: undefined };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to set active account."),
      };
    }
  },

  async clearActiveAccountId(): Promise<Result<void>> {
    try {
      const appSetting = await getOrCreateAppSettingRecord(database);

      await database.write(async (): Promise<void> => {
        await appSetting.update((record: AppSettingModel) => {
          record.activeAccountId = null;
          record.updatedAt = Date.now();
        });
      });

      return { success: true, value: undefined };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to clear active account."),
      };
    }
  },

  async updateLastSelectedCountryIso(countryIso: string): Promise<Result<void>> {
    try {
      const appSetting = await getOrCreateAppSettingRecord(database);

      await database.write(async (): Promise<void> => {
        await appSetting.update((record: AppSettingModel) => {
          record.lastSelectedCountryIso = countryIso;
          record.updatedAt = Date.now();
        });
      });

      return { success: true, value: undefined };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(
          error,
          "Failed to update last selected country.",
        ),
      };
    }
  },
});
