const Button = ({
  children,
  variant = "primary",
  className = "cursor-pointer",
  disabled = false,
  ...props
}) => {
  const variants = {
    primary: `
      bg-[var(--text-primary)]
      text-[var(--background)]
      border-[var(--text-primary)]
      hover:bg-transparent
      hover:text-[var(--text-primary)]
    `,

    secondary: `
      bg-transparent
      text-[var(--text-primary)]
      border-[var(--border-light)]
      hover:border-[var(--text-primary)]
    `,

    danger: `
      bg-[var(--accent)]
      text-white
      border-[var(--accent)]
      hover:bg-transparent
      hover:text-[var(--accent)]
    `,

    destructive: `
      bg-transparent
      text-red-500
      border-red-500
      hover:bg-red-500/10
      hover:text-red-500
    `,

    outline: `
      bg-transparent
      text-[var(--text-primary)]
      border border-[var(--border)]
      hover:border-[var(--text-primary)]
      hover:bg-white/5
    `,
  };

  return (
    <button
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center

        h-11
        px-5

        border

        font-mono
        text-xs
        uppercase
        tracking-[0.2em]

        transition-all
        duration-200

        disabled:opacity-50
        disabled:cursor-not-allowed

        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;