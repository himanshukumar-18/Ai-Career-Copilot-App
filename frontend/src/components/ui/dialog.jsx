import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(
    ({ className = "", ...props }, ref) => (
        <DialogPrimitive.Overlay
            ref={ref}
            className={`
        fixed inset-0 z-50
        bg-black/70
        backdrop-blur-sm
        ${className}
      `}
            {...props}
        />
    )
);

DialogOverlay.displayName = "DialogOverlay";

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
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-950
          shadow-2xl
          outline-none
          ${className}
        `}
                {...props}
            >
                {children}

                <DialogPrimitive.Close
                    className="
            absolute
            right-4
            top-4
            rounded-md
            p-2
            text-zinc-500
            transition
            hover:bg-zinc-900
            hover:text-white
          "
                >
                    <X size={18} />
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPortal>
    )
);

DialogContent.displayName = "DialogContent";

const DialogHeader = ({
    className = "",
    ...props
}) => (
    <div
        className={`flex flex-col space-y-2 ${className}`}
        {...props}
    />
);

const DialogFooter = ({
    className = "",
    ...props
}) => (
    <div
        className={`flex justify-end gap-3 ${className}`}
        {...props}
    />
);

const DialogTitle = React.forwardRef(
    ({ className = "", ...props }, ref) => (
        <DialogPrimitive.Title
            ref={ref}
            className={`text-xl font-semibold ${className}`}
            {...props}
        />
    )
);

DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(
    ({ className = "", ...props }, ref) => (
        <DialogPrimitive.Description
            ref={ref}
            className={`text-sm text-zinc-400 ${className}`}
            {...props}
        />
    )
);

DialogDescription.displayName =
    "DialogDescription";



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