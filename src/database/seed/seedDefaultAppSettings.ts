import { Database } from "@nozbe/watermelondb";
import type { AppSettingModel } from "@/features/auth/appSettings/data/dataSource/appSetting.model";

export async function seedDefaultAppSettings(database: Database): Promise<void> {
  const collection = database.get<AppSettingModel>("app_settings");
  const existingRows = await collection.query().fetch();

  if (existingRows.length > 0) {
    return;
  }

  const timestamp = Date.now();

  await database.write(async () => {
    await collection.create((record: AppSettingModel) => {
      record.selectedLanguage = "en";
      record.onboardingCompleted = false;
      record.activeProfileId = null;
      record.activeAccountId = null;
      record.lastSelectedCountryIso = "NP";
      record.createdAt = timestamp;
      record.updatedAt = timestamp;
    });
  });
}
