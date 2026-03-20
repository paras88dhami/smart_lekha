import { translate } from "@/shared/i18n/resources";
import { PartiesError } from "../useCase/partiesError";

export const getPartiesErrorMessage = (error: Error): string => {
  if (!(error instanceof PartiesError)) {
    return translate("parties.errors.loadFailed");
  }

  switch (error.code) {
    case "no_active_profile":
      return translate("parties.errors.noActiveProfile");
    case "invalid_party":
      return translate("parties.errors.invalidParty");
    case "save_failed":
      return translate("parties.errors.saveFailed");
    case "load_failed":
    default:
      return translate("parties.errors.loadFailed");
  }
};
