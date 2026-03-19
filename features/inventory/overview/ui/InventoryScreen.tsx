import type { TransferMethod } from "@/features/transfers/beneficiary/data/dataSource/transferBeneficiary.model";
import type { SendMoneyViewModel } from "@/features/inventory/overview/viewModel/inventory.viewModel";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import {
  formatCurrencyAmount,
  formatDateTime,
  useTranslation,
} from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  viewModel: SendMoneyViewModel;
};

const METHOD_OPTIONS: TransferMethod[] = [
  "same_bank",
  "other_bank",
  "connect_ips",
  "nepalpay_instant",
  "adbl_pay",
];

const METHOD_META: Record<
  TransferMethod,
  {
    labelKey: string;
    iconName: string;
  }
> = {
  same_bank: {
    labelKey: "sendMoney.methods.sameBank",
    iconName: "business-outline",
  },
  other_bank: {
    labelKey: "sendMoney.methods.otherBank",
    iconName: "git-compare-outline",
  },
  connect_ips: {
    labelKey: "sendMoney.methods.connectIps",
    iconName: "swap-horizontal-outline",
  },
  nepalpay_instant: {
    labelKey: "sendMoney.methods.nepalpayInstant",
    iconName: "phone-portrait-outline",
  },
  adbl_pay: {
    labelKey: "sendMoney.methods.adblPay",
    iconName: "card-outline",
  },
};

const getInitials = (name: string): string => {
  const parts = name
    .trim()
    .split(" ")
    .filter((part) => part.length > 0)
    .slice(0, 2);

  if (parts.length <= 0) {
    return "AC";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
};

export default function InventoryScreen({ viewModel }: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextArea}>
          <Text style={styles.title}>{t("sendMoney.title")}</Text>
          <Text style={styles.subtitle}>{t("sendMoney.subtitle")}</Text>
        </View>

        <KhataButton
          title={
            viewModel.state.showAddTransferForm
              ? t("common.cancel")
              : t("sendMoney.addTransfer")
          }
          variant="secondary"
          style={styles.addTransferButton}
          onPress={viewModel.onToggleAddTransferPress}
        />
      </View>

      <Text style={styles.sectionTitle}>{t("sendMoney.methodsTitle")}</Text>
      <View style={styles.methodGrid}>
        {METHOD_OPTIONS.map((method) => {
          const isSelected = viewModel.state.selectedMethod === method;

          return (
            <Pressable
              key={method}
              style={[
                styles.methodCard,
                isSelected ? styles.methodCardSelected : null,
              ]}
              onPress={(): void => {
                viewModel.onMethodPress(method);
              }}
            >
              <View
                style={[
                  styles.methodIconBubble,
                  isSelected ? styles.methodIconBubbleSelected : null,
                ]}
              >
                <AppIcon
                  family="ion"
                  name={METHOD_META[method].iconName}
                  size={18}
                  color={isSelected ? KhataColors.primaryDark : KhataColors.text}
                />
              </View>
              <Text
                style={[
                  styles.methodLabel,
                  isSelected ? styles.methodLabelSelected : null,
                ]}
              >
                {t(METHOD_META[method].labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {viewModel.state.showAddTransferForm ? (
        <KhataCard style={styles.formCard}>
          <Text style={styles.formTitle}>{t("sendMoney.addTransfer")}</Text>

          <TextInput
            style={styles.input}
            value={viewModel.state.beneficiaryNameInput}
            onChangeText={viewModel.onBeneficiaryNameChange}
            placeholder={t("sendMoney.form.beneficiaryName")}
          />

          <TextInput
            style={styles.input}
            value={viewModel.state.accountNumberInput}
            onChangeText={viewModel.onAccountNumberChange}
            placeholder={t("sendMoney.form.accountNumber")}
            keyboardType="number-pad"
          />

          <TextInput
            style={styles.input}
            value={viewModel.state.mobileNumberInput}
            onChangeText={viewModel.onMobileNumberChange}
            placeholder={t("sendMoney.form.mobileNumber")}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            value={viewModel.state.amountInput}
            onChangeText={viewModel.onAmountChange}
            placeholder={t("sendMoney.form.amount")}
            keyboardType="decimal-pad"
          />

          <TextInput
            style={styles.input}
            value={viewModel.state.noteInput}
            onChangeText={viewModel.onNoteChange}
            placeholder={t("sendMoney.form.note")}
          />

          <Pressable
            style={styles.scheduleRow}
            onPress={viewModel.onScheduleTogglePress}
          >
            <View
              style={[
                styles.checkBox,
                viewModel.state.isScheduled ? styles.checkBoxSelected : null,
              ]}
            >
              {viewModel.state.isScheduled ? (
                <AppIcon
                  family="ion"
                  name="checkmark"
                  size={12}
                  color={KhataColors.surface}
                />
              ) : null}
            </View>
            <Text style={styles.scheduleText}>{t("sendMoney.form.scheduleForTomorrow")}</Text>
          </Pressable>

          <KhataButton
            title={t("sendMoney.form.submit")}
            disabled={viewModel.state.status === Status.Loading}
            onPress={(): void => {
              void viewModel.onSubmitTransferPress();
            }}
          />
        </KhataCard>
      ) : null}

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>{t("sendMoney.favoritesTitle")}</Text>
      </View>
      <KhataCard style={styles.listCard}>
        {viewModel.state.favorites.length > 0 ? (
          viewModel.state.favorites.map((item) => (
            <View key={item.id} style={styles.listRow}>
              <View style={styles.listLeadingAvatar}>
                <Text style={styles.listLeadingAvatarText}>
                  {getInitials(item.beneficiaryName)}
                </Text>
              </View>

              <View style={styles.listLeft}>
                <Text style={styles.listName}>{item.beneficiaryName}</Text>
                <Text style={styles.listMeta}>
                  {item.bankName || item.mobileNumber || item.accountNumber || "-"}
                </Text>
              </View>

              <Text style={styles.methodText}>{t(METHOD_META[item.transferMethod].labelKey)}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>{t("sendMoney.empty.favorites")}</Text>
        )}
      </KhataCard>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>{t("sendMoney.savedTitle")}</Text>
        <Pressable onPress={viewModel.onViewAllSavedPress}>
          <Text style={styles.viewAllText}>{t("sendMoney.viewAllSaved")}</Text>
        </Pressable>
      </View>
      <KhataCard style={styles.listCard}>
        {viewModel.state.savedTransfers.length > 0 ? (
          viewModel.state.savedTransfers.map((record) => (
            <View key={record.id} style={styles.listRow}>
              <View style={styles.listLeft}>
                <Text style={styles.listName}>
                  {formatCurrencyAmount({
                    amount: record.amount,
                    currencyCode: "NPR",
                    languageCode,
                  })}
                </Text>
                <Text style={styles.listMeta}>
                  {formatDateTime({
                    timestamp: record.scheduledFor ?? record.createdAt,
                    languageCode,
                  })}
                </Text>
              </View>
              <Text style={styles.statusText}>{record.status.toUpperCase()}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>{t("sendMoney.empty.saved")}</Text>
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
  addTransferButton: {
    width: 132,
    height: 42,
    borderRadius: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 20,
    color: KhataColors.text,
    fontWeight: "800",
  },
  methodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  methodCard: {
    width: "50%",
    minHeight: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 8,
  },
  methodCardSelected: {
    borderColor: KhataColors.primaryDark,
    backgroundColor: KhataColors.softGreen,
  },
  methodIconBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: KhataColors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  methodIconBubbleSelected: {
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  methodLabel: {
    fontSize: 13,
    color: KhataColors.text,
    fontWeight: "700",
    textAlign: "center",
  },
  methodLabelSelected: {
    color: KhataColors.primaryDark,
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
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBoxSelected: {
    borderColor: KhataColors.primaryDark,
    backgroundColor: KhataColors.primaryDark,
  },
  scheduleText: {
    fontSize: 14,
    color: KhataColors.text,
    fontWeight: "600",
  },
  listCard: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  listRow: {
    minHeight: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    paddingVertical: 8,
    gap: 10,
  },
  listLeadingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: KhataColors.softGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  listLeadingAvatarText: {
    fontSize: 12,
    fontWeight: "800",
    color: KhataColors.primaryDark,
  },
  listLeft: {
    flex: 1,
  },
  listName: {
    fontSize: 15,
    color: KhataColors.text,
    fontWeight: "700",
  },
  listMeta: {
    marginTop: 2,
    fontSize: 12,
    color: KhataColors.mutedText,
  },
  methodText: {
    fontSize: 11,
    color: KhataColors.primaryDark,
    fontWeight: "700",
  },
  statusText: {
    fontSize: 11,
    color: KhataColors.mutedText,
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 14,
    color: KhataColors.mutedText,
    paddingVertical: 14,
  },
  viewAllText: {
    fontSize: 14,
    color: KhataColors.primaryDark,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 14,
    color: KhataColors.error,
    fontWeight: "600",
  },
});
