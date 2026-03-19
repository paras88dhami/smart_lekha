import type { Result } from "@/shared/types/result.types";
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

const mapUnknownError = (error: unknown, message: string): Error => {
  return error instanceof Error ? error : new Error(message);
};

export const createLocalAuthSessionDataSource = (
  database: Database,
): AuthSessionDataSource => ({
  async getCurrentSession(): Promise<Result<AuthSessionModel | null>> {
    try {
      const session = await getFirstSession(database);

      return {
        success: true,
        value: session,
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to load auth session."),
      };
    }
  },

  async upsertSession(payload: AuthSessionModel): Promise<Result<AuthSessionModel>> {
    try {
      const existingSession = await getFirstSession(database);
      const timestamp = Date.now();

      if (existingSession) {
        await database.write(async () => {
          await existingSession.update((record: AuthSessionModel) => {
            record.accountId = payload.accountId ?? null;
            record.phoneNumber = payload.phoneNumber ?? "";
            record.countryCode = payload.countryCode ?? "";
            record.countryIso = payload.countryIso ?? "";
            record.isVerified = payload.isVerified ?? false;
            record.isLoggedIn = payload.isLoggedIn ?? false;
            record.accessToken = payload.accessToken ?? null;
            record.refreshToken = payload.refreshToken ?? null;
            record.updatedAt = timestamp;
          });
        });

        return {
          success: true,
          value: existingSession,
        };
      }

      const createdSession = await database.write(async () => {
        return getCollection(database).create((record: AuthSessionModel) => {
          record.accountId = payload.accountId ?? null;
          record.phoneNumber = payload.phoneNumber ?? "";
          record.countryCode = payload.countryCode ?? "";
          record.countryIso = payload.countryIso ?? "";
          record.isVerified = payload.isVerified ?? false;
          record.isLoggedIn = payload.isLoggedIn ?? false;
          record.accessToken = payload.accessToken ?? null;
          record.refreshToken = payload.refreshToken ?? null;
          record.createdAt = timestamp;
          record.updatedAt = timestamp;
        });
      });

      return {
        success: true,
        value: createdSession,
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to upsert auth session."),
      };
    }
  },

  async clearSession(): Promise<Result<void>> {
    try {
      const sessions = await getCollection(database).query().fetch();

      await database.write(async () => {
        for (const session of sessions) {
          await session.destroyPermanently();
        }
      });

      return {
        success: true,
        value: undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error, "Failed to clear auth session."),
      };
    }
  },
});
