const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={
      `
        min-h-40
        w-full
        resize-none
        rounded
        border
        border-zinc-700
        bg-zinc-900
        px-4
        py-3
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
  />
);

export default Textarea;
