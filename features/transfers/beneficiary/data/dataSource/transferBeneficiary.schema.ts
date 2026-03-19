import { tableSchema } from "@nozbe/watermelondb";

export const transferBeneficiaryTable = tableSchema({
  name: "transfer_beneficiaries",
  columns: [
    { name: "profile_id", type: "string", isIndexed: true },
    { name: "beneficiary_name", type: "string", isIndexed: true },
    { name: "bank_name", type: "string", isOptional: true },
    { name: "account_number", type: "string", isOptional: true },
    { name: "mobile_number", type: "string", isOptional: true },
    { name: "transfer_method", type: "string", isIndexed: true },
    { name: "is_favorite", type: "boolean", isIndexed: true },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" },
  ],
});
