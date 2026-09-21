import type {
  ButtonHTMLAttributes,
  ComponentProps,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { forwardRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";

import styles from "@/components/labwell-ui.module.css";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: styles.buttonPrimary,
  secondary: styles.buttonSecondary,
  ghost: styles.buttonGhost,
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cx(
    styles.button,
    buttonVariants[variant],
    buttonSizes[size],
    className,
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  leadingIcon,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    >
      {leadingIcon}
      {children}
    </button>
  );
}

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { label, className, children, type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        className={cx(styles.iconButton, className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  containerClassName?: string;
};

export function TextField({
  label,
  hideLabel = false,
  hint,
  error,
  icon,
  id,
  className,
  containerClassName,
  "aria-describedby": describedBy,
  ...props
}: TextFieldProps) {
  const fieldId = id ?? `field-${label.toLowerCase().replace(/\W+/g, "-")}`;
  const messageId = error || hint ? `${fieldId}-message` : undefined;

  return (
    <div className={cx(styles.fieldGroup, containerClassName)}>
      <label
        htmlFor={fieldId}
        className={hideLabel ? styles.visuallyHidden : styles.fieldLabel}
      >
        {label}
      </label>
      <div className={cx(styles.inputShell, Boolean(error) && styles.inputShellError)}>
        {icon}
        <input
          id={fieldId}
          className={cx(styles.input, className)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy ?? messageId}
          {...props}
        />
      </div>
      {error ? (
        <p id={messageId} className={styles.fieldError}>
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className={styles.fieldHint}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function SearchField(props: Omit<TextFieldProps, "icon" | "type">) {
  return (
    <TextField
      type="search"
      icon={<Search aria-hidden="true" size={17} strokeWidth={1.8} />}
      {...props}
    />
  );
}

export type BadgeTone = "neutral" | "brand" | "success" | "warning" | "danger";

const badgeTones: Record<BadgeTone, string> = {
  neutral: styles.badgeNeutral,
  brand: styles.badgeBrand,
  success: styles.badgeSuccess,
  warning: styles.badgeWarning,
  danger: styles.badgeDanger,
};

export function Badge({
  tone = "neutral",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span className={cx(styles.badge, badgeTones[tone], className)} {...props}>
      {children}
    </span>
  );
}

type LabLinkProps = ComponentProps<typeof Link> & {
  variant?: "default" | "button-primary" | "button-secondary";
  size?: ButtonSize;
  trailingArrow?: boolean;
};

export function LabLink({
  variant = "default",
  size = "md",
  trailingArrow = false,
  className,
  children,
  ...props
}: LabLinkProps) {
  const isButton = variant !== "default";
  const variantClass =
    variant === "button-primary"
      ? styles.linkButtonPrimary
      : variant === "button-secondary"
        ? styles.linkButtonSecondary
        : undefined;

  return (
    <Link
      className={cx(
        isButton ? styles.linkButton : styles.link,
        variantClass,
        isButton && buttonSizes[size],
        className,
      )}
      {...props}
    >
      {children}
      {trailingArrow ? (
        <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
      ) : null}
    </Link>
  );
}

export function Surface({
  raised = false,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { raised?: boolean }) {
  return (
    <div
      className={cx(styles.surface, raised && styles.surfaceRaised, className)}
      {...props}
    />
  );
}
