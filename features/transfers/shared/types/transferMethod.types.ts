export const TRANSFER_METHOD_VALUES = ["cash", "bank", "wallet"] as const;

export type TransferMethod = (typeof TRANSFER_METHOD_VALUES)[number];

export const DEFAULT_TRANSFER_METHOD: TransferMethod = "bank";

export const LEGACY_TRANSFER_METHOD_VALUES = [
  "same_bank",
  "other_bank",
  "connect_ips",
  "nepalpay_instant",
  "adbl_pay",
] as const;

export type LegacyTransferMethod = (typeof LEGACY_TRANSFER_METHOD_VALUES)[number];
