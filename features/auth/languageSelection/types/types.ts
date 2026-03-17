import { StatusType } from "@/shared/types/status.types";

export const LanguageCode = {
  English: "en",
  Nepali: "ne",
  Hindi: "hi",
  Bangla: "bn",
} as const;

export type LanguageOption = {
  code: LanguageCodeType;
  title: string;
  nativeTitle: string;
};

export type LanguageCodeType = "en" | "ne" | "hi";

export type LanguageSelectionState = {
  status: StatusType;
  selectedLanguageCode: LanguageCodeType;
  options: LanguageOption[];
  errorMessage: string;
};
