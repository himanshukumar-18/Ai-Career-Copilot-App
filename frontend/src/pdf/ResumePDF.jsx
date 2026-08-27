/**
 * ResumePDF.jsx
 *
 * Router component — receives a normalised ResumeData object
 * and a template identifier, then renders the correct PDF template.
 *
 * Keeps all template-dispatch logic in one place so adding a new
 * template in the future requires only one new entry here.
 *
 * Props:
 *   data     {ResumeData}  – output of mapResumeData()
 *   template {string}      – "professional" | "modern" | "minimal" | "executive"
 */

import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";

// Template registry — extend here for new templates.
const TEMPLATE_MAP = {
    professional: ProfessionalTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    // executive: ExecutiveTemplate,   ← future
};

/** Normalises a raw template string to a registry key. */
function resolveTemplate(template) {
    if (!template) return "professional";
    return template.toLowerCase().trim();
}

/**
 * ResumePDF
 *
 * @param {{ data: import("../utils/mapResumeData").ResumeData, template?: string }} props
 */
const ResumePDF = ({ data, template = "professional" }) => {
    const key = resolveTemplate(template);
    const Template = TEMPLATE_MAP[key] ?? ProfessionalTemplate;

    return <Template data={data} />;
};

export default ResumePDF;
