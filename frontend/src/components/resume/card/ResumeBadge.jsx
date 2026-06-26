import clsx from "clsx";

const variants = {
    default:
        "border-zinc-700 bg-zinc-900 text-zinc-300",

    success:
        "border-emerald-900 bg-emerald-950/50 text-emerald-400",

    danger:
        "border-red-900 bg-red-950/50 text-red-400",

    warning:
        "border-yellow-900 bg-yellow-950/50 text-yellow-400",

    primary:
        "border-red-900 bg-red-950/50 text-red-400",

    info:
        "border-sky-900 bg-sky-950/50 text-sky-400",
};

const sizes = {
    sm: "px-2 py-0.5 text-[10px]",

    md: "px-2.5 py-1 text-xs",

    lg: "px-3 py-1.5 text-sm",
};

const ResumeBadge = ({
    children,
    variant = "default",
    size = "md",
    className = "",
}) => {
    return (
        <span
            className={clsx(
                "inline-flex items-center justify-center rounded-full border font-medium tracking-wide transition-colors",

                variants[variant],

                sizes[size],

                className
            )}
        >
            {children}
        </span>
    );
};

export default ResumeBadge;