const Checkbox = ({ id, className = "", ...props }) => (
  <input
    id={id}
    type="checkbox"
    className={
      `
        h-5
        w-5
        rounded
        border
        border-zinc-700
        bg-zinc-900
        text-indigo-500
        transition-all
        duration-200
        focus:ring-2
        focus:ring-indigo-500/30
        focus:outline-none
        ${className}
      `
    }
    {...props}
  />
);

export default Checkbox;
