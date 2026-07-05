import { createContext, useContext } from "react";

const ResumeEditorSectionContext = createContext(null);

export const ResumeEditorSectionProvider = ({ value, children }) => (
  <ResumeEditorSectionContext.Provider value={value}>
    {children}
  </ResumeEditorSectionContext.Provider>
);

export const useResumeEditorSection = () => {
  const context = useContext(ResumeEditorSectionContext);
  if (context === null) {
    throw new Error(
      "useResumeEditorSection must be used inside a ResumeEditorSectionProvider"
    );
  }
  return context;
};