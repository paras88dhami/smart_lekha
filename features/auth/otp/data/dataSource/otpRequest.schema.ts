import { tableSchema } from "@nozbe/watermelondb";

export const otpRequestTable = tableSchema({
  name: "otp_requests",
  columns: [
    { name: "phone_number", type: "string", isIndexed: true },
    { name: "country_code", type: "string" },
    { name: "country_iso", type: "string", isIndexed: true },
    { name: "otp_reference_id", type: "string", isIndexed: true },
    { name: "expires_at", type: "number" },
    { name: "is_consumed", type: "boolean" },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" },
  ],
});
