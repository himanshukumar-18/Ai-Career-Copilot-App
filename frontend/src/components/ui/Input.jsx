

const Input = ({
  className = "",
  ...props
}) => {
  return (
    <input
      className={`
        w-full
        h-11

        px-4

        bg-[var(--surface)]
        text-[var(--text-primary)]

        border
        border-[var(--border)]

        outline-none

        font-mono
        text-sm

        placeholder:text-[var(--text-muted)]

        transition-all
        duration-200

        focus:border-[var(--accent)]
        focus:bg-[#151515]

        disabled:opacity-50
        disabled:cursor-not-allowed

        ${className}
      `}
      {...props}
    />
  );
};

export default Input;