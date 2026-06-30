import { motion, AnimatePresence } from "framer-motion";
import PersonalInfoSection from "./sections/PersonalInfoSection";
import SummarySection from "./sections/SummarySection";
import ExperienceSection from "./sections/ExperienceSection";
import EducationSection from "./sections/EducationSection";
import SkillsSection from "./sections/SkillsSection";
import ProjectsSection from "./sections/ProjectsSection";
import CertificationsSection from "./sections/CertificationsSection";
import LanguagesSection from "./sections/LanguagesSection";
import SocialLinksSection from "./sections/SocialLinksSection";

const SECTION_MAP = {
    personal: PersonalInfoSection,
    summary: SummarySection,
    experience: ExperienceSection,
    education: EducationSection,
    skills: SkillsSection,
    projects: ProjectsSection,
    certifications: CertificationsSection,
    languages: LanguagesSection,
    social: SocialLinksSection,
};

const slideVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
};

const ResumeEditorContent = ({ activeSection, resume }) => {
    if (!resume) {
        return (
            <div className="flex flex-1 items-center justify-center text-zinc-500 text-sm">
                No resume data available.
            </div>
        );
    }

    const SectionComponent = SECTION_MAP[activeSection] ?? PersonalInfoSection;

    return (
        <div className="flex-1">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSection}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                >
                    <SectionComponent resume={resume} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ResumeEditorContent;