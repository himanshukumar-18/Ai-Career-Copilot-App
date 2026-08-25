const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`
      w-full
      min-h-32
      p-4
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
      resize-y
      ${className}
    `}
    {...props}
  />
);

export default Textarea;
