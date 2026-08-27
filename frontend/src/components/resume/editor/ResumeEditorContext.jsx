import { createContext, useContext } from "react";

const ResumeEditorSectionContext = createContext(null);

export const ResumeEditorSectionProvider = ({ value, children }) => (
  <ResumeEditorSectionContext.Provider value={value}>
    {children}
  </ResumeEditorSectionContext.Provider>
);

// Context consumers must live with the provider to keep the editor API cohesive.
// eslint-disable-next-line react-refresh/only-export-components
export const useResumeEditorSection = () => {
  const context = useContext(ResumeEditorSectionContext);
  if (context === null) {
    throw new Error(
      "useResumeEditorSection must be used inside a ResumeEditorSectionProvider"
    );
  }
  return context;
};
