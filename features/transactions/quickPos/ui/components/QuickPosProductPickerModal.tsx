import type { PosItem } from "@/features/pos/item/types/types";
import type { QuickPosProductSlot } from "@/features/transactions/quickPos/slot/types/types";
import AppIcon from "@/shared/components/icons/AppIcon";
import { formatCurrencyAmount, useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type {
  QuickPosPickerState,
  QuickPosProductDraftField,
} from "../../viewModel/quickPos.viewModel";
import QuickPosProductCreateForm from "./QuickPosProductCreateForm";
import QuickPosProductOptionRow, {
  type QuickPosProductOption,
} from "./QuickPosProductOptionRow";
import { styles } from "./QuickPosProductPickerModal.styles";

type Props = {
  visible: boolean;
  items: PosItem[];
  productSlots: QuickPosProductSlot[];
  pickerState: QuickPosPickerState;
  onSearchValueChange: (value: string) => void;
  onDraftChange: (field: QuickPosProductDraftField, value: string) => void;
  onSelectProduct: (itemId: string) => Promise<void>;
  onCreateProduct: () => Promise<void>;
  onClose: () => void;
};

export default function QuickPosProductPickerModal({
  visible,
  items,
  productSlots,
  pickerState,
  onSearchValueChange,
  onDraftChange,
  onSelectProduct,
  onCreateProduct,
  onClose,
}: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();
  const [showCreateForm, setShowCreateForm] = React.useState(false);

  const productOptions = React.useMemo(() => {
    const normalizedSearch = pickerState.searchValue.trim().toLowerCase();
    const usedItemIds = new Set(
      productSlots
        .filter((slot) => slot.id !== pickerState.selectedSlotId && slot.itemId !== null)
        .map((slot) => slot.itemId as string),
    );

    return items
      .filter((item) => !usedItemIds.has(item.id))
      .filter((item) => {
        if (!normalizedSearch) {
          return true;
        }

        return (
          item.itemName.toLowerCase().includes(normalizedSearch) ||
          item.sku?.toLowerCase().includes(normalizedSearch)
        );
      })
      .map<QuickPosProductOption>((item) => ({
        id: item.id,
        title: item.itemName,
        subtitle: item.sku?.trim() || t("quickPos.noSku"),
        priceLabel: formatCurrencyAmount({
          amount: item.unitPrice,
          currencyCode: "NPR",
          languageCode,
        }),
        stockLabel: `${item.availableStock} ${t("quickPos.itemsAvailable")}`,
      }));
  }, [items, languageCode, pickerState.searchValue, pickerState.selectedSlotId, productSlots, t]);

  const suggestedProducts = React.useMemo(() => {
    return productOptions.slice(0, 5);
  }, [productOptions]);

  React.useEffect(() => {
    if (!visible) {
      setShowCreateForm(false);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <View style={styles.headerMeta}>
              <Text style={styles.title}>{t("quickPos.chooseProduct")}</Text>
              <Text style={styles.subtitle}>{t("quickPos.doubleTapHint")}</Text>
            </View>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <AppIcon family="ion" name="close-outline" size={20} color={KhataColors.text} />
            </Pressable>
          </View>

          <View style={styles.searchShell}>
            <AppIcon family="ion" name="search-outline" size={18} color={KhataColors.mutedText} />
            <TextInput
              value={pickerState.searchValue}
              onChangeText={onSearchValueChange}
              placeholder={t("quickPos.productSearchPlaceholder")}
              placeholderTextColor={KhataColors.mutedText}
              style={styles.searchInput}
            />
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t("quickPos.suggestedProducts")}</Text>
                <Text style={styles.sectionMeta}>{String(suggestedProducts.length)}</Text>
              </View>

              {suggestedProducts.length > 0 ? (
                suggestedProducts.map((product) => (
                  <QuickPosProductOptionRow
                    key={product.id}
                    product={product}
                    onPress={(): void => {
                      void onSelectProduct(product.id);
                    }}
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>{t("quickPos.emptyProducts")}</Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t("quickPos.allProducts")}</Text>
                <Text style={styles.sectionMeta}>{String(productOptions.length)}</Text>
              </View>

              {productOptions.length > 0 ? (
                productOptions.map((product) => (
                  <QuickPosProductOptionRow
                    key={product.id}
                    product={product}
                    onPress={(): void => {
                      void onSelectProduct(product.id);
                    }}
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>{t("quickPos.emptyProducts")}</Text>
                </View>
              )}
            </View>

            <View style={styles.createSection}>
              <Pressable
                style={styles.createToggle}
                onPress={(): void => {
                  setShowCreateForm((currentValue) => !currentValue);
                }}
              >
                <Text style={styles.createToggleText}>{t("quickPos.addNewProduct")}</Text>
                <AppIcon
                  family="ion"
                  name={showCreateForm ? "chevron-up-outline" : "chevron-down-outline"}
                  size={18}
                  color={KhataColors.primaryDark}
                />
              </Pressable>

              {showCreateForm ? (
                <QuickPosProductCreateForm
                  draft={pickerState.draft}
                  isSaving={pickerState.isSaving}
                  onDraftChange={onDraftChange}
                  onCreateProduct={(): void => {
                    void onCreateProduct();
                  }}
                />
              ) : null}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
