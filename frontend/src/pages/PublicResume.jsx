import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import resumeApi from "../api/resumeApi";
import ResumeEditorPreview from "../components/resume/editor/ResumeEditorPreview";

const PublicResume = () => {
    const { resumeId } = useParams();
    const [resume, setResume] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let isCurrent = true;

        resumeApi.getPublicResume(resumeId)
            .then((response) => {
                if (isCurrent) setResume(response.data?.data ?? null);
            })
            .catch((requestError) => {
                if (isCurrent) {
                    setError(
                        requestError.response?.status === 404
                            ? "This resume is not available publicly."
                            : "Unable to load this public resume. Please try again."
                    );
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [resumeId]);

    return (
        <main className="min-h-screen bg-[var(--background)] px-4 py-8 text-[var(--text-primary)] sm:px-6">
            <div className="mx-auto max-w-3xl">
                {error ? (
                    <div role="alert" className="border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm font-mono text-[var(--text-muted)]">
                        {error}
                    </div>
                ) : !resume ? (
                    <div role="status" className="border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm font-mono text-[var(--text-muted)]">
                        Loading public resume…
                    </div>
                ) : (
                    <ResumeEditorPreview resume={resume} useLiveData={false} />
                )}
            </div>
        </main>
    );
};

export default PublicResume;
