import type { TransactionsEntryFilter } from "@/features/transactions/overview/config/transactionHistoryFilterCatalog";
import {
  ALL_TRANSACTIONS_ACCOUNT_FILTER_ID,
  TRANSACTIONS_ENTRY_FILTER_OPTIONS,
} from "@/features/transactions/overview/config/transactionHistoryFilterCatalog";
import type { TransactionsAccountFilterOption } from "@/features/transactions/overview/types/types";
import KhataCard from "@/shared/components/ui/KhataCard";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Props = {
  accountsTitle: string;
  entryTypesTitle: string;
  allAccountsLabel: string;
  selectedAccountFilterId: string;
  selectedEntryFilter: TransactionsEntryFilter;
  accountOptions: TransactionsAccountFilterOption[];
  getLabel: (key: string) => string;
  onAccountFilterPress: (accountId: string) => void;
  onEntryFilterPress: (entryFilter: TransactionsEntryFilter) => void;
};

const createChipStyle = (isSelected: boolean) => {
  return isSelected ? styles.chipSelected : null;
};

const createChipTextStyle = (isSelected: boolean) => {
  return isSelected ? styles.chipTextSelected : null;
};

export default function TransactionsHistoryFilters({
  accountOptions,
  accountsTitle,
  allAccountsLabel,
  entryTypesTitle,
  getLabel,
  onAccountFilterPress,
  onEntryFilterPress,
  selectedAccountFilterId,
  selectedEntryFilter,
}: Props): React.JSX.Element {
  return (
    <KhataCard style={styles.card}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{accountsTitle}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            <Pressable
              style={[
                styles.chip,
                createChipStyle(
                  selectedAccountFilterId === ALL_TRANSACTIONS_ACCOUNT_FILTER_ID,
                ),
              ]}
              onPress={(): void => {
                onAccountFilterPress(ALL_TRANSACTIONS_ACCOUNT_FILTER_ID);
              }}
            >
              <Text
                style={[
                  styles.chipText,
                  createChipTextStyle(
                    selectedAccountFilterId === ALL_TRANSACTIONS_ACCOUNT_FILTER_ID,
                  ),
                ]}
              >
                {allAccountsLabel}
              </Text>
            </Pressable>

            {accountOptions.map((accountOption: TransactionsAccountFilterOption) => {
              const isSelected = selectedAccountFilterId === accountOption.id;

              return (
                <Pressable
                  key={accountOption.id}
                  style={[styles.chip, createChipStyle(isSelected)]}
                  onPress={(): void => {
                    onAccountFilterPress(accountOption.id);
                  }}
                >
                  <Text style={[styles.chipText, createChipTextStyle(isSelected)]}>
                    {accountOption.accountName}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{entryTypesTitle}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {TRANSACTIONS_ENTRY_FILTER_OPTIONS.map((entryFilterOption) => {
              const isSelected = selectedEntryFilter === entryFilterOption.id;

              return (
                <Pressable
                  key={entryFilterOption.id}
                  style={[styles.chip, createChipStyle(isSelected)]}
                  onPress={(): void => {
                    onEntryFilterPress(entryFilterOption.id);
                  }}
                >
                  <Text style={[styles.chipText, createChipTextStyle(isSelected)]}>
                    {getLabel(entryFilterOption.labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </KhataCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: KhataColors.text,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 12,
  },
  chip: {
    minHeight: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  chipSelected: {
    borderColor: KhataColors.primaryDark,
    backgroundColor: KhataColors.softGreen,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: KhataColors.mutedText,
  },
  chipTextSelected: {
    color: KhataColors.primaryDark,
  },
});
