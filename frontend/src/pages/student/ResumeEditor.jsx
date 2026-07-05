import { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { calculateResumeCompletion } from "../../lib/utils";

import ResumeEditorSkeleton from "../../components/resume/editor/ResumeEditorSkeleton";

import ResumeEditorLayout from "../../layouts/ResumeEditorLayout";

import {
  fetchResumeById,
  publishResume,
  unpublishResume,
  updateResume,
} from "../../features/resume/resumeThunk";
import {
  selectResumes,
  selectSelectedResume,
  selectResumeLoading,
  selectResumeError,
} from "../../features/resume/resumeSelectors";


const ResumeEditor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumeId, section } = useParams();

  const resumes = useSelector(selectResumes);
  const selectedResume = useSelector(selectSelectedResume);
  const resume =
    selectedResume ??
    resumes?.find((item) => String(item.id) === String(resumeId)) ??
    null;
  const isLoading = useSelector(selectResumeLoading);
  const isError = useSelector(selectResumeError);
  const message = isError?.message || null;
  const [zoom, setZoom] = useState(100);


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

  const completedSections = useMemo(() => {
    if (!resume) return [];

    const completed = [];
    if (resume.summary) completed.push("summary");
    if (resume.experiences?.length) completed.push("experience");
    if (resume.education?.length) completed.push("education");
    if (resume.skills?.length) completed.push("skills");
    if (resume.projects?.length) completed.push("projects");
    if (resume.certifications?.length) completed.push("certifications");
    if (resume.languages?.length) completed.push("languages");
    if (
      resume.website ||
      resume.portfolio ||
      resume.linkedin ||
      resume.github
    ) {
      completed.push("social");
    }

    if (resume.first_name || resume.last_name || resume.email) {
      completed.push("personal");
    }

    return completed;
  }, [resume]);

  const handleBack = () => {
    navigate("/student/resumes");
  };

  const handleSave = async () => {
    if (!resume?.id) return;

    try {
      await dispatch(updateResume({ id: resume.id, data: {} })).unwrap();
      toast.success("Resume saved successfully.");
    } catch (error) {
      toast.error(error?.message || "Unable to save resume.");
    }
  };

  const handlePublishToggle = async () => {
    if (!resume?.id) return;

    try {
      if (resume.is_published) {
        await dispatch(unpublishResume(resume.id)).unwrap();
        toast.success("Resume unpublished successfully.");
      } else {
        await dispatch(publishResume(resume.id)).unwrap();
        toast.success("Resume published successfully.");
      }
    } catch (error) {
      toast.error(error?.message || "Unable to update publish state.");
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleAIImprove = () => {
    toast.success("AI improvement is coming soon.");
  };

  const handleZoomIn = () => setZoom((current) => Math.min(150, current + 10));
  const handleZoomOut = () => setZoom((current) => Math.max(40, current - 10));

  const completion = calculateResumeCompletion(resume);
  const atsScore = resume?.ats_score ?? completion;
  const isPublished = Boolean(resume?.is_published);
  const isSaving = isLoading;
  const saveStatus = isSaving ? "saving" : "saved";

  if (!resumeId) {
    return <Navigate to="/student/resumes" replace />;
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
        onPublish={handlePublishToggle}
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
    <ResumeEditorLayout
      resume={resume}
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
      zoom={zoom}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      onDownload={handleExportPDF}
      onBack={handleBack}
      onSave={handleSave}
      onPreviewToggle={() => {}}
      onPublish={handlePublishToggle}
      onAIImprove={handleAIImprove}
      onSectionChange={handleSectionChange}
    />
  );

};

export default ResumeEditor;