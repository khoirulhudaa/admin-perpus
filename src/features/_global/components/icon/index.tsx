import React from "react";
import * as icons from "lucide-react";
import * as radixIcons from "@radix-ui/react-icons";

type IconNames = keyof typeof icons;

export interface IconProps {
  iconName?: IconNames;
  className?: string;
  lucideIcon?: keyof typeof icons;
  radixIcon?: keyof typeof radixIcons;
}

export const Icon = React.memo((props: IconProps) => {
  const { iconName, lucideIcon, radixIcon, className, ...rest } = props;
  const isEmpty = !iconName && !lucideIcon && !radixIcon;
  let Component = null;

  if (isEmpty) return null;

  if (iconName && icons[iconName]) {
    Component = icons[iconName] as JSX.ElementType;
  } else if (lucideIcon && icons[lucideIcon]) {
    Component = icons[lucideIcon] as JSX.ElementType;
  } else if (radixIcon && radixIcons[radixIcon]) {
    Component = radixIcons[radixIcon] as JSX.ElementType;
  }

  // Hanya teruskan className dan sisa props yang aman
  return Component ? <Component className={className} {...rest} /> : null;
});
