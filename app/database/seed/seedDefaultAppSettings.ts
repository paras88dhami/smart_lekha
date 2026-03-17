import { Database } from "@nozbe/watermelondb";

export async function seedDefaultAppSettings(database: Database): Promise<void> {
  const collection = database.get("app_settings");
  const existingRows = await collection.query().fetch();

  if (existingRows.length > 0) {
    return;
  }

  const timestamp = Date.now();

  await database.write(async () => {
    await collection.create((record: any) => {
      record.selectedLanguage = "en";
      record.onboardingCompleted = false;
      record.activeProfileId = null;
      record.lastSelectedCountryIso = "NP";
      record.createdAt = timestamp;
      record.updatedAt = timestamp;
    });
  });
}
