import React from "react";
import { Redirect, useLocalSearchParams } from "expo-router";

type SearchParams = {
  transactionId?: string;
};

export default function TransactionDetailRoute(): React.JSX.Element {
  const params = useLocalSearchParams<SearchParams>();
  const transactionId = typeof params.transactionId === "string"
    ? params.transactionId
    : undefined;

  return (
    <Redirect
      href={{
        pathname: "/(tabs)/transactions/detail",
        params: transactionId ? { transactionId } : undefined,
      }}
    />
  );
}
