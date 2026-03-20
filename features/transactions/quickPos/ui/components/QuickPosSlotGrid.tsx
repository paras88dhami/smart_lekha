import type { PosItem } from "@/features/pos/item/types/types";
import type { QuickPosProductSlot } from "@/features/transactions/quickPos/slot/types/types";
import type { QuickPosCartItem } from "@/features/transactions/quickPos/viewModel/quickPos.viewModel";
import { useTranslation } from "@/shared/i18n/resources";
import React from "react";
import { Alert, LayoutChangeEvent, ScrollView, StyleSheet, View } from "react-native";
import QuickPosSlotCard from "./QuickPosSlotCard";
import {
  COLUMN_COUNT,
  DOUBLE_TAP_DELAY,
  FALLBACK_VIEWPORT_WIDTH,
  SINGLE_TAP_DELAY,
  SLOT_GAP,
  filterQuickPosProductSlots,
  getStockLabel,
} from "./QuickPosSlotGrid.helpers";

type Props = {
  items: PosItem[];
  productSlots: QuickPosProductSlot[];
  cart: QuickPosCartItem[];
  searchValue: string;
  onIncreaseItemPress: (itemId: string) => void;
  onOpenProductPicker: (slotId: string) => void;
  onClearProductSlot: (slotId: string) => Promise<void>;
};

type TapState = {
  slotId: string;
  timestamp: number;
};

export default function QuickPosSlotGrid({
  items,
  productSlots,
  cart,
  searchValue,
  onIncreaseItemPress,
  onOpenProductPicker,
  onClearProductSlot,
}: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();
  const [slotViewportWidth, setSlotViewportWidth] = React.useState(0);
  const lastTapRef = React.useRef<TapState>({ slotId: "", timestamp: 0 });
  const tapTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemById = React.useMemo(() => {
    return new Map(items.map((item) => [item.id, item]));
  }, [items]);

  const quantityByItemId = React.useMemo(() => {
    return new Map(cart.map((item) => [item.itemId, item.quantity]));
  }, [cart]);

  const visibleSlots = React.useMemo(() => {
    return filterQuickPosProductSlots(productSlots, itemById, searchValue);
  }, [itemById, productSlots, searchValue]);

  const slotWidth = React.useMemo(() => {
    const resolvedWidth =
      slotViewportWidth > 0 ? slotViewportWidth : FALLBACK_VIEWPORT_WIDTH;
    return Math.floor((resolvedWidth - SLOT_GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT);
  }, [slotViewportWidth]);

  const slotHeight = React.useMemo(() => {
    return Math.max(88, Math.min(98, Math.floor(slotWidth * 1.18)));
  }, [slotWidth]);

  const slotViewportHeight = React.useMemo(() => {
    return slotHeight * 2 + SLOT_GAP;
  }, [slotHeight]);

  const onSlotViewportLayout = React.useCallback((event: LayoutChangeEvent): void => {
    const measuredWidth = Math.floor(event.nativeEvent.layout.width);
    setSlotViewportWidth((currentWidth) => {
      return currentWidth === measuredWidth ? currentWidth : measuredWidth;
    });
  }, []);

  const onSlotPress = React.useCallback((slot: QuickPosProductSlot): void => {
    const productItem = slot.itemId ? itemById.get(slot.itemId) ?? null : null;

    if (!productItem) {
      onOpenProductPicker(slot.id);
      return;
    }

    const now = Date.now();
    const isDoubleTap =
      lastTapRef.current.slotId === slot.id &&
      now - lastTapRef.current.timestamp <= DOUBLE_TAP_DELAY;

    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
      tapTimeoutRef.current = null;
    }

    lastTapRef.current = { slotId: slot.id, timestamp: now };

    if (isDoubleTap) {
      onOpenProductPicker(slot.id);
      return;
    }

    tapTimeoutRef.current = setTimeout(() => {
      onIncreaseItemPress(productItem.id);
      tapTimeoutRef.current = null;
    }, SINGLE_TAP_DELAY);
  }, [itemById, onIncreaseItemPress, onOpenProductPicker]);

  const onSlotActionPress = React.useCallback((slot: QuickPosProductSlot, itemName: string | null): void => {
    Alert.alert(t("quickPos.slotActions"), itemName ?? undefined, [
      {
        text: t("quickPos.changeProduct"),
        onPress: (): void => {
          onOpenProductPicker(slot.id);
        },
      },
      {
        text: t("quickPos.clearSelection"),
        style: "destructive",
        onPress: (): void => {
          void onClearProductSlot(slot.id);
        },
      },
      {
        text: t("quickPos.cancel"),
        style: "cancel",
      },
    ]);
  }, [onClearProductSlot, onOpenProductPicker, t]);

  React.useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.slotViewportFrame} onLayout={onSlotViewportLayout}>
      <ScrollView
        style={[styles.slotViewport, { height: slotViewportHeight }]}
        contentContainerStyle={styles.slotViewportContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <View style={styles.slotGrid}>
          {visibleSlots.map((slot) => {
            const productItem = slot.itemId ? itemById.get(slot.itemId) ?? null : null;
            const quantity = productItem ? quantityByItemId.get(productItem.id) ?? 0 : 0;

            return (
              <QuickPosSlotCard
                key={slot.id}
                slotId={slot.id}
                item={productItem}
                quantity={quantity}
                width={slotWidth}
                height={slotHeight}
                languageCode={languageCode}
                stockLabel={productItem ? getStockLabel(productItem, t) : ""}
                emptyLabel={t("quickPos.tapToAdd")}
                onPress={(): void => {
                  onSlotPress(slot);
                }}
                onActionPress={(): void => {
                  onSlotActionPress(slot, productItem?.itemName ?? null);
                }}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  slotViewportFrame: {
    width: "100%",
  },
  slotViewport: {
    width: "100%",
  },
  slotViewportContent: {
    paddingBottom: 2,
  },
  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
