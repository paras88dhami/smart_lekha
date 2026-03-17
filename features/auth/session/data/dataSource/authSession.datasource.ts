import { AuthSessionModel } from "./authSession.model";

export interface AuthSessionDataSource {
  getCurrentSession(): Promise<AuthSessionModel | null>;
  upsertSession(input: {
    accountId: string | null;
    phoneNumber: string;
    countryCode: string;
    countryIso: string;
    isVerified: boolean;
    isLoggedIn: boolean;
    accessToken?: string | null;
    refreshToken?: string | null;
  }): Promise<AuthSessionModel>;
  clearSession(): Promise<void>;
}
