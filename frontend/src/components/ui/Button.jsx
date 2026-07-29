function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  onClick,
  disabled = false,
}) {
  const base =
    "rounded-xl font-medium transition-all duration-300 flex items-center justify-center";

  const variants = {
    primary:
      "bg-teal-700 text-white hover:bg-teal-800 shadow-lg hover:shadow-xl",

    secondary:
      "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100",

    danger:
      "bg-red-500 text-white hover:bg-red-600",

    success:
      "bg-emerald-600 text-white hover:bg-emerald-700",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-3",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
}

export default Button;