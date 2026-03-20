import type { PartiesViewModel } from "@/features/parties/overview/viewModel/parties.viewModel";
import PartiesHeader from "@/features/parties/overview/ui/components/PartiesHeader";
import PartyFormCard from "@/features/parties/overview/ui/components/PartyFormCard";
import PartyList from "@/features/parties/overview/ui/components/PartyList";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  viewModel: PartiesViewModel;
};

export default function PartiesScreen({ viewModel }: Props): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <PartiesHeader
        title={t("parties.title")}
        subtitle={t("parties.subtitle")}
        profileName={viewModel.state.profileName}
        addPartyLabel={t("parties.addParty")}
        cancelLabel={t("common.cancel")}
        showAddPartyForm={viewModel.state.showAddPartyForm}
        onToggleAddPartyPress={viewModel.onToggleAddPartyPress}
      />

      {viewModel.state.showAddPartyForm ? (
        <PartyFormCard
          title={t("parties.addParty")}
          saveLabel={t("common.save")}
          namePlaceholder={t("parties.form.name")}
          bankNamePlaceholder={t("parties.form.bankName")}
          accountNumberPlaceholder={t("parties.form.accountNumber")}
          mobileNumberPlaceholder={t("parties.form.mobileNumber")}
          markFavoriteLabel={t("parties.form.markFavorite")}
          partyNameInput={viewModel.state.form.partyNameInput}
          bankNameInput={viewModel.state.form.bankNameInput}
          accountNumberInput={viewModel.state.form.accountNumberInput}
          mobileNumberInput={viewModel.state.form.mobileNumberInput}
          selectedTransferMethod={viewModel.state.form.selectedTransferMethod}
          markAsFavorite={viewModel.state.form.markAsFavorite}
          isSubmitting={viewModel.state.status === Status.Loading}
          getLabel={t}
          onPartyNameChange={viewModel.onPartyNameChange}
          onBankNameChange={viewModel.onBankNameChange}
          onAccountNumberChange={viewModel.onAccountNumberChange}
          onMobileNumberChange={viewModel.onMobileNumberChange}
          onTransferMethodPress={viewModel.onTransferMethodPress}
          onFavoriteTogglePress={viewModel.onFavoriteTogglePress}
          onSavePartyPress={(): void => {
            void viewModel.onSavePartyPress();
          }}
        />
      ) : null}

      <PartyList
        title={t("parties.listTitle")}
        emptyLabel={t("parties.empty")}
        noContactLabel={t("parties.noContact")}
        items={viewModel.state.parties}
        getLabel={t}
      />

      {viewModel.state.status === Status.Failure && viewModel.state.errorMessage ? (
        <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24, gap: 12 },
  errorText: { color: KhataColors.error, fontSize: 14, fontWeight: "600" },
});
