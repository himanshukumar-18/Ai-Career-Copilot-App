import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuContent = React.forwardRef(
    ({ className = "", sideOffset = 8, ...props }, ref) => (
        <DropdownMenuPortal>
            <DropdownMenuPrimitive.Content
                ref={ref}
                sideOffset={sideOffset}
                className={`
          z-50
          min-w-[220px]
          rounded-xl
          border
          border-zinc-800
          bg-zinc-950
          p-2
          shadow-2xl
          animate-in
          fade-in-0
          zoom-in-95
          ${className}
        `}
                {...props}
            />
        </DropdownMenuPortal>
    )
);

DropdownMenuContent.displayName =
    DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef(
    ({ className = "", inset, ...props }, ref) => (
        <DropdownMenuPrimitive.Item
            ref={ref}
            className={`
        relative
        flex
        cursor-pointer
        select-none
        items-center
        rounded-lg
        px-3
        py-2
        text-sm
        text-zinc-300
        outline-none
        transition-colors
        hover:bg-zinc-900
        hover:text-white
        focus:bg-zinc-900
        focus:text-white
        disabled:pointer-events-none
        disabled:opacity-50
        ${inset ? "pl-8" : ""}
        ${className}
      `}
            {...props}
        />
    )
);

DropdownMenuItem.displayName =
    DropdownMenuPrimitive.Item.displayName;

const DropdownMenuSeparator = React.forwardRef(
    ({ className = "", ...props }, ref) => (
        <DropdownMenuPrimitive.Separator
            ref={ref}
            className={`
        -mx-1
        my-2
        h-px
        bg-zinc-800
        ${className}
      `}
            {...props}
        />
    )
);

DropdownMenuSeparator.displayName =
    DropdownMenuPrimitive.Separator.displayName;

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
};