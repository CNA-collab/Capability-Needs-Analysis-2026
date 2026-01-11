import React, { useState, useMemo } from 'react';
import { EligibleOfficer } from '../types';
import { XIcon, ArrowLeftIcon } from './icons';
import { ExportMenu } from './ExportMenu';
import { exportToPdf, exportToDocx, exportToXlsx, exportToCsv, ReportData } from '../utils/export';

// --- CUSTOM 2026 ICON SUITE ---

const FullPlanIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const EligibleIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
    </svg>
);

const ChecklistIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25v-2.25z" />
    </svg>
);

const TimelineIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
    </svg>
);

// --- MAIN COMPONENT ---

type ReportType = 'full' | 'eligible' | 'cna' | 'yearly' | 'none';

interface ReportProps {
    division: string;
    officers: EligibleOfficer[];
    yearHeaders: number[];
    onClose: () => void;
}

export const ReportingSuiteModal: React.FC<ReportProps> = ({ division, officers, yearHeaders, onClose }) => {
    const [currentReport, setCurrentReport] = useState<ReportType>('none');

    const reportMetadata = {
        full: {
            title: 'Full Training Plan',
            description: 'Comprehensive 5-year matrix tracking every officer’s development journey and study history.',
            icon: FullPlanIcon,
            color: 'from-blue-600 to-blue-400',
            glow: 'shadow-blue-500/20'
        },
        eligible: {
            title: 'Eligible Officers Summary',
            description: 'Filtered workforce view showing confirmed officers who have cleared CNA compliance.',
            icon: EligibleIcon,
            color: 'from-emerald-600 to-emerald-400',
            glow: 'shadow-emerald-500/20'
        },
        cna: {
            title: 'Establishment Checklist',
            description: 'Audit-ready view of the establishment to track submission compliance across all divisions.',
            icon: ChecklistIcon,
            color: 'from-amber-600 to-amber-400',
            glow: 'shadow-amber-500/20'
        },
        yearly: {
            title: 'Yearly Timeline',
            description: 'Chronological breakdown of planned training interventions sorted by implementation year.',
            icon: TimelineIcon,
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
                                <ArrowLeftIcon className="w-5 h-5" />
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
                                <ExportMenu onExport={((format: any) => {}) as any} />
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