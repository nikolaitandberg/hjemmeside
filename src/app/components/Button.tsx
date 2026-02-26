"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded transition-colors font-medium cursor-pointer";

  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary/85",
    secondary: "bg-foreground/10 text-foreground hover:bg-foreground/15",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-foreground hover:bg-foreground/10",
    outline:
      "border border-foreground/20 bg-background text-foreground hover:bg-foreground/5",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
