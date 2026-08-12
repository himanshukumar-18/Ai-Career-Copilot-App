/**
 * createResumePDFBlob.jsx
 *
 * Thin JSX helper that renders the PDF document tree and converts it to a Blob.
 * Lives in a .jsx file so Vite/Rolldown can process the JSX.
 *
 * Called by useResumePDF.js which cannot contain JSX (it is a .js file).
 */

import { pdf } from "@react-pdf/renderer";
import ResumePDF from "../pdf/ResumePDF";

/**
 * Renders the resume PDF to a Blob.
 *
 * @param {import("../utils/mapResumeData").ResumeData} resumeData
 * @param {string} template
 * @returns {Promise<Blob>}
 */
export async function createResumePDFBlob(resumeData, template) {
    const element = <ResumePDF data={resumeData} template={template} />;
    return pdf(element).toBlob();
}
