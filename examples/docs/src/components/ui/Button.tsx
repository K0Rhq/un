import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

const variants = cva(
  [
    "text-body px-16 py-8 h-[2.5rem] flex justify-center items-center flex-center rounded-12 border border-stroke",
    "enabled:hover:-translate-y-[2px] enabled:active:translate-y-4 duration-150 ease-out",
    " disabled:cursor-not-allowed disabled:opacity-33",
  ],
  {
    variants: {
      variant: {
        primary: ["bg-blue-500 text-text-reversed shadow-colored-component"],
        secondary: ["bg-fg-2 text-text shadow-material-component"],
        success: ["bg-green-500 text-text-reversed shadow-colored-component"],
        warning: ["bg-yellow-500 text-text-reversed shadow-colored-component"],
        danger: ["bg-red-500 text-text-reversed shadow-colored-component"],
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof variants>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
}
export const Button = ({
  children,
  variant,
  disabled,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={variants({ variant })}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
