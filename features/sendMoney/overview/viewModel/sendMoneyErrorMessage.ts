import { translate } from "@/shared/i18n/resources";
import { SendMoneyError } from "../useCase/sendMoneyError";

export const getSendMoneyErrorMessage = (error: Error): string => {
  if (!(error instanceof SendMoneyError)) {
    return translate("sendMoney.errors.loadFailed");
  }

  switch (error.code) {
    case "no_active_profile":
      return translate("sendMoney.errors.noActiveProfile");
    case "invalid_beneficiary":
      return translate("sendMoney.errors.invalidBeneficiary");
    case "invalid_amount":
      return translate("sendMoney.errors.invalidAmount");
    case "no_primary_account":
      return translate("sendMoney.errors.noPrimaryAccount");
    case "save_failed":
      return translate("sendMoney.errors.saveFailed");
    case "load_failed":
    default:
      return translate("sendMoney.errors.loadFailed");
  }
};
