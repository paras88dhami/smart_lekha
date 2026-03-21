import type { CashBankAccountItem } from "@/features/cashBank/overview/types/types";
import KhataCard from "@/shared/components/ui/KhataCard";
import type { SupportedLanguageCode } from "@/shared/i18n/resources/types";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text } from "react-native";
import CashBankAccountRow from "./CashBankAccountRow";

type Props = {
  title: string;
  emptyLabel: string;
  noAccountNumberLabel: string;
  primaryLabel: string;
  setPrimaryLabel: string;
  statementLabel: string;
  editLabel: string;
  languageCode: SupportedLanguageCode;
  accounts: CashBankAccountItem[];
  getLabel: (key: string) => string;
  onEditAccountPress: (accountId: string) => void;
  onSetPrimaryPress: (accountId: string) => void;
  onViewStatementPress: (accountId: string) => void;
};

export default function CashBankAccountList(props: Props): React.JSX.Element {
  return (
    <>
      <Text style={styles.title}>{props.title}</Text>
      <KhataCard style={styles.card}>
        {props.accounts.length > 0 ? (
          props.accounts.map((account) => (
            <CashBankAccountRow
              key={account.id}
              account={account}
              languageCode={props.languageCode}
              noAccountNumberLabel={props.noAccountNumberLabel}
              primaryLabel={props.primaryLabel}
              setPrimaryLabel={props.setPrimaryLabel}
              statementLabel={props.statementLabel}
              editLabel={props.editLabel}
              getLabel={props.getLabel}
              onEditAccountPress={props.onEditAccountPress}
              onSetPrimaryPress={props.onSetPrimaryPress}
              onViewStatementPress={props.onViewStatementPress}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>{props.emptyLabel}</Text>
        )}
      </KhataCard>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, color: KhataColors.text, fontWeight: "800" },
  card: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  emptyText: { textAlign: "center", color: KhataColors.mutedText, fontSize: 14, paddingVertical: 20 },
});
