import type { ButtonHTMLAttributes } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

export function Button({
  variant = "default",
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors";
  const styles =
    variant === "outline"
      ? "border border-zinc-300 bg-transparent hover:bg-zinc-100"
      : "bg-zinc-900 text-white hover:bg-zinc-800";

  return (
    <button
      className={[base, styles, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
