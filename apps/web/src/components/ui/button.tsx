import * as React from "react";
import { clsx } from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export const Button = ({ className, variant = "primary", ...props }: Props) => (
  <button
    className={clsx(
      "inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium transition",
      variant === "primary" && "bg-black text-white hover:opacity-90",
      variant === "ghost" && "bg-transparent hover:bg-neutral-100",
      className
    )}
    {...props}
  />
);
