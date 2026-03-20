import { translate } from "@/shared/i18n/resources";
import type { QuickPosError } from "../useCase/quickPosError";

export const getQuickPosErrorMessage = (error: QuickPosError): string => {
  return translate(`quickPos.errors.${error.code}`);
};
