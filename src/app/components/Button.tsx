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
  const baseStyles = "px-4 py-2 rounded transition-colors font-medium";

  const variantStyles = {
    primary: "bg-primary text-white hover:bg-secondary",
    secondary: "bg-gray-400 text-white hover:bg-gray-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-gray-300 text-black hover:bg-gray-400",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
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
