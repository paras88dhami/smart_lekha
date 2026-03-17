import React from "react";
import { Redirect } from "expo-router";

export default function IndexScreen(): React.JSX.Element {
  return <Redirect href="/(auth)/language" />;
}
