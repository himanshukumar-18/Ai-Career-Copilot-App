import {
    Copy,
    Edit3,
    Star,
    Trash2,
    Upload,
    Download,
    PencilLine
} from "lucide-react";

import  Button  from "../../ui/Button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

const ResumeActionMenu = ({
    resume,

    onEdit,
    onDuplicate,
    onPublish,
    onUnpublish,
    onSetDefault,
    onDelete,
}) => {
    const stopPropagation = (callback) => (event) => {
        event.stopPropagation();
        callback();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(event) => event.stopPropagation()}
                    className="
            h-9
            w-9
            border
            border-zinc-800
            bg-zinc-950
            hover:bg-zinc-900
            hover:border-zinc-700
          "
                >
                    <span className="text-xl">✍️</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="
          w-56
          border
          border-zinc-800
          bg-zinc-950
        "
            >
                <DropdownMenuItem
                    onClick={stopPropagation(() => onEdit(resume))}
                    className="cursor-pointer"
                >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Resume
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={stopPropagation(() => onDuplicate(resume))}
                    className="cursor-pointer"
                >
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {resume?.is_published ? (
                    <DropdownMenuItem
                        onClick={stopPropagation(() => onUnpublish(resume))}
                        className="cursor-pointer"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Unpublish
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        onClick={stopPropagation(() => onPublish(resume))}
                        className="cursor-pointer"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Publish
                    </DropdownMenuItem>
                )}

                {!resume?.is_default && (
                    <DropdownMenuItem
                        onClick={stopPropagation(() => onSetDefault(resume))}
                        className="cursor-pointer"
                    >
                        <Star className="mr-2 h-4 w-4" />
                        Set as Default
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={stopPropagation(() => onDelete(resume))}
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