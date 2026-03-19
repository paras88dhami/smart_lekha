import type { Database } from "@nozbe/watermelondb";
import type { AuthSessionDataSource } from "./authSession.datasource";
import type { AuthSessionModel } from "./authSession.model";

const getCollection = (database: Database) => {
  return database.get<AuthSessionModel>("auth_session");
};

const getFirstSession = async (
  database: Database,
): Promise<AuthSessionModel | null> => {
  const records = await getCollection(database).query().fetch();
  return records[0] ?? null;
};

export const createLocalAuthSessionDataSource = (
  database: Database,
): AuthSessionDataSource => ({
  async getCurrentSession(): Promise<AuthSessionModel | null> {
    return getFirstSession(database);
  },

  async upsertSession(input): Promise<AuthSessionModel> {
    const existingSession = await getFirstSession(database);
    const timestamp = Date.now();

    if (existingSession) {
      await database.write(async () => {
        await existingSession.update((record: AuthSessionModel) => {
          record.accountId = input.accountId;
          record.phoneNumber = input.phoneNumber;
          record.countryCode = input.countryCode;
          record.countryIso = input.countryIso;
          record.isVerified = input.isVerified;
          record.isLoggedIn = input.isLoggedIn;
          record.accessToken = input.accessToken ?? null;
          record.refreshToken = input.refreshToken ?? null;
          record.updatedAt = timestamp;
        });
      });

      return existingSession;
    }

    return database.write(async () => {
      return getCollection(database).create((record: AuthSessionModel) => {
        record.accountId = input.accountId;
        record.phoneNumber = input.phoneNumber;
        record.countryCode = input.countryCode;
        record.countryIso = input.countryIso;
        record.isVerified = input.isVerified;
        record.isLoggedIn = input.isLoggedIn;
        record.accessToken = input.accessToken ?? null;
        record.refreshToken = input.refreshToken ?? null;
        record.createdAt = timestamp;
        record.updatedAt = timestamp;
      });
    });
  },

  async clearSession(): Promise<void> {
    const sessions = await getCollection(database).query().fetch();

    await database.write(async () => {
      for (const session of sessions) {
        await session.markAsDeleted();
      }
    });
  },
});
