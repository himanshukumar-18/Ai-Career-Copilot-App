const Panel = ({
    title,
    children,
    className = "",
    headerAction,
}) => {
    return (
        <section
            className={`
        bg-[var(--surface)]
        border
        border-[var(--border)]
        overflow-hidden
        ${className}
      `}
        >
            {title && (
                <div
                    className="
            px-5
            py-4
            border-b
            border-[var(--border)]
            flex
            items-center
            justify-between
          "
                >
                    <h2
                        className="
              font-mono
              text-xs
              tracking-[0.25em]
              uppercase
              text-[var(--text-secondary)]
            "
                    >
                        {title}
                    </h2>

                    {headerAction}
                </div>
            )}

            <div className="p-5">
                {children}
            </div>
        </section>
    );
};

export default Panel;