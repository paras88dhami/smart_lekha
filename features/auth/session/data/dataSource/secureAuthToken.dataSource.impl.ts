import type { Result } from "@/shared/types/result.types";
import * as SecureStore from "expo-secure-store";
import type {
  AuthTokenDataSource,
  AuthTokenModel,
} from "./authToken.dataSource";

const ACCESS_TOKEN_KEY = "khata.auth.accessToken";
const REFRESH_TOKEN_KEY = "khata.auth.refreshToken";

const mapUnknownError = (error: unknown): Error => {
  return error instanceof Error
    ? error
    : new Error("Failed to manage auth tokens securely.");
};

const readTrimmedValue = (value: string | null): string | null => {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
};

const upsertToken = async (key: string, value: string | null): Promise<void> => {
  if (!value) {
    await SecureStore.deleteItemAsync(key);
    return;
  }

  await SecureStore.setItemAsync(key, value);
};

export const createSecureAuthTokenDataSource = (): AuthTokenDataSource => ({
  async getTokens(): Promise<Result<AuthTokenModel | null>> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
      ]);

      const normalizedAccessToken = readTrimmedValue(accessToken);
      const normalizedRefreshToken = readTrimmedValue(refreshToken);

      if (!normalizedAccessToken && !normalizedRefreshToken) {
        return {
          success: true,
          value: null,
        };
      }

      return {
        success: true,
        value: {
          accessToken: normalizedAccessToken,
          refreshToken: normalizedRefreshToken,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error),
      };
    }
  },

  async setTokens(tokens: AuthTokenModel): Promise<Result<void>> {
    try {
      const accessToken = readTrimmedValue(tokens.accessToken);
      const refreshToken = readTrimmedValue(tokens.refreshToken);

      await Promise.all([
        upsertToken(ACCESS_TOKEN_KEY, accessToken),
        upsertToken(REFRESH_TOKEN_KEY, refreshToken),
      ]);

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

  async clearTokens(): Promise<Result<void>> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      ]);

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
