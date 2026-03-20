import AppIcon from "@/shared/components/icons/AppIcon";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
};

export default function QuickPosSearchHeader({
  searchValue,
  onSearchValueChange,
}: Props): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <View>
        <Text style={styles.title}>{t("quickPos.title")}</Text>
        <Text style={styles.subtitle}>{t("quickPos.subtitle")}</Text>
      </View>

      <View style={styles.searchShell}>
        <AppIcon
          family="ion"
          name="search-outline"
          size={20}
          color={KhataColors.mutedText}
        />
        <TextInput
          value={searchValue}
          onChangeText={onSearchValueChange}
          placeholder={t("quickPos.searchPlaceholder")}
          placeholderTextColor={KhataColors.mutedText}
          style={styles.searchInput}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: KhataColors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "500",
    color: KhataColors.mutedText,
  },
  searchShell: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 16,
    color: KhataColors.text,
  },
});
