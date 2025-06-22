import { createContext, useContext, useState } from 'react';
import Report from '../components/Report.js';

const ReportContext = createContext();

export const useReport = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reportData, setReportData] = useState({ type: '', id: ''});

  const openReport = (type, id) => {
    setReportData({ type, id });
    setIsOpen(true);
  };

  const closeReport = () => setIsOpen(false);

  return (
    <ReportContext.Provider value={{ openReport, closeReport }}>
      {children}
      <Report
        isOpen={isOpen}
        onClose={closeReport}
        reportType={reportData.type}
        reportId={reportData.id}
      />
    </ReportContext.Provider>
  );
};
