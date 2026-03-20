import React from "react";
import { Redirect } from "expo-router";
import type { StartupGateViewModel } from "../viewModel/startupGate.viewModel";

type Props = {
  viewModel: StartupGateViewModel;
};

export default function StartupGateScreen({ viewModel }: Props): React.JSX.Element {
  if (!viewModel.state.destination) {
    return <React.Fragment />;
  }

  return <Redirect href={viewModel.state.destination} />;
}
