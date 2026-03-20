import type { HomeShortcutKey } from "../data/dataSource/homeShortcut.model";
import type { HomeShortcutSeed } from "../types/types";

export type HomeShortcutMetadata = {
  key: HomeShortcutKey;
  labelKey: string;
  iconName: string;
  defaultSortOrder: number;
};

export const HOME_SHORTCUT_CATALOG: readonly HomeShortcutMetadata[] = [
  {
    key: "my_profile",
    labelKey: "home.shortcuts.myProfile",
    iconName: "person-outline",
    defaultSortOrder: 1,
  },
  {
    key: "my_accounts",
    labelKey: "home.shortcuts.myAccounts",
    iconName: "wallet-outline",
    defaultSortOrder: 2,
  },
  {
    key: "statement",
    labelKey: "home.shortcuts.statement",
    iconName: "receipt-outline",
    defaultSortOrder: 3,
  },
  {
    key: "esewa",
    labelKey: "home.shortcuts.esewa",
    iconName: "cash-outline",
    defaultSortOrder: 4,
  },
  {
    key: "quick_pos",
    labelKey: "home.shortcuts.quickPos",
    iconName: "grid-outline",
    defaultSortOrder: 5,
  },
  {
    key: "send_money",
    labelKey: "home.shortcuts.sendMoney",
    iconName: "paper-plane-outline",
    defaultSortOrder: 6,
  },
];

const createHomeShortcutMetadataMap = (): Record<HomeShortcutKey, HomeShortcutMetadata> => {
  const metadataMap = {} as Record<HomeShortcutKey, HomeShortcutMetadata>;

  for (const metadata of HOME_SHORTCUT_CATALOG) {
    metadataMap[metadata.key] = metadata;
  }

  return metadataMap;
};

const HOME_SHORTCUT_METADATA_MAP: Record<HomeShortcutKey, HomeShortcutMetadata> =
  createHomeShortcutMetadataMap();

export const DEFAULT_HOME_SHORTCUT_SEEDS: HomeShortcutSeed[] = HOME_SHORTCUT_CATALOG.map(
  (metadata: HomeShortcutMetadata): HomeShortcutSeed => {
    return {
      shortcutKey: metadata.key,
      sortOrder: metadata.defaultSortOrder,
    };
  },
);

export const getHomeShortcutMetadata = (
  shortcutKey: HomeShortcutKey,
): HomeShortcutMetadata => {
  return HOME_SHORTCUT_METADATA_MAP[shortcutKey];
};
