import type { TransferMethod } from "@/features/transfers/beneficiary/data/dataSource/transferBeneficiary.model";

export type TransferMethodOption = {
  method: TransferMethod;
  labelKey: string;
  iconName: string;
  bankName: string;
};

export const TRANSFER_METHOD_OPTIONS: TransferMethodOption[] = [
  {
    method: "same_bank",
    labelKey: "sendMoney.methods.sameBank",
    iconName: "business-outline",
    bankName: "Same Bank",
  },
  {
    method: "other_bank",
    labelKey: "sendMoney.methods.otherBank",
    iconName: "git-compare-outline",
    bankName: "Other Bank",
  },
  {
    method: "connect_ips",
    labelKey: "sendMoney.methods.connectIps",
    iconName: "swap-horizontal-outline",
    bankName: "Connect IPS",
  },
  {
    method: "nepalpay_instant",
    labelKey: "sendMoney.methods.nepalpayInstant",
    iconName: "phone-portrait-outline",
    bankName: "Mobile Transfer",
  },
  {
    method: "adbl_pay",
    labelKey: "sendMoney.methods.adblPay",
    iconName: "card-outline",
    bankName: "Account Pay",
  },
];

export const TRANSFER_METHOD_LABEL_KEYS: Record<TransferMethod, string> = {
  same_bank: "sendMoney.methods.sameBank",
  other_bank: "sendMoney.methods.otherBank",
  connect_ips: "sendMoney.methods.connectIps",
  nepalpay_instant: "sendMoney.methods.nepalpayInstant",
  adbl_pay: "sendMoney.methods.adblPay",
};

export const TRANSFER_METHOD_ICONS: Record<TransferMethod, string> = {
  same_bank: "business-outline",
  other_bank: "git-compare-outline",
  connect_ips: "swap-horizontal-outline",
  nepalpay_instant: "phone-portrait-outline",
  adbl_pay: "card-outline",
};

export const TRANSFER_METHOD_BANK_NAMES: Record<TransferMethod, string> = {
  same_bank: "Same Bank",
  other_bank: "Other Bank",
  connect_ips: "Connect IPS",
  nepalpay_instant: "Mobile Transfer",
  adbl_pay: "Account Pay",
};
