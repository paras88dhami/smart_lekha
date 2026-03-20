import type { AuthError } from "@/features/auth/shared/authError.types";
import { getAuthErrorMessage } from "@/features/auth/shared/authErrorMessage";

export const getMoreErrorMessage = (error: AuthError): string => {
  return getAuthErrorMessage(error);
};
