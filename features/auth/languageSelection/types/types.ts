
import { Result } from "@/shared/types/result.types";
import { Status } from "@/shared/types/status.types";
import { AuthError } from "../../shared/authError.types";

export const LanguageCode = {
  English: "en",
  Nepali: "ne",
  Hindi: "hi",
  Bangla: "bn",
} as const;

export type LanguageCodeType =
  (typeof LanguageCode)[keyof typeof LanguageCode];

export type LanguageOption = {
  code: LanguageCodeType;
  title: string;
  subtitle: string;
};

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: LanguageCode.English, title: "English", subtitle: "English" },
  { code: LanguageCode.Nepali, title: "Nepali", subtitle: "नेपाली" },
  { code: LanguageCode.Hindi, title: "Hindi", subtitle: "हिन्दी" },
  { code: LanguageCode.Bangla, title: "Bangla", subtitle: "বাংলা" },
];

export type LanguageSelectionResult = Result<LanguageCodeType | null, AuthError>;
export type AuthResult<T> = Result<T, AuthError>;
export type LanguageSelectionState =
  | {
      status: typeof Status.Idle;
      selectedLanguageCode: LanguageCodeType;
      options: LanguageOption[];
    }
  | {
      status: typeof Status.Loading;
      selectedLanguageCode: LanguageCodeType;
      options: LanguageOption[];
    }
  | {
      status: typeof Status.Success;
      selectedLanguageCode: LanguageCodeType;
      options: LanguageOption[];
    }
  | {
      status: typeof Status.Failure;
      selectedLanguageCode: LanguageCodeType;
      options: LanguageOption[];
      error: string;
    };
