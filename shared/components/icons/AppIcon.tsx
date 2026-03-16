import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

type Props = {
  family: "ion" | "material";
  name: string;
  size: number;
  color: string;
};

export default function AppIcon(props: Props): React.JSX.Element {
  if (props.family === "ion") {
    return <Ionicons name={props.name as never} size={props.size} color={props.color} />;
  }

  return <MaterialCommunityIcons name={props.name as never} size={props.size} color={props.color} />;
}
