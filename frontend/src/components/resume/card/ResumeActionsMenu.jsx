import {
    Copy,
    Edit3,
    MoreHorizontal,
    Star,
    Trash2,
    Upload,
    Download,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ResumeActionMenu = ({
    resume,

    onEdit,
    onDuplicate,
    onPublish,
    onUnpublish,
    onSetDefault,
    onDelete,
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="
            h-9
            w-9
            rounded-lg
            border
            border-zinc-800
            bg-zinc-950
            hover:bg-zinc-900
            hover:border-zinc-700
          "
                >
                    <MoreHorizontal size={18} />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="
          w-56
          rounded-xl
          border
          border-zinc-800
          bg-zinc-950
        "
            >
                <DropdownMenuItem
                    onClick={() => onEdit(resume)}
                    className="cursor-pointer"
                >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Resume
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => onDuplicate(resume)}
                    className="cursor-pointer"
                >
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {resume?.is_published ? (
                    <DropdownMenuItem
                        onClick={() => onUnpublish(resume)}
                        className="cursor-pointer"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Unpublish
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        onClick={() => onPublish(resume)}
                        className="cursor-pointer"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Publish
                    </DropdownMenuItem>
                )}

                {!resume?.is_default && (
                    <DropdownMenuItem
                        onClick={() => onSetDefault(resume)}
                        className="cursor-pointer"
                    >
                        <Star className="mr-2 h-4 w-4" />
                        Set as Default
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => onDelete(resume)}
                    className="
            cursor-pointer
            text-red-500
            focus:text-red-500
          "
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Resume
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ResumeActionMenu;