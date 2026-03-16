export type LanguageItem = { id: string; title: string; nativeTitle: string };
export type ProfileItem = { id: string; name: string; subtitle: string; initials: string; type: "personal" | "business" };
export type ShortcutItem = { id: string; title: string; iconName: string; iconFamily: "ion" | "material" };
export type FeatureItem = { id: string; title: string; iconName: string; iconFamily: "ion" | "material"; badge?: string };
export type PartyItem = { id: string; name: string; phone: string; balanceValue: string; balanceLabel: string };
export type MoreRow = { id: string; title: string; iconName: string; iconFamily: "ion" | "material"; badge?: string };
export type AccountItem = { id: string; title: string; amount: string };
export type ReportItem = { id: string; title: string; iconName: string };

export type KhataDatabase = {
  languages: LanguageItem[];
  profiles: ProfileItem[];
  shortcuts: ShortcutItem[];
  features: FeatureItem[];
  parties: PartyItem[];
  moreRows: MoreRow[];
  accountRows: AccountItem[];
  reportRows: ReportItem[];
};
