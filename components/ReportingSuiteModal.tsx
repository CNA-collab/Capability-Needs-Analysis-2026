import React, { useState, useMemo } from 'react';
import { EligibleOfficer, EstablishmentRecord, StructuredCorporatePlan } from '../types';
import { XIcon, DocumentChartBarIcon, UsersIcon, ClipboardDocumentListIcon, PresentationChartLineIcon } from './icons';
import { ExportMenu } from './ExportMenu';


// --- MAIN COMPONENT ---

type ReportType = 'full' | 'eligible' | 'cna' | 'yearly' | 'none';

interface ReportProps {
    division: string;
    officers: EligibleOfficer[];
    establishmentData?: EstablishmentRecord[];
    corporatePlanData?: StructuredCorporatePlan;
    yearHeaders: number[];
    onClose: () => void;
}

export const ReportingSuiteModal: React.FC<ReportProps> = ({ division, officers, yearHeaders, onClose }) => {
    const [currentReport, setCurrentReport] = useState<ReportType>('none');

    const reportMetadata = {
        full: {
            title: 'Full Training Plan',
            description: 'Comprehensive 5-year matrix tracking every officer\'s development journey and study history.',
            icon: PresentationChartLineIcon,
            color: 'from-blue-600 to-blue-400',
            glow: 'shadow-blue-500/20'
        },
        eligible: {
            title: 'Eligible Officers Summary',
            description: 'Filtered workforce view showing confirmed officers who have cleared CNA compliance.',
            icon: UsersIcon,
            color: 'from-emerald-600 to-emerald-400',
            glow: 'shadow-emerald-500/20'
        },
        cna: {
            title: 'Establishment Checklist',
            description: 'Audit-ready view of the establishment to track submission compliance across all divisions.',
            icon: ClipboardDocumentListIcon,
            color: 'from-amber-600 to-amber-400',
            glow: 'shadow-amber-500/20'
        },
        yearly: {
            title: 'Yearly Timeline',
            description: 'Chronological breakdown of planned training interventions sorted by implementation year.',
            icon: DocumentChartBarIcon,
            color: 'from-purple-600 to-purple-400',
            glow: 'shadow-purple-500/20'
        }
    };

    // ... (reportData useMemo logic remains same as previous turn)
    const reportData = useMemo(() => {
        if (currentReport === 'none') return null;
        switch (currentReport) {
            case 'eligible':
                return {
                    title: 'Eligible Officers Summary',
                    headers: ['Occupant', 'Designation', 'Position No.', 'Status', 'CNA Submission'],
                    rows: officers.filter(o => o.status === 'Confirmed' && o.cnaSubmission === 'Yes').map(o => [o.occupant, o.designation, o.positionNumber, o.status, o.cnaSubmission])
                };
            case 'cna':
                 return {
                    title: 'Establishment CNA Checklist',
                    headers: ['Occupant', 'Designation', 'Position No.', 'Status', 'CNA Submission'],
                    rows: officers.map(o => [o.occupant, o.designation, o.positionNumber, o.status, o.cnaSubmission])
                };
            case 'yearly':
                return {
                    title: 'Yearly Training Timeline',
                    headers: ['Occupant', 'Designation', 'Training Details', 'Planned Year'],
                    rows: officers.flatMap(o => o.trainingYear.map(year => ([o.occupant, o.designation, o.courseDetails || 'General Development', year]))).sort((a, b) => (a[3] as number) - (b[3] as number))
                };
            case 'full':
            default:
                return {
                    title: 'Full Training Plan Report',
                    headers: ['Branch/Division', 'Pos No.', 'Grade', 'Designation', 'Occupant', 'Status', 'CNA', ...yearHeaders.map(String)],
                    rows: officers.map(o => [o.branch, o.positionNumber, o.grade, o.designation, o.occupant, o.status, o.cnaSubmission, ...yearHeaders.map(year => (o.trainingYear.includes(year) ? '✓' : ''))])
                };
        }
    }, [currentReport, officers, yearHeaders]);

    return (
        <div className="fixed inset-0 bg-slate-900/95 z-[60] flex justify-center items-center p-4 backdrop-blur-md">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-7xl w-full flex flex-col h-[90vh] overflow-hidden border border-white/20">
                
                {/* Header Area */}
                <header className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-transparent">
                    <div className="flex items-center gap-6">
                        {currentReport !== 'none' && (
                            <button onClick={() => setCurrentReport('none')} className="group flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-900 hover:text-white transition-all">
                                <span className="text-lg">←</span>
                            </button>
                        )}
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                                Reporting Suite <span className="text-blue-600 not-italic opacity-50">/</span> {division}
                            </h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Data Matrix 2026</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-200/50 dark:shadow-none">
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    {currentReport === 'none' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {(Object.keys(reportMetadata) as ReportType[]).filter(k => k !== 'none').map((key) => {
                                const meta = reportMetadata[key as keyof typeof reportMetadata];
                                const Icon = meta.icon;
                                return (
                                    <button 
                                        key={key}
                                        onClick={() => setCurrentReport(key)}
                                        className="group relative flex flex-col p-8 bg-white dark:bg-slate-800/50 rounded-[2rem] border border-slate-200 dark:border-white/5 hover:border-blue-500 transition-all duration-500 hover:shadow-2xl text-left shadow-sm"
                                    >
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-white mb-6 shadow-xl ${meta.glow} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                            <Icon />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{meta.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                            {meta.description}
                                        </p>
                                        <div className="mt-8 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-[-10px] group-hover:translate-x-0">
                                                Open Report Context →
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                             {/* Export Bar */}
                             <div className="flex justify-end mb-6">
                                <ExportMenu onExport={() => {}} />
                             </div>
                             <div className="flex-1 overflow-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-900 text-white sticky top-0 uppercase font-black tracking-widest">
                                        <tr>
                                            {reportData?.headers.map(h => <th key={h} className="p-4">{h}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {reportData?.rows.map((row, i) => (
                                            <tr key={i} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                                                {row.map((c, j) => <td key={j} className="p-4 text-slate-600 dark:text-slate-300">{String(c)}</td>)}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
