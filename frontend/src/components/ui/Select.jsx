const Select = ({ className = "", children, ...props }) => (
  <select
    className={
      `
        w-full
        h-11
        rounded
        border
        border-zinc-700
        bg-zinc-900
        px-4
        pr-10
        text-sm
        text-zinc-100
        outline-none
        transition-all
        duration-200
        focus:border-indigo-500
        focus:ring-2
        focus:ring-indigo-500/20
        ${className}
      `
    }
    {...props}
  >
    {children}
  </select>
);

export default Select;
