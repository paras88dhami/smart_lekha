import type {
  DownloadDataSnapshot,
  DownloadDataSummary,
} from "../types/types";
import type { ActiveProfile } from "@/features/workspace/activeProfile/types/types";
import type { FinanceAccount } from "@/features/finance/account/types/types";
import type { FinanceTransaction } from "@/features/finance/transaction/types/types";
import type { TransferBeneficiary } from "@/features/transfers/beneficiary/types/types";
import type { TransferRecord } from "@/features/transfers/record/types/types";
import type { PosItem } from "@/features/pos/item/types/types";
import type { PosSale } from "@/features/pos/sale/types/types";

type SnapshotSource = {
  profile: ActiveProfile;
  accounts: FinanceAccount[];
  transactions: FinanceTransaction[];
  beneficiaries: TransferBeneficiary[];
  savedTransfers: TransferRecord[];
  scheduledTransfers: TransferRecord[];
  posItems: PosItem[];
  posSales: PosSale[];
};

export const buildDownloadDataSummary = (
  source: SnapshotSource,
): DownloadDataSummary => {
  return {
    accountsCount: source.accounts.length,
    transactionsCount: source.transactions.length,
    beneficiariesCount: source.beneficiaries.length,
    savedTransfersCount: source.savedTransfers.length,
    scheduledTransfersCount: source.scheduledTransfers.length,
    posItemsCount: source.posItems.length,
    posSalesCount: source.posSales.length,
  };
};

export const buildDownloadDataSnapshot = (
  source: SnapshotSource,
): DownloadDataSnapshot => {
  const generatedAt = Date.now();
  const summary = buildDownloadDataSummary(source);
  const exportPayload = {
    meta: {
      generatedAt,
      profileId: source.profile.profileId,
      profileName: source.profile.profileName,
      profileType: source.profile.profileType,
    },
    summary,
    accounts: source.accounts,
    transactions: source.transactions,
    beneficiaries: source.beneficiaries,
    savedTransfers: source.savedTransfers,
    scheduledTransfers: source.scheduledTransfers,
    posItems: source.posItems,
    posSales: source.posSales,
  };

  return {
    profileName: source.profile.profileName,
    generatedAt,
    summary,
    jsonPreview: JSON.stringify(exportPayload, null, 2),
  };
};
