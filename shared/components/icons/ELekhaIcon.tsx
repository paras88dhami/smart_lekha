import React from "react";
import Svg, { Path, Rect } from "react-native-svg";
import { KhataColors } from "@/shared/theme/colors";

type Props = {
  size?: number;
  color?: string;
  accentColor?: string;
};

export default function ELekhaIcon({
  size = 64,
  color = KhataColors.primary,
  accentColor = KhataColors.softGreen,
}: Props): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="4" y="4" width="56" height="56" rx="16" fill={color} />

      <Path
        d="M44 31.5C44 23.49 37.51 17 29.5 17C21.49 17 15 23.49 15 31.5C15 39.51 21.49 46 29.5 46C35.02 46 39.81 42.92 42.25 38.38"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 31.5H41.5"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
      />

      <Rect x="41" y="13" width="10" height="4" rx="2" fill={accentColor} />
    </Svg>
  );
}