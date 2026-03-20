import {
  DEFAULT_TRANSFER_METHOD,
  LEGACY_TRANSFER_METHOD_VALUES,
  TRANSFER_METHOD_VALUES,
  type LegacyTransferMethod,
  type TransferMethod,
} from "../types/transferMethod.types";

export type TransferMethodOption = {
  method: TransferMethod;
  labelKey: string;
  iconName: string;
};

export type TransferMethodInputConfig = {
  showsBankNameInput: boolean;
  showsAccountNumberInput: boolean;
  showsMobileNumberInput: boolean;
};

export type TransferMethodInputValue = {
  bankNameInput: string;
  accountNumberInput: string;
  mobileNumberInput: string;
};

export type TransferMethodInputFields = {
  bankName: string | null;
  accountNumber: string | null;
  mobileNumber: string | null;
};

type TransferMethodDetails = {
  labelKey: string;
  iconName: string;
  fallbackBankName: string | null;
  inputConfig: TransferMethodInputConfig;
};

const TRANSFER_METHOD_DETAILS: Record<TransferMethod, TransferMethodDetails> = {
  cash: {
    labelKey: "sendMoney.methods.cash",
    iconName: "cash-outline",
    fallbackBankName: "Cash",
    inputConfig: {
      showsBankNameInput: false,
      showsAccountNumberInput: false,
      showsMobileNumberInput: false,
    },
  },
  bank: {
    labelKey: "sendMoney.methods.bank",
    iconName: "business-outline",
    fallbackBankName: null,
    inputConfig: {
      showsBankNameInput: true,
      showsAccountNumberInput: true,
      showsMobileNumberInput: false,
    },
  },
  wallet: {
    labelKey: "sendMoney.methods.wallet",
    iconName: "wallet-outline",
    fallbackBankName: null,
    inputConfig: {
      showsBankNameInput: false,
      showsAccountNumberInput: false,
      showsMobileNumberInput: true,
    },
  },
};

const LEGACY_TRANSFER_METHOD_MAP: Record<LegacyTransferMethod, TransferMethod> = {
  same_bank: "bank",
  other_bank: "bank",
  connect_ips: "bank",
  nepalpay_instant: "wallet",
  adbl_pay: "wallet",
};

const trimToNullable = (value: string): string | null => {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
};

const isTransferMethod = (value: string): value is TransferMethod => {
  return TRANSFER_METHOD_VALUES.some((method) => method === value);
};

const isLegacyTransferMethod = (value: string): value is LegacyTransferMethod => {
  return LEGACY_TRANSFER_METHOD_VALUES.some((method) => method === value);
};

export const TRANSFER_METHOD_OPTIONS: TransferMethodOption[] = TRANSFER_METHOD_VALUES.map(
  (method): TransferMethodOption => ({
    method,
    labelKey: TRANSFER_METHOD_DETAILS[method].labelKey,
    iconName: TRANSFER_METHOD_DETAILS[method].iconName,
  }),
);

export const TRANSFER_METHOD_LABEL_KEYS: Record<TransferMethod, string> = {
  cash: TRANSFER_METHOD_DETAILS.cash.labelKey,
  bank: TRANSFER_METHOD_DETAILS.bank.labelKey,
  wallet: TRANSFER_METHOD_DETAILS.wallet.labelKey,
};

export const TRANSFER_METHOD_ICONS: Record<TransferMethod, string> = {
  cash: TRANSFER_METHOD_DETAILS.cash.iconName,
  bank: TRANSFER_METHOD_DETAILS.bank.iconName,
  wallet: TRANSFER_METHOD_DETAILS.wallet.iconName,
};

export const normalizeTransferMethod = (value: string): TransferMethod => {
  if (isTransferMethod(value)) {
    return value;
  }

  if (isLegacyTransferMethod(value)) {
    return LEGACY_TRANSFER_METHOD_MAP[value];
  }

  return DEFAULT_TRANSFER_METHOD;
};

export const getTransferMethodInputConfig = (
  method: TransferMethod,
): TransferMethodInputConfig => {
  return TRANSFER_METHOD_DETAILS[method].inputConfig;
};

export const sanitizeTransferMethodInputs = (
  method: TransferMethod,
  input: TransferMethodInputValue,
): TransferMethodInputFields => {
  const bankName = trimToNullable(input.bankNameInput);
  const accountNumber = trimToNullable(input.accountNumberInput);
  const mobileNumber = trimToNullable(input.mobileNumberInput);

  switch (method) {
    case "cash":
      return {
        bankName: TRANSFER_METHOD_DETAILS.cash.fallbackBankName,
        accountNumber: null,
        mobileNumber: null,
      };
    case "bank":
      return {
        bankName,
        accountNumber,
        mobileNumber: null,
      };
    case "wallet":
      return {
        bankName: null,
        accountNumber: null,
        mobileNumber,
      };
  }
};

export const hasRequiredTransferMethodInputs = (
  method: TransferMethod,
  input: TransferMethodInputFields,
): boolean => {
  switch (method) {
    case "cash":
      return true;
    case "bank":
      return input.accountNumber !== null;
    case "wallet":
      return input.mobileNumber !== null;
  }
};
