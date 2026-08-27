import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

// ===============================
// Content
// ===============================

const DropdownMenuContent = React.forwardRef(
    ({ className = "", sideOffset = 8, ...props }, ref) => (
        <DropdownMenuPortal>
            <DropdownMenuPrimitive.Content
                ref={ref}
                sideOffset={sideOffset}
                className={`
                    z-50
                    min-w-[220px]
                    border
                    border-zinc-800
                    bg-zinc-950
                    p-2
                    shadow-2xl
                    data-[state=open]:animate-in
                    data-[state=closed]:animate-out
                    data-[state=closed]:fade-out-0
                    data-[state=open]:fade-in-0
                    data-[state=closed]:zoom-out-95
                    data-[state=open]:zoom-in-95
                    duration-150
                    ${className}
                `}
                {...props}
            />
        </DropdownMenuPortal>
    )
);

DropdownMenuContent.displayName =
    DropdownMenuPrimitive.Content.displayName;

// ===============================
// Label
// ===============================

const DropdownMenuLabel = React.forwardRef(
    ({ className = "", inset = false, ...props }, ref) => (
        <DropdownMenuPrimitive.Label
            ref={ref}
            className={`
                px-3
                py-2
                text-xs
                font-semibold
                uppercase
                tracking-widest
                text-zinc-500
                ${inset ? "pl-8" : ""}
                ${className}
            `}
            {...props}
        />
    )
);

DropdownMenuLabel.displayName =
    DropdownMenuPrimitive.Label.displayName;

// ===============================
// Item
// ===============================

const DropdownMenuItem = React.forwardRef(
    ({ className = "", inset = false, ...props }, ref) => (
        <DropdownMenuPrimitive.Item
            ref={ref}
            className={`
                relative
                flex
                cursor-pointer
                select-none
                items-center
                gap-2
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
                data-[disabled]:pointer-events-none
                data-[disabled]:opacity-40
                ${inset ? "pl-8" : ""}
                ${className}
            `}
            {...props}
        />
    )
);

DropdownMenuItem.displayName =
    DropdownMenuPrimitive.Item.displayName;

// ===============================
// Separator
// ===============================

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

// ===============================
// Exports
// ===============================

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
};