import type { FeatureHubItem } from "@/features/more/overview/types/types";
import FeatureHubCard from "@/features/more/overview/ui/components/FeatureHubCard";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  features: FeatureHubItem[];
  onFeaturePress(featureId: string): void;
};

export default function FeatureHubList(props: Props): React.JSX.Element {
  return (
    <View style={styles.list}>
      {props.features.map((feature) => (
        <FeatureHubCard
          key={feature.id}
          feature={feature}
          onPress={props.onFeaturePress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
});
