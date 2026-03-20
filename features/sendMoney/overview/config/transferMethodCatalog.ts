import type { TransferMethod } from "@/features/transfers/beneficiary/data/dataSource/transferBeneficiary.model";

export type SendMoneyMethodOption = {
  method: TransferMethod;
  labelKey: string;
  iconName: string;
  bankName: string;
};

export const SEND_MONEY_METHOD_OPTIONS: SendMoneyMethodOption[] = [
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

export const SEND_MONEY_METHOD_LABEL_KEYS: Record<TransferMethod, string> =
  SEND_MONEY_METHOD_OPTIONS.reduce<Record<TransferMethod, string>>((result, option) => {
    return { ...result, [option.method]: option.labelKey };
  }, {
    same_bank: "sendMoney.methods.sameBank",
    other_bank: "sendMoney.methods.otherBank",
    connect_ips: "sendMoney.methods.connectIps",
    nepalpay_instant: "sendMoney.methods.nepalpayInstant",
    adbl_pay: "sendMoney.methods.adblPay",
  });

export const SEND_MONEY_METHOD_ICONS: Record<TransferMethod, string> =
  SEND_MONEY_METHOD_OPTIONS.reduce<Record<TransferMethod, string>>((result, option) => {
    return { ...result, [option.method]: option.iconName };
  }, {
    same_bank: "business-outline",
    other_bank: "git-compare-outline",
    connect_ips: "swap-horizontal-outline",
    nepalpay_instant: "phone-portrait-outline",
    adbl_pay: "card-outline",
  });

export const SEND_MONEY_METHOD_BANK_NAMES: Record<TransferMethod, string> =
  SEND_MONEY_METHOD_OPTIONS.reduce<Record<TransferMethod, string>>((result, option) => {
    return { ...result, [option.method]: option.bankName };
  }, {
    same_bank: "Same Bank",
    other_bank: "Other Bank",
    connect_ips: "Connect IPS",
    nepalpay_instant: "Mobile Transfer",
    adbl_pay: "Account Pay",
  });
