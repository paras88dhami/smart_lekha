import React from "react";
import type { Database } from "@nozbe/watermelondb";
import CashBankAccountFormScreen from "../ui/CashBankAccountFormScreen";
import { createCashBankAccountFormDependencies } from "./createCashBankAccountFormDependencies";
import { useCashBankAccountFormViewModel } from "../viewModel/cashBankAccountForm.viewModel.impl";

type Params = {
  accountId: string | null;
  database: Database;
  onCompleted: () => void;
};

export const createCashBankAccountFormScreenFactory = ({
  accountId,
  database,
  onCompleted,
}: Params) => {
  return function CashBankAccountFormScreenFactory(): React.JSX.Element {
    const dependencies = React.useMemo(
      () => createCashBankAccountFormDependencies({ database }),
      [],
    );
    const viewModel = useCashBankAccountFormViewModel({
      ...dependencies,
      accountId,
      onCompleted,
    });
    return <CashBankAccountFormScreen viewModel={viewModel} />;
  };
};
