const Label = ({ htmlFor, children, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={`mb-2 block text-sm font-semibold text-zinc-300 ${className}`}
  >
    {children}
  </label>
);

export default Label;
