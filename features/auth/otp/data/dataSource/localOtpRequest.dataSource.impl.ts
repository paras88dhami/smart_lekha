import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type { OtpRequestDataSource } from "./otpRequest.dataSource";
import type { OtpRequestModel } from "./otpRequest.model";

const getCollection = (database: Database) => {
  return database.get<OtpRequestModel>("otp_requests");
};

const mapUnknownError = (error: unknown): Error => {
  return error instanceof Error
    ? error
    : new Error("Failed to manage otp requests.");
};

const getRequestByReferenceId = async (
  database: Database,
  otpReferenceId: string,
): Promise<OtpRequestModel | null> => {
  const records = await getCollection(database)
    .query(Q.where("otp_reference_id", otpReferenceId))
    .fetch();

  return records[0] ?? null;
};

export const createLocalOtpRequestDataSource = (
  database: Database,
): OtpRequestDataSource => ({
  async upsertOtpRequest(payload: OtpRequestModel): Promise<Result<OtpRequestModel>> {
    try {
      const otpReferenceId = payload.otpReferenceId ?? "";
      const existingRecord = await getRequestByReferenceId(database, otpReferenceId);
      const timestamp = Date.now();

      if (existingRecord) {
        await database.write(async () => {
          await existingRecord.update((record: OtpRequestModel) => {
            record.phoneNumber = payload.phoneNumber ?? "";
            record.countryCode = payload.countryCode ?? "";
            record.countryIso = payload.countryIso ?? "NP";
            record.expiresAt = payload.expiresAt ?? 0;
            record.isConsumed = false;
            record.updatedAt = timestamp;
          });
        });

        return {
          success: true,
          value: existingRecord,
        };
      }

      const createdRecord = await database.write(async () => {
        return getCollection(database).create((record: OtpRequestModel) => {
          record.phoneNumber = payload.phoneNumber ?? "";
          record.countryCode = payload.countryCode ?? "";
          record.countryIso = payload.countryIso ?? "NP";
          record.otpReferenceId = payload.otpReferenceId ?? "";
          record.expiresAt = payload.expiresAt ?? 0;
          record.isConsumed = false;
          record.createdAt = timestamp;
          record.updatedAt = timestamp;
        });
      });

      return {
        success: true,
        value: createdRecord,
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error),
      };
    }
  },

  async getOtpRequestByReferenceId(
    otpReferenceId: string,
  ): Promise<Result<OtpRequestModel | null>> {
    try {
      const record = await getRequestByReferenceId(database, otpReferenceId);

      return {
        success: true,
        value: record,
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error),
      };
    }
  },

  async markOtpRequestConsumed(otpReferenceId: string): Promise<Result<void>> {
    try {
      const record = await getRequestByReferenceId(database, otpReferenceId);

      if (!record) {
        return {
          success: true,
          value: undefined,
        };
      }

      await database.write(async () => {
        await record.update((currentRecord: OtpRequestModel) => {
          currentRecord.isConsumed = true;
          currentRecord.updatedAt = Date.now();
        });
      });

      return {
        success: true,
        value: undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error),
      };
    }
  },
});