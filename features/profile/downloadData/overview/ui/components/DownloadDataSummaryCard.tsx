import type { DownloadDataSummary } from "@/features/profile/downloadData/overview/types/types";
import KhataCard from "@/shared/components/ui/KhataCard";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type SummaryLabelMap = {
  accounts: string;
  transactions: string;
  beneficiaries: string;
  savedTransfers: string;
  scheduledTransfers: string;
  posItems: string;
  posSales: string;
};

type Props = {
  summary: DownloadDataSummary;
  labels: SummaryLabelMap;
};

type SummaryRowProps = {
  label: string;
  value: number;
};

function SummaryRow(props: SummaryRowProps): React.JSX.Element {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{props.label}</Text>
      <Text style={styles.summaryValue}>{String(props.value)}</Text>
    </View>
  );
}

export default function DownloadDataSummaryCard(props: Props): React.JSX.Element {
  return (
    <KhataCard style={styles.card}>
      <SummaryRow label={props.labels.accounts} value={props.summary.accountsCount} />
      <SummaryRow
        label={props.labels.transactions}
        value={props.summary.transactionsCount}
      />
      <SummaryRow
        label={props.labels.beneficiaries}
        value={props.summary.beneficiariesCount}
      />
      <SummaryRow
        label={props.labels.savedTransfers}
        value={props.summary.savedTransfersCount}
      />
      <SummaryRow
        label={props.labels.scheduledTransfers}
        value={props.summary.scheduledTransfersCount}
      />
      <SummaryRow label={props.labels.posItems} value={props.summary.posItemsCount} />
      <SummaryRow label={props.labels.posSales} value={props.summary.posSalesCount} />
    </KhataCard>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  summaryLabel: { flex: 1, fontSize: 14, color: KhataColors.text, fontWeight: "600" },
  summaryValue: { fontSize: 14, color: KhataColors.primaryDark, fontWeight: "800" },
});
