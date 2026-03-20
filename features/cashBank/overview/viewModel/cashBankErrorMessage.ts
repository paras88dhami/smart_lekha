import { translate } from "@/shared/i18n/resources";
import { CashBankError } from "../useCase/cashBankError";

export const getCashBankErrorMessage = (error: Error): string => {
  if (!(error instanceof CashBankError)) {
    return translate("cashBank.errors.loadFailed");
  }

  switch (error.code) {
    case "no_active_profile":
      return translate("cashBank.errors.noActiveProfile");
    case "invalid_name":
      return translate("cashBank.errors.invalidName");
    case "invalid_opening_balance":
      return translate("cashBank.errors.invalidOpeningBalance");
    case "create_failed":
      return translate("cashBank.errors.createFailed");
    case "set_primary_failed":
      return translate("cashBank.errors.setPrimaryFailed");
    case "load_failed":
    default:
      return translate("cashBank.errors.loadFailed");
  }
};
