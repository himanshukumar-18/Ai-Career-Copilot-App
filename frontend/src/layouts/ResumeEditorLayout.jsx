import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, X } from "lucide-react";

import ResumeEditorHeader from "../components/resume/editor/ResumeEditorHeader";
import ResumeEditorSidebar from "../components/resume/editor/ResumeEditorSidebar";
import ResumeEditorContent from "../components/resume/editor/ResumeEditorContent";
import ResumeEditorPreview from "../components/resume/editor/ResumeEditorPreview";
import { ResumeEditorSectionProvider } from "../components/resume/editor/ResumeEditorContext";

const ResumeEditorLayout = ({
  resume,
  activeSection,
  isLoading,
  isError,
  message,
  isSaving,
  isPublished,
  onBack,
  onSave,
  onPublish,
  onAIImprove,
  onDownload,
  onSectionChange,
}) => {
  const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false);
  const saveActionsRef = useRef({});

  const registerSaveAction = useCallback((sectionId, action) => {
    if (!sectionId || typeof action !== "function") {
      return () => { };
    }

    saveActionsRef.current[sectionId] = action;

    return () => {
      if (saveActionsRef.current[sectionId] === action) {
        delete saveActionsRef.current[sectionId];
      }
    };
  }, []);

  const getSaveAction = useCallback(
    (sectionId) => saveActionsRef.current[sectionId],
    []
  );

  const closePreviewDrawer = useCallback(() => {
    setIsPreviewDrawerOpen(false);
  }, []);

  const openPreviewDrawer = useCallback(() => {
    setIsPreviewDrawerOpen(true);
  }, []);

  const handleSave = useCallback(async () => {
    const saveAction = getSaveAction(activeSection);

    if (saveAction) {
      await saveAction();
      return;
    }

    await onSave?.();
  }, [activeSection, getSaveAction, onSave]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePreviewDrawer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closePreviewDrawer]);

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-5 text-zinc-100">
        <div className="w-full max-w-md border border-zinc-800 bg-zinc-950 p-7">
          <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Resume editor
          </p>

          <h1 className="mt-3 text-xl font-semibold text-white">
            Unable to load resume
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {message || "Please try again in a moment."}
          </p>

          <button
            type="button"
            onClick={onBack}
            className="mt-6 border border-zinc-700 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Back to resumes
          </button>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
          <div className="h-12 animate-pulse border border-zinc-900 bg-zinc-950" />

          <div className="mt-8 flex flex-col gap-6 xl:flex-row">
            <div className="h-56 animate-pulse border border-zinc-900 bg-zinc-950 xl:w-[200px] xl:shrink-0" />
            <div className="h-[520px] flex-1 animate-pulse border border-zinc-900 bg-zinc-950" />
            <div className="h-[680px] animate-pulse border border-zinc-900 bg-zinc-950 xl:w-[330px] xl:shrink-0" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <ResumeEditorSectionProvider value={{ registerSaveAction }}>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen bg-black text-zinc-100"
      >
        <ResumeEditorHeader
          isSaving={isSaving}
          isPublished={isPublished}
          onBack={onBack}
          onSave={handleSave}
          onPublish={onPublish}
          onExportPDF={onDownload}
          onAIImprove={onAIImprove}
        />

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:py-9">
          {/* Mobile/tablet section tabs */}
          <div className="mb-6 xl:hidden">
            <ResumeEditorSidebar
              activeSection={activeSection}
              onSectionChange={onSectionChange}
              mobileTabs
            />
          </div>

          {/* Modern responsive layout: stacked on mobile, side-by-side from xl up */}
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
            {/* Section rail - desktop only */}
            <aside className="hidden xl:block xl:w-[200px] xl:shrink-0">
              <div className="sticky top-20">
                <ResumeEditorSidebar
                  activeSection={activeSection}
                  onSectionChange={onSectionChange}
                />
              </div>
            </aside>

            {/* Main editing panel */}
            <section className="min-w-0 flex-1">
              <ResumeEditorContent
                activeSection={activeSection}
                resume={resume}
              />
            </section>

            {/* Live preview - desktop only, permanently visible */}
            <aside className="hidden xl:block xl:w-[330px] xl:shrink-0">
              <div className="sticky top-20">
                <ResumeEditorPreview resume={resume} />
              </div>
            </aside>
          </div>
        </div>

        {/* Floating trigger so mobile/tablet users can still open the preview */}
        <button
          type="button"
          onClick={openPreviewDrawer}
          aria-label="Open resume preview"
          className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center border border-zinc-700 bg-zinc-950 text-zinc-200 shadow-xl transition hover:border-zinc-500 hover:bg-zinc-900 xl:hidden"
        >
          <Eye size={18} />
        </button>

        <AnimatePresence>
          {isPreviewDrawerOpen && (
            <motion.div
              className="fixed inset-0 z-50 xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                type="button"
                aria-label="Close resume preview overlay"
                onClick={closePreviewDrawer}
                className="absolute inset-0 bg-black/80"
              />

              <motion.aside
                role="dialog"
                aria-modal="true"
                aria-label="Live resume preview"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.22 }}
                className="absolute right-0 top-0 h-full w-full max-w-[480px] overflow-y-auto border-l border-zinc-800 bg-black p-4 pt-16 shadow-2xl"
              >
                <button
                  type="button"
                  aria-label="Close preview"
                  onClick={closePreviewDrawer}
                  className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center border border-zinc-800 text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900 hover:text-white"
                >
                  <X size={16} />
                </button>

                <ResumeEditorPreview resume={resume} />
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </ResumeEditorSectionProvider>
  );
};

export default ResumeEditorLayout;