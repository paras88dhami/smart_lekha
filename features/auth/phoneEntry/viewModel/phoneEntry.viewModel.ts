import type { LanguageCodeType } from "../../languageSelection/types/types";
import type { PhoneEntryState } from "../types/types";
import type { CountryIsoType } from "../../shared/country.types";

export type PhoneEntryViewModel = {
  state: PhoneEntryState;
  changePhoneNumber: (value: string) => void;
  selectCountry: (countryIso: CountryIsoType) => void;
  selectLanguage: (languageCode: LanguageCodeType) => void;
  continueFlow: () => Promise<void>;
  closeFlow: () => void;
};
