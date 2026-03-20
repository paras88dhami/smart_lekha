import type { PosItem } from "@/features/pos/item/types/types";
import type { QuickPosProductSlot } from "@/features/transactions/quickPos/slot/types/types";
import type { QuickPosCartItem } from "@/features/transactions/quickPos/viewModel/quickPos.viewModel";
import KhataCard from "@/shared/components/ui/KhataCard";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import QuickPosSlotGrid from "./QuickPosSlotGrid";

type Props = {
  items: PosItem[];
  productSlots: QuickPosProductSlot[];
  cart: QuickPosCartItem[];
  searchValue: string;
  onIncreaseItemPress: (itemId: string) => void;
  onOpenProductPicker: (slotId: string) => void;
  onClearProductSlot: (slotId: string) => Promise<void>;
};

export default function QuickPosSlotSection({
  items,
  productSlots,
  cart,
  searchValue,
  onIncreaseItemPress,
  onOpenProductPicker,
  onClearProductSlot,
}: Props): React.JSX.Element {
  const { t } = useTranslation();
  const visibleSlotCount = React.useMemo(() => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    if (!normalizedSearchValue) {
      return productSlots.length;
    }

    const itemById = new Map(items.map((item) => [item.id, item]));
    return productSlots.filter((slot) => {
      if (!slot.itemId) {
        return true;
      }

      const productItem = itemById.get(slot.itemId);

      if (!productItem) {
        return false;
      }

      return (
        productItem.itemName.toLowerCase().includes(normalizedSearchValue) ||
        productItem.sku?.toLowerCase().includes(normalizedSearchValue)
      );
    }).length;
  }, [items, productSlots, searchValue]);

  return (
    <KhataCard style={styles.slotSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t("quickPos.slotsTitle")}</Text>
        <Text style={styles.sectionMeta}>{`${visibleSlotCount} ${t("quickPos.slotsLabel")}`}</Text>
      </View>

      <Text style={styles.sectionHint}>{t("quickPos.doubleTapHint")}</Text>

      <QuickPosSlotGrid
        items={items}
        productSlots={productSlots}
        cart={cart}
        searchValue={searchValue}
        onIncreaseItemPress={onIncreaseItemPress}
        onOpenProductPicker={onOpenProductPicker}
        onClearProductSlot={onClearProductSlot}
      />
    </KhataCard>
  );
}

const styles = StyleSheet.create({
  slotSection: {
    borderRadius: 22,
    padding: 12,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: KhataColors.text,
  },
  sectionMeta: {
    fontSize: 12,
    fontWeight: "700",
    color: KhataColors.mutedText,
  },
  sectionHint: {
    fontSize: 12,
    color: KhataColors.mutedText,
  },
});
