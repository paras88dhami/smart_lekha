import type { Result } from "@/shared/types/result.types";
import type {
  OtpAuthRemoteDataSource,
  OtpRemoteError,
  OtpRemoteErrorCode,
  RequestOtpRemoteInput,
  RequestOtpRemoteOutput,
  VerifyOtpRemoteInput,
  VerifyOtpRemoteOutput,
} from "./otpAuthRemote.dataSource";

const REQUEST_OTP_ENDPOINT = "/auth/otp/request";
const VERIFY_OTP_ENDPOINT = "/auth/otp/verify";
const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_OTP_EXPIRES_IN_MS = 5 * 60 * 1000;

type JsonRecord = Record<string, unknown>;

const isJsonRecord = (value: unknown): value is JsonRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

const readNumber = (
  record: JsonRecord,
  keys: string[],
): number | undefined => {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsedValue = Number(value);

      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return undefined;
};

const readBoolean = (
  record: JsonRecord,
  keys: string[],
): boolean | undefined => {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const normalizedValue = value.trim().toLowerCase();

      if (normalizedValue === "true") {
        return true;
      }

      if (normalizedValue === "false") {
        return false;
      }
    }
  }

  return undefined;
};

const parseTimestamp = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const numericValue = Number(value);

    if (Number.isFinite(numericValue)) {
      return numericValue;
    }

    const parsedDate = Date.parse(value);

    if (!Number.isNaN(parsedDate)) {
      return parsedDate;
    }
  }

  return undefined;
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

const toRemoteError = (
  code: OtpRemoteErrorCode,
  message: string,
  status?: number,
): OtpRemoteError => ({
  code,
  message,
  status,
});

const normalizeRemoteErrorCode = (
  rawErrorCode: string | undefined,
): OtpRemoteErrorCode => {
  if (!rawErrorCode) {
    return "UNKNOWN";
  }

  const normalized = rawErrorCode.trim().toUpperCase();

  switch (normalized) {
    case "INVALID_PHONE":
    case "INVALID_PHONE_NUMBER":
      return "INVALID_PHONE";
    case "INVALID_OTP":
    case "INVALID_OTP_CODE":
      return "INVALID_OTP";
    case "OTP_EXPIRED":
      return "OTP_EXPIRED";
    case "OTP_REQUEST_NOT_FOUND":
    case "REFERENCE_NOT_FOUND":
      return "OTP_REQUEST_NOT_FOUND";
    case "RATE_LIMITED":
    case "TOO_MANY_REQUESTS":
      return "RATE_LIMITED";
    case "SERVICE_NOT_CONFIGURED":
      return "SERVICE_NOT_CONFIGURED";
    case "SERVICE_UNAVAILABLE":
      return "SERVICE_UNAVAILABLE";
    default:
      return "UNKNOWN";
  }
};

const mapStatusToErrorCode = (status: number): OtpRemoteErrorCode => {
  if (status === 429) {
    return "RATE_LIMITED";
  }

  if (status >= 500) {
    return "SERVICE_UNAVAILABLE";
  }

  return "UNKNOWN";
};

const mapHttpError = (
  status: number,
  responseBody: unknown,
): OtpRemoteError => {
  const payload = getPayload(responseBody);
  const explicitCode = normalizeRemoteErrorCode(
    readString(payload, ["errorCode", "code", "type"]),
  );
  const code = explicitCode === "UNKNOWN" ? mapStatusToErrorCode(status) : explicitCode;
  const message =
    readString(payload, ["message", "error", "detail"]) ??
    "Auth request failed.";

  return toRemoteError(code, message, status);
};

const postJson = async (
  endpointPath: string,
  body: JsonRecord,
): Promise<Result<unknown, OtpRemoteError>> => {
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
          "Auth request timed out. Please try again.",
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

const mapRequestOtpOutput = (responseBody: unknown): RequestOtpRemoteOutput => {
  const payload = getPayload(responseBody);
  const otpReferenceId =
    readString(payload, ["otpReferenceId", "referenceId"]) ?? "";
  const expiresAtFromPayload = parseTimestamp(
    payload.expiresAt ?? payload.expiresAtMs ?? payload.expiryTimestamp,
  );
  const resendAfterSeconds =
    readNumber(payload, ["resendAfterSeconds", "retryAfterSeconds"]) ?? 30;
  const isExistingUser =
    readBoolean(payload, ["isExistingUser", "existingUser"]) ?? false;

  return {
    otpReferenceId,
    expiresAt: expiresAtFromPayload ?? Date.now() + DEFAULT_OTP_EXPIRES_IN_MS,
    resendAfterSeconds,
    isExistingUser,
  };
};

const mapVerifyOtpOutput = (responseBody: unknown): VerifyOtpRemoteOutput => {
  const payload = getPayload(responseBody);
  const accountId =
    readString(payload, ["accountId", "userId", "id"]) ?? "";
  const accessToken = readString(payload, ["accessToken", "token"]) ?? null;
  const refreshToken = readString(payload, ["refreshToken"]) ?? null;
  const isExistingUser =
    readBoolean(payload, ["isExistingUser", "existingUser"]) ?? false;

  return {
    accountId,
    accessToken,
    refreshToken,
    isExistingUser,
  };
};

export const createRemoteOtpAuthDataSource = (): OtpAuthRemoteDataSource => ({
  async requestOtp(
    input: RequestOtpRemoteInput,
  ): Promise<Result<RequestOtpRemoteOutput, OtpRemoteError>> {
    const result = await postJson(REQUEST_OTP_ENDPOINT, {
      phoneNumber: input.phoneNumber,
      countryCode: input.countryCode,
      countryIso: input.countryIso,
      languageCode: input.languageCode,
    });

    if (!result.success) {
      return result;
    }

    const output = mapRequestOtpOutput(result.value);

    if (!output.otpReferenceId) {
      return {
        success: false,
        error: toRemoteError(
          "UNKNOWN",
          "Invalid OTP request response from auth service.",
        ),
      };
    }

    return {
      success: true,
      value: output,
    };
  },

  async verifyOtp(
    input: VerifyOtpRemoteInput,
  ): Promise<Result<VerifyOtpRemoteOutput, OtpRemoteError>> {
    const result = await postJson(VERIFY_OTP_ENDPOINT, {
      otpReferenceId: input.otpReferenceId,
      otpCode: input.otpCode,
      phoneNumber: input.phoneNumber,
      countryCode: input.countryCode,
      countryIso: input.countryIso,
    });

    if (!result.success) {
      return result;
    }

    const output = mapVerifyOtpOutput(result.value);

    if (!output.accountId) {
      return {
        success: false,
        error: toRemoteError(
          "UNKNOWN",
          "Invalid OTP verification response from auth service.",
        ),
      };
    }

    return {
      success: true,
      value: output,
    };
  },
});
