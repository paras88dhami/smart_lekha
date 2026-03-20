import React from "react";
import type { Database } from "@nozbe/watermelondb";
import SendMoneyScreen from "../ui/SendMoneyScreen";
import { createSendMoneyDependencies } from "./createSendMoneyDependencies";
import { useSendMoneyViewModel } from "../viewModel/sendMoney.viewModel.impl";

type Params = {
  database: Database;
  onViewAllSavedPress: () => void;
};

export const createSendMoneyScreenFactory = ({
  database,
  onViewAllSavedPress,
}: Params) => {
  return function SendMoneyScreenFactory(): React.JSX.Element {
    const dependencies = React.useMemo(() => {
      return createSendMoneyDependencies({ database, onViewAllSavedPress });
    }, []);

    const viewModel = useSendMoneyViewModel(dependencies);
    return <SendMoneyScreen viewModel={viewModel} />;
  };
};
