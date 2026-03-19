import type { TransferMethod } from "@/features/transfers/beneficiary/data/dataSource/transferBeneficiary.model";
import type { PartiesViewModel } from "@/features/parties/list/viewModel/parties.viewModel";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";

type Props = {
  viewModel: PartiesViewModel;
};

const TRANSFER_METHOD_OPTIONS: TransferMethod[] = [
  "same_bank",
  "other_bank",
  "connect_ips",
  "nepalpay_instant",
  "adbl_pay",
];

const TRANSFER_METHOD_LABEL_MAP: Record<TransferMethod, string> = {
  same_bank: "sendMoney.methods.sameBank",
  other_bank: "sendMoney.methods.otherBank",
  connect_ips: "sendMoney.methods.connectIps",
  nepalpay_instant: "sendMoney.methods.nepalpayInstant",
  adbl_pay: "sendMoney.methods.adblPay",
};

const getInitials = (name: string): string => {
  const parts = name
    .trim()
    .split(" ")
    .filter((part) => part.length > 0)
    .slice(0, 2);

  if (parts.length <= 0) {
    return "PT";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
};

export default function PartiesScreen({ viewModel }: Props): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextArea}>
          <Text style={styles.title}>{t("parties.title")}</Text>
          <Text style={styles.subtitle}>{t("parties.subtitle")}</Text>
        </View>

        <KhataButton
          title={
            viewModel.state.showAddPartyForm ? t("common.cancel") : t("parties.addParty")
          }
          variant="secondary"
          style={styles.addButton}
          onPress={viewModel.onToggleAddPartyPress}
        />
      </View>

      <Text style={styles.profileText}>{viewModel.state.profileName}</Text>

      {viewModel.state.showAddPartyForm ? (
        <KhataCard style={styles.formCard}>
          <Text style={styles.formTitle}>{t("parties.addParty")}</Text>

          <TextInput
            style={styles.input}
            value={viewModel.state.partyNameInput}
            onChangeText={viewModel.onPartyNameChange}
            placeholder={t("parties.form.name")}
          />

          <TextInput
            style={styles.input}
            value={viewModel.state.bankNameInput}
            onChangeText={viewModel.onBankNameChange}
            placeholder={t("parties.form.bankName")}
          />

          <TextInput
            style={styles.input}
            value={viewModel.state.accountNumberInput}
            onChangeText={viewModel.onAccountNumberChange}
            placeholder={t("parties.form.accountNumber")}
            keyboardType="number-pad"
          />

          <TextInput
            style={styles.input}
            value={viewModel.state.mobileNumberInput}
            onChangeText={viewModel.onMobileNumberChange}
            placeholder={t("parties.form.mobileNumber")}
            keyboardType="phone-pad"
          />

          <View style={styles.methodGrid}>
            {TRANSFER_METHOD_OPTIONS.map((method) => {
              const isSelected = viewModel.state.selectedTransferMethod === method;

              return (
                <Pressable
                  key={method}
                  style={[styles.methodButton, isSelected ? styles.methodButtonSelected : null]}
                  onPress={(): void => {
                    viewModel.onTransferMethodPress(method);
                  }}
                >
                  <Text style={[styles.methodText, isSelected ? styles.methodTextSelected : null]}>
                    {t(TRANSFER_METHOD_LABEL_MAP[method])}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.favoriteRow}>
            <Text style={styles.favoriteText}>{t("parties.form.markFavorite")}</Text>
            <Switch
              value={viewModel.state.markAsFavorite}
              onValueChange={viewModel.onFavoriteTogglePress}
              trackColor={{ false: KhataColors.border, true: KhataColors.primary }}
            />
          </View>

          <KhataButton
            title={t("common.save")}
            disabled={viewModel.state.status === Status.Loading}
            onPress={(): void => {
              void viewModel.onSavePartyPress();
            }}
          />
        </KhataCard>
      ) : null}

      <Text style={styles.sectionTitle}>{t("parties.listTitle")}</Text>

      <KhataCard style={styles.listCard}>
        {viewModel.state.parties.length > 0 ? (
          viewModel.state.parties.map((party) => (
            <View key={party.id} style={styles.rowItem}>
              <View style={styles.avatarBubble}>
                <Text style={styles.avatarText}>{getInitials(party.name)}</Text>
              </View>

              <View style={styles.rowLeft}>
                <Text style={styles.rowTitle}>{party.name}</Text>
                <Text style={styles.rowSubtitle}>
                  {party.mobileNumber || party.accountNumber || t("parties.noContact")}
                </Text>
                {party.bankName ? <Text style={styles.rowMeta}>{party.bankName}</Text> : null}
              </View>

              <View style={styles.rowRight}>
                <Text style={styles.methodBadge}>{t(TRANSFER_METHOD_LABEL_MAP[party.transferMethod])}</Text>
                {party.isFavorite ? (
                  <AppIcon family="ion" name="star" size={14} color={KhataColors.primaryDark} />
                ) : null}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>{t("parties.empty")}</Text>
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
  addButton: {
    width: 122,
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
  methodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  methodButton: {
    width: "50%",
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  methodButtonSelected: {
    opacity: 1,
  },
  methodText: {
    minHeight: 38,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    textAlign: "center",
    textAlignVertical: "center",
    paddingHorizontal: 8,
    paddingTop: 10,
    color: KhataColors.mutedText,
    fontSize: 12,
    fontWeight: "700",
  },
  methodTextSelected: {
    borderColor: KhataColors.primaryDark,
    backgroundColor: KhataColors.softGreen,
    color: KhataColors.primaryDark,
  },
  favoriteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  favoriteText: {
    fontSize: 14,
    color: KhataColors.text,
    fontWeight: "600",
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
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  avatarBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: KhataColors.softGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 12,
    color: KhataColors.primaryDark,
    fontWeight: "800",
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
    fontSize: 12,
    color: KhataColors.primaryDark,
    fontWeight: "600",
  },
  rowRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  methodBadge: {
    fontSize: 10,
    color: KhataColors.mutedText,
    fontWeight: "700",
    textAlign: "right",
    maxWidth: 120,
  },
  noContact: {
    fontSize: 12,
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
