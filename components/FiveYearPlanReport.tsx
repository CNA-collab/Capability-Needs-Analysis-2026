import React from 'react';

import { OfficerRecord, EstablishmentRecord, AgencyType } from '../types';

interface FiveYearPlanReportProps {
  data: OfficerRecord[];
  establishmentData: EstablishmentRecord[];
  agencyType: AgencyType;
  agencyName: string;
  onClose: () => void;
}



const ReportSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
    <div className={`bg-white rounded-[24px] shadow-sm border border-slate-200 p-8 mb-8 ${className}`}>
        <h2 className="text-xl font-black text-[#1A365D] uppercase tracking-tighter mb-6 border-b border-slate-50 pb-4 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#2AAA52] rounded-full"></div>
            {title}
        </h2>
        <div className="prose prose-sm max-w-none text-slate-600 font-medium leading-relaxed">{children}</div>
    </div>
);

// eslint-disable-next-line no-empty-pattern
const FiveYearPlanReport: React.FC<FiveYearPlanReportProps> = ({  }) => {
    return (
        <div>
            <ReportSection title="Five Year Plan Report">
                <p>Report content here.</p>
            </ReportSection>
        </div>
    );
};

export default FiveYearPlanReport;
