import type { QuickPosViewModel } from "@/features/transactions/quickPos/viewModel/quickPos.viewModel";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import QuickPosProductPickerModal from "./components/QuickPosProductPickerModal";
import QuickPosSearchHeader from "./components/QuickPosSearchHeader";
import QuickPosSlotSection from "./components/QuickPosSlotSection";
import QuickPosSummaryPanel from "./components/QuickPosSummaryPanel";

type Props = {
  viewModel: QuickPosViewModel;
};

export default function QuickPosScreen({ viewModel }: Props): React.JSX.Element {
  const { languageCode } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View style={styles.contentShell}>
        <QuickPosSearchHeader
          searchValue={viewModel.state.searchValue}
          onSearchValueChange={viewModel.onSearchValueChange}
        />

        <QuickPosSlotSection
          items={viewModel.state.items}
          productSlots={viewModel.state.productSlots}
          cart={viewModel.state.cart}
          searchValue={viewModel.state.searchValue}
          onIncreaseItemPress={viewModel.onIncreaseItemPress}
          onOpenProductPicker={viewModel.onOpenProductPicker}
          onClearProductSlot={viewModel.onClearProductSlot}
        />

        <QuickPosSummaryPanel
          cart={viewModel.state.cart}
          totalAmount={viewModel.state.totalAmount}
          paymentMode={viewModel.state.paymentMode}
          isCheckingOut={viewModel.state.isCheckingOut}
          languageCode={languageCode}
          onIncreaseItemPress={viewModel.onIncreaseItemPress}
          onDecreaseItemPress={viewModel.onDecreaseItemPress}
          onPaymentModePress={viewModel.onPaymentModePress}
          onClearCartPress={viewModel.onClearCartPress}
          onCheckoutPress={(): void => {
            void viewModel.onCheckoutPress();
          }}
        />

        {viewModel.state.errorMessage ? (
          <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
        ) : null}
      </View>

      <QuickPosProductPickerModal
        visible={viewModel.state.picker.isVisible}
        items={viewModel.state.items}
        productSlots={viewModel.state.productSlots}
        pickerState={viewModel.state.picker}
        onSearchValueChange={viewModel.onPickerSearchValueChange}
        onDraftChange={viewModel.onProductDraftChange}
        onSelectProduct={viewModel.onSelectProduct}
        onCreateProduct={viewModel.onCreateProductPress}
        onClose={viewModel.onCloseProductPicker}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  contentShell: {
    width: "100%",
    maxWidth: 792,
    alignSelf: "center",
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "600",
    color: KhataColors.error,
  },
});
