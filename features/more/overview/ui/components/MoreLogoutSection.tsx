import KhataButton from "@/shared/components/ui/KhataButton";
import React from "react";

type Props = {
  title: string;
  disabled: boolean;
  onPress(): void;
};

export default function MoreLogoutSection(props: Props): React.JSX.Element {
  return (
    <KhataButton
      title={props.title}
      variant="secondary"
      disabled={props.disabled}
      onPress={props.onPress}
    />
  );
}
