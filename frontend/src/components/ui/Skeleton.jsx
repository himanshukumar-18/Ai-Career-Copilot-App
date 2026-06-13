
const Skeleton = ({
    className = "",
}) => {
    return (
        <div
            className={`
        animate-pulse

        bg-[var(--surface)]

        border
        border-[var(--border)]

        rounded-[12px]

        ${className}
      `}
        />
    );
};

export default Skeleton;