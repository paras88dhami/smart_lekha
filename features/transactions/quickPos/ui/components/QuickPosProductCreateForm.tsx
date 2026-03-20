import KhataButton from "@/shared/components/ui/KhataButton";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import type {
  QuickPosProductDraft,
  QuickPosProductDraftField,
} from "../../viewModel/quickPos.viewModel";

type FormFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  keyboardType: "default" | "number-pad";
  onChangeText: (value: string) => void;
};

type Props = {
  draft: QuickPosProductDraft;
  isSaving: boolean;
  onDraftChange: (field: QuickPosProductDraftField, value: string) => void;
  onCreateProduct: () => void;
};

function FormField({
  label,
  value,
  placeholder,
  keyboardType,
  onChangeText,
}: FormFieldProps): React.JSX.Element {
  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={KhataColors.mutedText}
        keyboardType={keyboardType}
        style={styles.formInput}
      />
    </View>
  );
}

export default function QuickPosProductCreateForm({
  draft,
  isSaving,
  onDraftChange,
  onCreateProduct,
}: Props): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <View style={styles.createForm}>
      <FormField
        label={t("quickPos.productNameLabel")}
        value={draft.itemName}
        placeholder={t("quickPos.productNamePlaceholder")}
        keyboardType="default"
        onChangeText={(value): void => {
          onDraftChange("itemName", value);
        }}
      />

      <FormField
        label={t("quickPos.productSkuLabel")}
        value={draft.sku}
        placeholder={t("quickPos.productSkuPlaceholder")}
        keyboardType="default"
        onChangeText={(value): void => {
          onDraftChange("sku", value);
        }}
      />

      <View style={styles.formRow}>
        <View style={styles.formCell}>
          <FormField
            label={t("quickPos.priceLabel")}
            value={draft.unitPrice}
            placeholder="0"
            keyboardType="number-pad"
            onChangeText={(value): void => {
              onDraftChange("unitPrice", value);
            }}
          />
        </View>

        <View style={styles.formCell}>
          <FormField
            label={t("quickPos.stockLabel")}
            value={draft.availableStock}
            placeholder="0"
            keyboardType="number-pad"
            onChangeText={(value): void => {
              onDraftChange("availableStock", value);
            }}
          />
        </View>
      </View>

      <KhataButton
        title={t("quickPos.createProduct")}
        disabled={isSaving}
        onPress={onCreateProduct}
        style={styles.createButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  createForm: {
    gap: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.background,
    padding: 14,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  formCell: {
    flex: 1,
  },
  formField: {
    gap: 6,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: KhataColors.text,
  },
  formInput: {
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    paddingHorizontal: 12,
    fontSize: 15,
    color: KhataColors.text,
  },
  createButton: {
    minHeight: 48,
    borderRadius: 16,
    marginTop: 2,
  },
});
