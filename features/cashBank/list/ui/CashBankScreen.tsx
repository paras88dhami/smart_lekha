import type { FinanceAccountType } from "@/features/finance/account/data/dataSource/financeAccount.model";
import type { CashBankViewModel } from "@/features/cashBank/list/viewModel/cashBank.viewModel";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { formatCurrencyAmount, useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  viewModel: CashBankViewModel;
};

const ACCOUNT_TYPES: FinanceAccountType[] = ["cash", "bank", "wallet"];

const ACCOUNT_TYPE_ICON: Record<FinanceAccountType, string> = {
  cash: "cash-outline",
  bank: "business-outline",
  wallet: "wallet-outline",
};

const ACCOUNT_TYPE_LABEL_KEY: Record<FinanceAccountType, string> = {
  cash: "cashBank.accountTypes.cash",
  bank: "cashBank.accountTypes.bank",
  wallet: "cashBank.accountTypes.wallet",
};

export default function CashBankScreen({ viewModel }: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextArea}>
          <Text style={styles.title}>{t("cashBank.title")}</Text>
          <Text style={styles.subtitle}>{t("cashBank.subtitle")}</Text>
        </View>

        <KhataButton
          title={
            viewModel.state.showAddAccountForm
              ? t("common.cancel")
              : t("cashBank.addAccount")
          }
          variant="secondary"
          style={styles.addAccountButton}
          onPress={viewModel.onToggleAddAccountPress}
        />
      </View>

      <Text style={styles.profileText}>{viewModel.state.profileName}</Text>

      {viewModel.state.showAddAccountForm ? (
        <KhataCard style={styles.formCard}>
          <Text style={styles.formTitle}>{t("cashBank.addAccount")}</Text>

          <TextInput
            style={styles.input}
            value={viewModel.state.accountNameInput}
            onChangeText={viewModel.onAccountNameChange}
            placeholder={t("cashBank.form.accountName")}
          />

          <TextInput
            style={styles.input}
            value={viewModel.state.accountNumberInput}
            onChangeText={viewModel.onAccountNumberChange}
            placeholder={t("cashBank.form.accountNumber")}
            keyboardType="number-pad"
          />

          <TextInput
            style={styles.input}
            value={viewModel.state.openingBalanceInput}
            onChangeText={viewModel.onOpeningBalanceChange}
            placeholder={t("cashBank.form.openingBalance")}
            keyboardType="decimal-pad"
          />

          <View style={styles.typeRow}>
            {ACCOUNT_TYPES.map((accountType) => {
              const isSelected = viewModel.state.selectedAccountType === accountType;

              return (
                <Pressable
                  key={accountType}
                  style={[styles.typeButton, isSelected ? styles.typeButtonSelected : null]}
                  onPress={(): void => {
                    viewModel.onAccountTypePress(accountType);
                  }}
                >
                  <AppIcon
                    family="ion"
                    name={ACCOUNT_TYPE_ICON[accountType]}
                    size={16}
                    color={isSelected ? KhataColors.primaryDark : KhataColors.text}
                  />
                  <Text style={[styles.typeLabel, isSelected ? styles.typeLabelSelected : null]}>
                    {t(ACCOUNT_TYPE_LABEL_KEY[accountType])}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <KhataButton
            title={t("common.save")}
            disabled={viewModel.state.status === Status.Loading}
            onPress={(): void => {
              void viewModel.onCreateAccountPress();
            }}
          />
        </KhataCard>
      ) : null}

      <Text style={styles.sectionTitle}>{t("cashBank.accounts")}</Text>
      <KhataCard style={styles.listCard}>
        {viewModel.state.accounts.length > 0 ? (
          viewModel.state.accounts.map((account) => (
            <View key={account.id} style={styles.rowItem}>
              <View style={styles.rowLeadingIcon}>
                <AppIcon
                  family="ion"
                  name={ACCOUNT_TYPE_ICON[account.accountType]}
                  size={18}
                  color={KhataColors.primaryDark}
                />
              </View>

              <View style={styles.rowLeft}>
                <Text style={styles.rowTitle}>{account.accountName}</Text>
                <Text style={styles.rowSubtitle}>
                  {account.accountNumber || t("cashBank.noAccountNumber")}
                </Text>
                <Text style={styles.rowMeta}>
                  {t(ACCOUNT_TYPE_LABEL_KEY[account.accountType])}
                </Text>
              </View>

              <View style={styles.rowRight}>
                <Text style={styles.rowAmount}>
                  {formatCurrencyAmount({
                    amount: account.currentBalance,
                    currencyCode: account.currencyCode,
                    languageCode,
                  })}
                </Text>

                {account.isPrimary ? (
                  <View style={styles.primaryBadge}>
                    <Text style={styles.primaryBadgeText}>{t("cashBank.primary")}</Text>
                  </View>
                ) : (
                  <Pressable
                    style={styles.primaryAction}
                    onPress={(): void => {
                      void viewModel.onSetPrimaryPress(account.id);
                    }}
                  >
                    <Text style={styles.primaryActionText}>{t("cashBank.setPrimary")}</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>{t("cashBank.empty")}</Text>
        )}
      </KhataCard>

      {viewModel.state.status === Status.Failure && viewModel.state.errorMessage ? (
        <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  headerTextArea: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    color: KhataColors.text,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "500",
    color: KhataColors.mutedText,
  },
  profileText: {
    fontSize: 14,
    color: KhataColors.mutedText,
    fontWeight: "700",
  },
  addAccountButton: {
    width: 132,
    height: 42,
    borderRadius: 12,
  },
  formCard: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  formTitle: {
    fontSize: 18,
    color: KhataColors.text,
    fontWeight: "800",
  },
  input: {
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    paddingHorizontal: 12,
    fontSize: 15,
    color: KhataColors.text,
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
  },
  typeButton: {
    flex: 1,
    minHeight: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  typeButtonSelected: {
    borderColor: KhataColors.primaryDark,
    backgroundColor: KhataColors.softGreen,
  },
  typeLabel: {
    fontSize: 13,
    color: KhataColors.text,
    fontWeight: "700",
  },
  typeLabelSelected: {
    color: KhataColors.primaryDark,
  },
  sectionTitle: {
    fontSize: 20,
    color: KhataColors.text,
    fontWeight: "800",
  },
  listCard: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rowItem: {
    minHeight: 70,
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowLeadingIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: KhataColors.softGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLeft: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    color: KhataColors.text,
    fontWeight: "700",
  },
  rowSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: KhataColors.mutedText,
  },
  rowMeta: {
    marginTop: 2,
    fontSize: 11,
    color: KhataColors.primaryDark,
    fontWeight: "700",
  },
  rowRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 6,
  },
  rowAmount: {
    fontSize: 13,
    color: KhataColors.text,
    fontWeight: "800",
    textAlign: "right",
  },
  primaryBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: KhataColors.softGreen,
  },
  primaryBadgeText: {
    fontSize: 11,
    color: KhataColors.primaryDark,
    fontWeight: "700",
  },
  primaryAction: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: KhataColors.background,
    borderWidth: 1,
    borderColor: KhataColors.border,
  },
  primaryActionText: {
    fontSize: 11,
    color: KhataColors.mutedText,
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    color: KhataColors.mutedText,
    fontSize: 14,
    paddingVertical: 20,
  },
  errorText: {
    color: KhataColors.error,
    fontSize: 14,
    fontWeight: "600",
  },
});
