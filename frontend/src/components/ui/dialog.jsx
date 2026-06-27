import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

// ===============================
// Overlay
// ===============================

const DialogOverlay = React.forwardRef(
    ({ className = "", ...props }, ref) => (
        <DialogPrimitive.Overlay
            ref={ref}
            className={`
                fixed inset-0 z-50
                bg-black/70
                backdrop-blur-sm
                data-[state=open]:animate-in
                data-[state=closed]:animate-out
                data-[state=closed]:fade-out-0
                data-[state=open]:fade-in-0
                ${className}
            `}
            {...props}
        />
    )
);

DialogOverlay.displayName = "DialogOverlay";

// ===============================
// Content
// ===============================

const DialogContent = React.forwardRef(
    ({ className = "", children, ...props }, ref) => (
        <DialogPortal>
            <DialogOverlay />

            <DialogPrimitive.Content
                ref={ref}
                className={`
                    fixed
                    left-1/2
                    top-1/2
                    z-50
                    w-full
                    max-w-lg
                    -translate-x-1/2
                    -translate-y-1/2
                    border
                    border-zinc-800
                    bg-zinc-950
                    outline-none
                    shadow-none
                    data-[state=open]:animate-in
                    data-[state=closed]:animate-out
                    data-[state=closed]:fade-out-0
                    data-[state=open]:fade-in-0
                    data-[state=closed]:zoom-out-95
                    data-[state=open]:zoom-in-95
                    data-[state=closed]:slide-out-to-left-1/2
                    data-[state=closed]:slide-out-to-top-[48%]
                    data-[state=open]:slide-in-from-left-1/2
                    data-[state=open]:slide-in-from-top-[48%]
                    duration-200
                    ${className}
                `}
                {...props}
            >
                {children}

                <DialogPrimitive.Close
                    aria-label="Close dialog"
                    className="
                        absolute
                        right-4
                        top-4
                        p-2
                        text-zinc-500
                        transition
                        hover:bg-zinc-900
                        hover:text-white
                        focus:outline-none
                        focus:ring-1
                        focus:ring-zinc-700
                    "
                >
                    <X size={18} />
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPortal>
    )
);

DialogContent.displayName = "DialogContent";

// ===============================
// Header
// ===============================

const DialogHeader = ({ className = "", ...props }) => (
    <div
        className={`flex flex-col space-y-2 ${className}`}
        {...props}
    />
);

DialogHeader.displayName = "DialogHeader";

// ===============================
// Footer
// ===============================

const DialogFooter = ({ className = "", ...props }) => (
    <div
        className={`flex justify-end gap-3 ${className}`}
        {...props}
    />
);

DialogFooter.displayName = "DialogFooter";

// ===============================
// Title
// ===============================

const DialogTitle = React.forwardRef(
    ({ className = "", ...props }, ref) => (
        <DialogPrimitive.Title
            ref={ref}
            className={`text-xl font-semibold text-white ${className}`}
            {...props}
        />
    )
);

DialogTitle.displayName = "DialogTitle";

// ===============================
// Description
// ===============================

const DialogDescription = React.forwardRef(
    ({ className = "", ...props }, ref) => (
        <DialogPrimitive.Description
            ref={ref}
            className={`text-sm text-zinc-400 ${className}`}
            {...props}
        />
    )
);

DialogDescription.displayName = "DialogDescription";

// ===============================
// Exports
// ===============================

export {
    Dialog,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogClose,
};