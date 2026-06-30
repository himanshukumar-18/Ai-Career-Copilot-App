import { motion } from "framer-motion";
import { FileText, ZoomIn, ZoomOut, Download } from "lucide-react";
import Button from "@/components/ui/Button";

const MIN_ZOOM = 40;
const MAX_ZOOM = 150;

const ResumeEditorPreview = ({
    resume,
    completion = 0,
    zoom = 100,
    onZoomIn,
    onZoomOut,
    onDownload,
}) => {
    const clampedCompletion = Math.min(100, Math.max(0, completion));
    const clampedZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
    const scale = clampedZoom / 100;

    // Shrink the layout container so scaled-down content doesn't leave dead space
    const previewCardHeight = Math.round(1100 * scale);

    return (
        <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="
        sticky top-20
        hidden
        h-[calc(100vh-6rem)]
        w-[420px]
        overflow-hidden
        border border-zinc-800
        bg-zinc-950
        xl:flex xl:flex-col
      "
        >
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                <div>
                    <h3 className="font-semibold text-white">Live Preview</h3>
                    <p className="text-xs text-zinc-400">{clampedCompletion}% complete</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onZoomOut}
                        disabled={clampedZoom <= MIN_ZOOM}
                        aria-label="Zoom out"
                    >
                        <ZoomOut size={16} aria-hidden="true" />
                    </Button>

                    <span
                        className="w-10 text-center text-sm tabular-nums text-zinc-400"
                        aria-live="polite"
                        aria-label={`Zoom level ${clampedZoom} percent`}
                    >
                        {clampedZoom}%
                    </span>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onZoomIn}
                        disabled={clampedZoom >= MAX_ZOOM}
                        aria-label="Zoom in"
                    >
                        <ZoomIn size={16} aria-hidden="true" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onDownload}
                        aria-label="Download resume as PDF"
                    >
                        <Download size={16} aria-hidden="true" />
                    </Button>
                </div>
            </div>

            {/* Preview canvas */}
            <div className="flex-1 overflow-y-auto bg-zinc-900 p-6">
                {/* Height wrapper compensates for CSS transform not affecting layout flow */}
                <div style={{ height: previewCardHeight }} className="relative">
                    <div
                        className="absolute top-0 left-0 w-full origin-top bg-white p-10 shadow-2xl"
                        style={{
                            transform: `scale(${scale})`,
                            transformOrigin: "top center",
                            width: "100%",
                            minHeight: 1100,
                        }}
                    >
                        {/* Resume header */}
                        <div className="border-b border-zinc-200 pb-6">
                            <h1 className="text-3xl font-bold text-zinc-900">
                                {resume?.title?.trim() || "Untitled Resume"}
                            </h1>
                            <p className="mt-2 text-sm text-zinc-500">
                                {resume?.template || "Classic"} Template
                            </p>
                        </div>

                        {/* Placeholder body */}
                        <div className="flex min-h-[700px] items-center justify-center">
                            <div className="text-center">
                                <FileText
                                    className="mx-auto mb-4 text-zinc-300"
                                    size={60}
                                    aria-hidden="true"
                                />
                                <h3 className="text-lg font-semibold text-zinc-700">
                                    Resume Preview
                                </h3>
                                <p className="mt-2 text-sm text-zinc-500">
                                    Live preview will appear here as you build your resume.
                                </p>
                                <p className="mt-6 text-xs uppercase tracking-wider text-zinc-400">
                                    Sprint 2 will render real resume content.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.aside>
    );
};

export default ResumeEditorPreview;