import type { MoreViewModel } from "@/features/more/overview/viewModel/more.viewModel";
import KhataButton from "@/shared/components/ui/KhataButton";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  viewModel: MoreViewModel;
};

export default function MoreScreen({ viewModel }: Props): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <ScreenContainer contentStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t("tabs.more")}</Text>

        {viewModel.state.status === Status.Failure &&
        viewModel.state.errorMessage ? (
          <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
        ) : null}
      </View>

      <KhataButton
        title={t("common.logout")}
        variant="secondary"
        disabled={viewModel.state.status === Status.Loading}
        onPress={(): void => {
          void viewModel.onLogoutPress();
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 16,
    justifyContent: "space-between",
  },
  content: {
    gap: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: KhataColors.text,
  },
  errorText: {
    color: KhataColors.error,
    fontSize: 14,
  },
});
