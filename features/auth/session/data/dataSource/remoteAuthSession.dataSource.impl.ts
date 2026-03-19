import type { Result } from "@/shared/types/result.types";
import type {
  AuthSessionRemoteDataSource,
  AuthSessionRemoteError,
  AuthSessionRemoteErrorCode,
  RefreshSessionRemoteInput,
  RefreshSessionRemoteOutput,
} from "./authSessionRemote.dataSource";

const REFRESH_SESSION_ENDPOINT = "/auth/session/refresh";
const DEFAULT_TIMEOUT_MS = 15000;

type JsonRecord = Record<string, unknown>;

const isJsonRecord = (value: unknown): value is JsonRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const getPayload = (responseBody: unknown): JsonRecord => {
  if (!isJsonRecord(responseBody)) {
    return {};
  }

  const bodyData = responseBody.data;

  if (isJsonRecord(bodyData)) {
    return bodyData;
  }

  return responseBody;
};

const readString = (
  record: JsonRecord,
  keys: string[],
): string | undefined => {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
};

const normalizeRemoteErrorCode = (
  rawErrorCode: string | undefined,
): AuthSessionRemoteErrorCode => {
  if (!rawErrorCode) {
    return "UNKNOWN";
  }

  const normalized = rawErrorCode.trim().toUpperCase();

  if (normalized === "UNAUTHORIZED" || normalized === "INVALID_TOKEN") {
    return "UNAUTHORIZED";
  }

  if (normalized === "SERVICE_NOT_CONFIGURED") {
    return "SERVICE_NOT_CONFIGURED";
  }

  if (normalized === "SERVICE_UNAVAILABLE") {
    return "SERVICE_UNAVAILABLE";
  }

  return "UNKNOWN";
};

const toRemoteError = (
  code: AuthSessionRemoteErrorCode,
  message: string,
  status?: number,
): AuthSessionRemoteError => ({
  code,
  message,
  status,
});

const getAuthApiBaseUrl = (): string => {
  const processObject = (
    globalThis as { process?: { env?: Record<string, string | undefined> } }
  ).process;
  const rawBaseUrl = processObject?.env?.EXPO_PUBLIC_AUTH_API_BASE_URL?.trim() ?? "";

  if (!rawBaseUrl) {
    return "";
  }

  try {
    const url = new URL(rawBaseUrl);
    const isHttps = url.protocol === "https:";
    const isDevHttpAllowed = __DEV__ && url.protocol === "http:";

    if (!isHttps && !isDevHttpAllowed) {
      return "";
    }

    return rawBaseUrl.replace(/\/+$/, "");
  } catch {
    return "";
  }
};

const mapHttpError = (
  status: number,
  responseBody: unknown,
): AuthSessionRemoteError => {
  const payload = getPayload(responseBody);
  const explicitCode = normalizeRemoteErrorCode(
    readString(payload, ["errorCode", "code", "type"]),
  );

  const code =
    explicitCode !== "UNKNOWN"
      ? explicitCode
      : status === 401 || status === 403
        ? "UNAUTHORIZED"
        : status >= 500
          ? "SERVICE_UNAVAILABLE"
          : "UNKNOWN";

  const message =
    readString(payload, ["message", "error", "detail"]) ??
    "Session refresh failed.";

  return toRemoteError(code, message, status);
};

const postJson = async (
  endpointPath: string,
  body: JsonRecord,
): Promise<Result<unknown, AuthSessionRemoteError>> => {
  const baseUrl = getAuthApiBaseUrl();

  if (!baseUrl) {
    return {
      success: false,
      error: toRemoteError(
        "SERVICE_NOT_CONFIGURED",
        "EXPO_PUBLIC_AUTH_API_BASE_URL is missing or insecure for this build.",
      ),
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}${endpointPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    let parsedBody: unknown = null;

    try {
      parsedBody = await response.json();
    } catch {
      parsedBody = null;
    }

    if (!response.ok) {
      return {
        success: false,
        error: mapHttpError(response.status, parsedBody),
      };
    }

    return {
      success: true,
      value: parsedBody,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        error: toRemoteError(
          "SERVICE_UNAVAILABLE",
          "Session refresh timed out. Please try again.",
        ),
      };
    }

    return {
      success: false,
      error: toRemoteError(
        "SERVICE_UNAVAILABLE",
        "Unable to connect to auth service.",
      ),
    };
  } finally {
    clearTimeout(timeoutId);
  }
};

const mapRefreshSessionOutput = (
  responseBody: unknown,
): RefreshSessionRemoteOutput => {
  const payload = getPayload(responseBody);

  return {
    accountId: readString(payload, ["accountId", "userId", "id"]) ?? "",
    accessToken: readString(payload, ["accessToken", "token"]) ?? "",
    refreshToken: readString(payload, ["refreshToken"]) ?? "",
  };
};

export const createRemoteAuthSessionDataSource = (): AuthSessionRemoteDataSource => ({
  async refreshSession(
    input: RefreshSessionRemoteInput,
  ): Promise<Result<RefreshSessionRemoteOutput, AuthSessionRemoteError>> {
    const result = await postJson(REFRESH_SESSION_ENDPOINT, {
      refreshToken: input.refreshToken,
    });

    if (!result.success) {
      return result;
    }

    const output = mapRefreshSessionOutput(result.value);

    if (!output.accessToken || !output.refreshToken) {
      return {
        success: false,
        error: toRemoteError(
          "UNKNOWN",
          "Invalid session refresh response from auth service.",
        ),
      };
    }

    return {
      success: true,
      value: output,
    };
  },
});
