import { useEffect, useMemo, useState } from "react";
import ExportPDFModal from "../../components/resume/modal/ExportPDFModal";

import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { calculateResumeCompletion } from "../../lib/utils";
import { publicResumePath, RESUME_LIST_PATH, resumeAnalysisPath } from "../../routes/paths";

import ResumeEditorSkeleton from "../../components/resume/editor/ResumeEditorSkeleton";

import ResumeEditorLayout from "../../layouts/ResumeEditorLayout";

import {
  fetchResumeById,
  publishResume,
} from "../../features/resume/resumeThunk";
import {
  selectResumes,
  selectSelectedResume,
  selectResumeLoading,
  selectResumeError,
  selectLiveResumeData,
  selectPublishState,
} from "../../features/resume/resumeSelectors";


const ResumeEditor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumeId, section } = useParams();

  const resumes = useSelector(selectResumes);
  const selectedResume = useSelector(selectSelectedResume);
  const liveResume = useSelector(selectLiveResumeData);
  const publishState = useSelector(selectPublishState);
  const resume =
    selectedResume ??
    resumes?.find((item) => String(item.id) === String(resumeId)) ??
    null;
  const isLoading = useSelector(selectResumeLoading);
  const isError = useSelector(selectResumeError);
  const message = isError?.message || null;
  const [zoom, setZoom] = useState(100);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);


  useEffect(() => {
    if (resumeId) {
      dispatch(fetchResumeById(resumeId));
    }
  }, [dispatch, resumeId]);

  const sectionUrl = (sectionId) => `/resume/${resumeId}/${sectionId}`;

  const activeSection = section || "personal";

  const handleSectionChange = (sectionId) => {
    if (!resumeId) return;
    navigate(sectionUrl(sectionId));
  };

  const editorResume = liveResume ?? resume;

  const completedSections = useMemo(() => {
    if (!editorResume) return [];

    const completed = [];
    if (editorResume.summary?.content || editorResume.summary) completed.push("summary");
    if (editorResume.experiences?.some((item) => item.company && item.position)) completed.push("experience");
    if ((editorResume.education || editorResume.educations)?.some((item) => item.institution && item.degree)) completed.push("education");
    if (editorResume.skills?.some((item) => item.name)) completed.push("skills");
    if (editorResume.projects?.some((item) => item.title && item.description)) completed.push("projects");
    if (editorResume.certifications?.some((item) => item.name)) completed.push("certifications");
    if (editorResume.languages?.some((item) => item.name)) completed.push("languages");
    if (editorResume.social_links?.some((item) => item.url)) {
      completed.push("social");
    }

    if (editorResume.profile?.first_name || editorResume.profile?.last_name) {
      completed.push("personal");
    }

    return completed;
  }, [editorResume]);

  const handleBack = () => {
    navigate(RESUME_LIST_PATH);
  };

  const handleSave = async () => {
    // Section forms register their own save operation. Reaching this fallback
    // means there is no section mutation to send, so avoid an empty PATCH that
    // could replace detailed editor data with a list serializer response.
    toast.message("There are no changes to save.");
  };

  const handlePublishResume = async () => {
    if (!resume?.id) return;

    try {
      await dispatch(publishResume(resume.id)).unwrap();
      toast.success("Resume published successfully.");
    } catch (error) {
      toast.error(error?.message || "Unable to publish resume.");
    }
  };

  const handleExportPDF = () => {
    setIsExportModalOpen(true);
  };

  const handleAIImprove = () => {
    if (resume?.id) {
      navigate(resumeAnalysisPath(resume.id));
    }
  };

  const handleZoomIn = () => setZoom((current) => Math.min(150, current + 10));
  const handleZoomOut = () => setZoom((current) => Math.max(40, current - 10));

  const completion = calculateResumeCompletion(editorResume);
  const atsScore = resume?.ats_score ?? completion;
  const isPublished = Boolean(resume?.is_public);
  const isSaving = isLoading;
  const saveStatus = isSaving ? "saving" : "saved";
  const publicUrl = publishState.publicUrl || (
    isPublished && resume?.id
      ? new URL(publicResumePath(resume.id), window.location.origin).toString()
      : null
  );

  if (!resumeId) {
    return <Navigate to={RESUME_LIST_PATH} replace />;
  }

  if (isLoading) {
    return <ResumeEditorSkeleton />;
  }

if (isError) {
    return (
      <ResumeEditorLayout

        resume={resume}
        resumeId={resumeId}
        activeSection={activeSection}
        completedSections={[]}
        completion={0}
        template={"Classic"}
        isLoading={false}
        isError={true}
        message={message}
        saveStatus={"saved"}
        isSaving={false}
        atsScore={0}
        isPublished={false}
        zoom={100}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        onDownload={() => {}}
        onBack={handleBack}
        onSave={handleSave}
        onPreviewToggle={() => {}}
        onPublish={handlePublishResume}
        onAIImprove={handleAIImprove}
        onSectionChange={handleSectionChange}
      />
    );
  }


  if (!isLoading && !resume) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-lg border border-zinc-700 bg-zinc-950 p-8 text-center">
          <h1 className="text-xl font-semibold text-white">
            Resume not found
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            We could not find the requested resume. Please go back and try another one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ExportPDFModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
      />
      <ResumeEditorLayout
        resume={editorResume}
        resumeId={resumeId}
        activeSection={activeSection}
        completedSections={completedSections}
        completion={completion}
        template={resume?.template || "Classic"}
        isLoading={false}
        isError={false}
        message={null}
        saveStatus={saveStatus}
        isSaving={isSaving}
        atsScore={atsScore}
        isPublished={isPublished}
        isPublishing={publishState.status === "pending"}
        publishError={publishState.error}
        publicUrl={publicUrl}
        hasUnpublishedChanges={publishState.hasUnpublishedChanges}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onDownload={handleExportPDF}
        onBack={handleBack}
        onSave={handleSave}
        onPreviewToggle={() => {}}
        onPublish={handlePublishResume}
        onAIImprove={handleAIImprove}
        onSectionChange={handleSectionChange}
      />
    </>
  );

};

export default ResumeEditor;
