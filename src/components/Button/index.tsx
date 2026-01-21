import type { PropsWithChildren } from "react";

import { normalizeClassName } from "../../utils/index";

export interface ButtonProps {
  type?: ButtonType;
  disabled?: boolean;
  onClick?: () => void;
}

export enum ButtonType {
  Primary = "primary",
  Secondary = "secondary",
  Danger = "danger",
  Success = "success",
}

function computedClassName(props: Pick<ButtonProps, "type" | "disabled">) {
  const className = ["button", `button--${props.type}`];
  if (props.disabled) {
    className.push("button--disabled");
  }
  return className;
}

export default function Button(props: PropsWithChildren<ButtonProps>) {
  const { type = ButtonType.Primary, disabled, onClick } = props;

  function handleClick() {
    if (!disabled) {
      onClick?.();
    }
  }

  return (
    <button
      className={normalizeClassName(computedClassName({ type }))}
      onClick={handleClick}
    >
      {props.children}
    </button>
  );
}

/**
 * nausea-button nausea-button--primary nausea-button--disabled
 */