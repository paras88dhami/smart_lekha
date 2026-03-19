import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.MOCK_AUTH_PORT ?? 3000);
const OTP_EXPIRES_IN_MS = Number(process.env.MOCK_OTP_EXPIRES_MS ?? 5 * 60 * 1000);
const RESEND_AFTER_SECONDS = Number(process.env.MOCK_RESEND_AFTER_SECONDS ?? 30);
const DEFAULT_OTP_CODE = process.env.MOCK_DEFAULT_OTP_CODE?.trim() || "123456";
const REQUEST_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const MAX_VERIFY_ATTEMPTS = 5;
const PRIMARY_EXISTING_NUMBER = "9868569297";
const ALLOW_NEW_USERS =
  String(process.env.MOCK_ALLOW_NEW_USERS ?? "").trim().toLowerCase() === "true";
const LOG_SENSITIVE =
  String(process.env.MOCK_LOG_SENSITIVE ?? "").trim().toLowerCase() === "true";
const EXTRA_EXISTING_NUMBERS = (process.env.MOCK_EXISTING_NUMBERS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter((value) => value.length > 0);

const existingNumbers = new Set([
  PRIMARY_EXISTING_NUMBER,
  ...EXTRA_EXISTING_NUMBERS,
]);

const otpRequestsByReferenceId = new Map();
const otpRequestTimestampsByPhone = new Map();
const sessionsByRefreshToken = new Map();

const parseJsonBody = (request) =>
  new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        const parsedBody = JSON.parse(body);
        resolve(parsedBody && typeof parsedBody === "object" ? parsedBody : {});
      } catch {
        reject(new Error("INVALID_JSON"));
      }
    });

    request.on("error", reject);
  });

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
};

const sendError = (response, statusCode, code, message) => {
  sendJson(response, statusCode, {
    success: false,
    errorCode: code,
    message,
  });
};

const sanitizeDigits = (value) => String(value ?? "").replace(/\D/g, "");

const validateAndNormalizePhone = (payload) => {
  const rawPhoneNumber = String(payload.phoneNumber ?? "").trim();
  const countryIso = String(payload.countryIso ?? "").trim().toUpperCase();
  const countryCode = String(payload.countryCode ?? "").trim();
  const digitsOnly = sanitizeDigits(rawPhoneNumber);
  const localDigits =
    countryIso === "NP" || countryIso === "IN"
      ? digitsOnly.slice(-10)
      : digitsOnly;

  if (countryIso !== "NP" && countryIso !== "IN") {
    return {
      success: false,
      error: "UNSUPPORTED_COUNTRY",
    };
  }

  if (!countryCode.startsWith("+")) {
    return {
      success: false,
      error: "INVALID_COUNTRY_CODE",
    };
  }

  if (localDigits.length !== 10) {
    return {
      success: false,
      error: "INVALID_PHONE",
    };
  }

  if (countryIso === "NP" && !/^9\d{9}$/.test(localDigits)) {
    return {
      success: false,
      error: "INVALID_PHONE",
    };
  }

  if (countryIso === "IN" && !/^[6-9]\d{9}$/.test(localDigits)) {
    return {
      success: false,
      error: "INVALID_PHONE",
    };
  }

  return {
    success: true,
    value: {
      countryIso,
      countryCode,
      localDigits,
      e164PhoneNumber: `${countryCode}${localDigits}`,
    },
  };
};

const canRequestOtpForPhone = (localDigits) => {
  const now = Date.now();
  const timestamps = otpRequestTimestampsByPhone.get(localDigits) ?? [];
  const filteredTimestamps = timestamps.filter(
    (timestamp) => now - timestamp <= REQUEST_WINDOW_MS,
  );

  if (filteredTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    otpRequestTimestampsByPhone.set(localDigits, filteredTimestamps);
    return false;
  }

  filteredTimestamps.push(now);
  otpRequestTimestampsByPhone.set(localDigits, filteredTimestamps);
  return true;
};

const handleOtpRequest = async (request, response) => {
  const payload = await parseJsonBody(request);
  const normalizedPhoneResult = validateAndNormalizePhone(payload);

  if (!normalizedPhoneResult.success) {
    if (normalizedPhoneResult.error === "UNSUPPORTED_COUNTRY") {
      sendError(
        response,
        400,
        "INVALID_PHONE",
        "Only NP and IN phone numbers are supported by the mock server.",
      );
      return;
    }

    sendError(response, 400, "INVALID_PHONE", "Invalid phone number format.");
    return;
  }

  const normalized = normalizedPhoneResult.value;
  const isExistingUser = existingNumbers.has(normalized.localDigits);

  if (!isExistingUser && !ALLOW_NEW_USERS) {
    sendError(
      response,
      400,
      "INVALID_PHONE",
      "Mock mode allows OTP only for configured test numbers.",
    );
    return;
  }

  if (!canRequestOtpForPhone(normalized.localDigits)) {
    sendError(
      response,
      429,
      "RATE_LIMITED",
      "Too many OTP requests. Please wait and try again.",
    );
    return;
  }

  const otpReferenceId = `otp_${randomUUID()}`;
  const expiresAt = Date.now() + OTP_EXPIRES_IN_MS;

  otpRequestsByReferenceId.set(otpReferenceId, {
    otpReferenceId,
    otpCode: DEFAULT_OTP_CODE,
    expiresAt,
    isConsumed: false,
    isExistingUser,
    countryIso: normalized.countryIso,
    countryCode: normalized.countryCode,
    localDigits: normalized.localDigits,
    e164PhoneNumber: normalized.e164PhoneNumber,
    failedAttempts: 0,
  });

  if (LOG_SENSITIVE) {
    console.log(
      `[mock-auth] OTP requested for ${normalized.e164PhoneNumber}. otpReferenceId=${otpReferenceId}, otp=${DEFAULT_OTP_CODE}, existing=${isExistingUser}`,
    );
  } else {
    console.log(
      `[mock-auth] OTP requested for ${normalized.e164PhoneNumber}. otpReferenceId=${otpReferenceId}, existing=${isExistingUser}`,
    );
  }

  sendJson(response, 200, {
    success: true,
    data: {
      otpReferenceId,
      expiresAt,
      resendAfterSeconds: RESEND_AFTER_SECONDS,
      isExistingUser,
    },
  });
};

const handleOtpVerify = async (request, response) => {
  const payload = await parseJsonBody(request);
  const otpReferenceId = String(payload.otpReferenceId ?? "").trim();
  const otpCode = sanitizeDigits(payload.otpCode).slice(0, 6);

  if (!otpReferenceId) {
    sendError(response, 404, "OTP_REQUEST_NOT_FOUND", "OTP request not found.");
    return;
  }

  const otpRecord = otpRequestsByReferenceId.get(otpReferenceId);

  if (!otpRecord) {
    sendError(response, 404, "OTP_REQUEST_NOT_FOUND", "OTP request not found.");
    return;
  }

  if (otpRecord.expiresAt <= Date.now()) {
    sendError(response, 400, "OTP_EXPIRED", "OTP expired. Request a new code.");
    return;
  }

  if (otpRecord.isConsumed) {
    sendError(response, 400, "INVALID_OTP", "OTP already consumed.");
    return;
  }

  if (otpCode !== otpRecord.otpCode) {
    otpRecord.failedAttempts += 1;

    if (otpRecord.failedAttempts >= MAX_VERIFY_ATTEMPTS) {
      sendError(
        response,
        429,
        "RATE_LIMITED",
        "Too many invalid OTP attempts. Request a new code.",
      );
      return;
    }

    sendError(response, 400, "INVALID_OTP", "Invalid OTP code.");
    return;
  }

  otpRecord.isConsumed = true;

  if (!otpRecord.isExistingUser) {
    existingNumbers.add(otpRecord.localDigits);
  }

  const accountId = `${otpRecord.countryCode.replace("+", "")}${otpRecord.localDigits}`;
  const accessToken = `mock_access_${randomUUID()}`;
  const refreshToken = `mock_refresh_${randomUUID()}`;

  sessionsByRefreshToken.set(refreshToken, {
    accountId,
    e164PhoneNumber: otpRecord.e164PhoneNumber,
    isExistingUser: otpRecord.isExistingUser,
  });

  console.log(
    `[mock-auth] OTP verified for ${otpRecord.e164PhoneNumber}. otpReferenceId=${otpReferenceId}, accountId=${accountId}, existing=${otpRecord.isExistingUser}`,
  );

  sendJson(response, 200, {
    success: true,
    data: {
      accountId,
      accessToken,
      refreshToken,
      isExistingUser: otpRecord.isExistingUser,
    },
  });
};

const handleSessionRefresh = async (request, response) => {
  const payload = await parseJsonBody(request);
  const refreshToken = String(payload.refreshToken ?? "").trim();

  if (!refreshToken) {
    sendError(response, 401, "UNAUTHORIZED", "Refresh token is required.");
    return;
  }

  const sessionRecord = sessionsByRefreshToken.get(refreshToken);

  if (!sessionRecord) {
    sendError(response, 401, "UNAUTHORIZED", "Refresh token is invalid.");
    return;
  }

  sessionsByRefreshToken.delete(refreshToken);

  const accessToken = `mock_access_${randomUUID()}`;
  const nextRefreshToken = `mock_refresh_${randomUUID()}`;

  sessionsByRefreshToken.set(nextRefreshToken, sessionRecord);

  console.log(
    `[mock-auth] Session refreshed for ${sessionRecord.e164PhoneNumber}. accountId=${sessionRecord.accountId}`,
  );

  sendJson(response, 200, {
    success: true,
    data: {
      accountId: sessionRecord.accountId,
      accessToken,
      refreshToken: nextRefreshToken,
    },
  });
};

const server = createServer(async (request, response) => {
  try {
    if (!request.url || !request.method) {
      sendError(response, 404, "NOT_FOUND", "Route not found.");
      return;
    }

    const method = request.method.toUpperCase();
    const path = request.url.split("?")[0];

    if (method === "GET" && path === "/health") {
      sendJson(response, 200, {
        success: true,
        service: "mock-auth",
        status: "ok",
      });
      return;
    }

    if (method === "POST" && path === "/auth/otp/request") {
      await handleOtpRequest(request, response);
      return;
    }

    if (method === "POST" && path === "/auth/otp/verify") {
      await handleOtpVerify(request, response);
      return;
    }

    if (method === "POST" && path === "/auth/session/refresh") {
      await handleSessionRefresh(request, response);
      return;
    }

    sendError(response, 404, "NOT_FOUND", "Route not found.");
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_JSON") {
      sendError(response, 400, "INVALID_REQUEST", "Invalid JSON payload.");
      return;
    }

    console.error("[mock-auth] unexpected error", error);
    sendError(response, 500, "SERVICE_UNAVAILABLE", "Internal server error.");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[mock-auth] running on http://0.0.0.0:${PORT}`);

  if (LOG_SENSITIVE) {
    console.log(
      `[mock-auth] existing-user test number: ${PRIMARY_EXISTING_NUMBER}, otp code: ${DEFAULT_OTP_CODE}`,
    );
  } else {
    console.log(
      `[mock-auth] existing-user test number: ${PRIMARY_EXISTING_NUMBER} (set MOCK_LOG_SENSITIVE=true to print OTP)`,
    );
  }

  if (ALLOW_NEW_USERS) {
    console.log(
      "[mock-auth] new-user onboarding mode enabled (valid NP/IN numbers are accepted).",
    );
  }
});
