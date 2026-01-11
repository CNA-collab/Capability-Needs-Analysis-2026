/**
 * PNG National CNA - Succession Strategy Report
 * Replaces SVG placeholders with high-fidelity PNG branding.
 */

import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { OfficerRecord, EstablishmentRecord, AiSuccessionPlanReport } from '../types';
import { AI_SUCCESSION_PLAN_REPORT_PROMPT_INSTRUCTIONS } from '../constants';
import { XIcon, SparklesIcon, UsersIcon } from './icons';
import { ExportMenu } from './ExportMenu';
import { exportToPdf, exportToDocx, exportToXlsx, ReportData } from '../utils/export';

interface ReportProps {
  data: OfficerRecord[];
  establishmentData: EstablishmentRecord[];
  agencyName: string;
  onClose: () => void;
}

// SCHEMA DEFINITIONS
const successionCandidateSchema = {
    type: Type.OBJECT,
    properties: {
        roleOrPosition: { type: Type.STRING },
        potentialSuccessors: { type: Type.ARRAY, items: { type: Type.STRING } },
        readinessLevel: { type: Type.STRING, enum: ['Ready Now', '1-2 Years', '3-5 Years', 'Long-term'] },
        developmentNeeds: { type: Type.STRING, description: "Analyze gaps. Distinguish 'Skill' (workshop) vs 'Qualification' (diploma/degree) for target role grade." },
        estimatedTimeline: { type: Type.STRING },
    },
    required: ["roleOrPosition", "potentialSuccessors", "readinessLevel", "developmentNeeds", "estimatedTimeline"]
};

const aiSuccessionPlanReportSchema = {
    type: Type.OBJECT,
    properties: {
        executiveSummary: { type: Type.STRING },
        successionPlan: {
            type: Type.ARRAY,
            items: successionCandidateSchema
        }
    },
    required: ["executiveSummary", "successionPlan"],
};

// UPDATED: REAL PNG CREST COMPONENT
const PNGNationalCrest = () => (
    <div className="flex flex-col items-center justify-center mb-8 border-b-2 border-slate-100 pb-6">
        <div className="mb-4">
            <img 
                src="/Logo/PNG Crest.png" 
                alt="National Crest of Papua New Guinea" 
                className="w-28 h-auto drop-shadow-md"
            />
        </div>
        <p className="text-[11px] font-black text-[#1A365D] uppercase tracking-[0.4em]">Independent State of Papua New Guinea</p>
        <div className="w-16 h-1 bg-red-600 mt-2"></div>
    </div>
);

const ReportSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 mb-8 page-break-inside-avoid">
        <h2 className="text-xl font-bold text-[#1A365D] dark:text-blue-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 uppercase tracking-wider">{title}</h2>
        <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">{children}</div>
    </div>
);

export const SuccessionPlanReport: React.FC<ReportProps> = ({ data, establishmentData, agencyName, onClose }) => {
    const [report, setReport] = useState<AiSuccessionPlanReport | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generateReport = async () => {
            const apiKey = process.env.API_KEY || (window as any).ENV?.API_KEY;
            if (!apiKey) {
                setError("AI Engine Authorization Missing. Please check System Settings.");
                setLoading(false);
                return;
            }
            try {
                const ai = new GoogleGenAI({ apiKey });
                
                const promptText = `Generate a High-Fidelity Succession Plan for "${agencyName}".
                
                **Lifecycle Mapping (Mandatory):**
                Analyze qualifications vs grade requirements. If a successor lacks the required degree for a higher grade, prescribe SILAG or Tertiary interventions.
                
                Establishment Registry: ${JSON.stringify(establishmentData.slice(0, 50), null, 2)}
                CNA Records: ${JSON.stringify(data.map(o => ({ name: o.name, pos: o.position, grade: o.grade, qual: o.jobQualification, spa: o.spaRating })), null, 2)}
                `;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: promptText,
                    config: {
                        systemInstruction: AI_SUCCESSION_PLAN_REPORT_PROMPT_INSTRUCTIONS,
                        responseMimeType: "application/json",
                        responseSchema: aiSuccessionPlanReportSchema,
                    },
                });

                const textResponse = response.text || '';
                setReport(JSON.parse(textResponse.trim()));
            } catch (e) {
                console.error("Succession Plan Error:", e);
                setError("The AI Engine encountered an error analyzing the leadership pipeline.");
            } finally {
                setLoading(false);
            }
        };

        generateReport();
    }, [data, establishmentData, agencyName]);
    
    const handleExport = (format: 'pdf' | 'docx' | 'xlsx') => {
        if (!report) return;
        const reportData: ReportData = {
            title: `Succession Plan Report - ${agencyName}`,
            sections: [
                { title: "Executive Summary", content: [report.executiveSummary] },
                { 
                    title: "Strategic Succession Plan", 
                    content: [{
                        type: 'table',
                        headers: ['Critical Role', 'Successor Candidate(s)', 'Readiness', 'Development Needs / Actions', 'Estimated Timeline'],
                        rows: report.successionPlan.map(plan => [
                            plan.roleOrPosition,
                            plan.potentialSuccessors.join(', '),
                            plan.readinessLevel,
                            plan.developmentNeeds,
                            plan.estimatedTimeline
                        ])
                    }],
                    orientation: 'landscape'
                }
            ]
        };

        if(format === 'pdf') exportToPdf(reportData);
        else if (format === 'xlsx') exportToXlsx(reportData);
        else if (format === 'docx') exportToDocx(reportData);
    };
    
    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex justify-center items-start p-4 pt-12 animate-fade-in no-print overflow-y-auto">
            <div className="bg-slate-50 dark:bg-slate-950 rounded-[32px] shadow-2xl max-w-6xl w-full flex flex-col mb-12 overflow-hidden border border-white/10">
                <header className="flex justify-between items-center p-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                     <div className="flex items-center gap-5">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                             <UsersIcon className="w-8 h-8 text-[#1A365D] dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-[#1A365D] dark:text-white uppercase tracking-tighter">Succession Strategy</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional Leadership Pipeline & Risk Monitor</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <ExportMenu onExport={handleExport} />
                        <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-rose-600 hover:text-white rounded-2xl transition-all shadow-sm group">
                            <XIcon className="w-6 h-6 transition-transform group-hover:rotate-90" />
                        </button>
                    </div>
                </header>
                
                <main className="p-10 bg-white dark:bg-slate-900 min-h-[600px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-96">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 animate-pulse"></div>
                                <SparklesIcon className="w-16 h-16 text-blue-500 animate-spin-slow relative" />
                            </div>
                            <h2 className="mt-8 text-lg font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Analyzing Registry...</h2>
                        </div>
                    ) : error ? (
                        <div className="p-12 bg-rose-50 border-2 border-rose-100 text-rose-700 rounded-3xl text-center">
                            <p className="font-black uppercase tracking-widest text-sm mb-2">System Alert</p>
                            <p className="font-bold">{error}</p>
                        </div>
                    ) : report && (
                        <div className="animate-fade-in max-w-5xl mx-auto">
                            <PNGNationalCrest />
                            
                            <div className="text-center mb-12">
                                <h1 className="text-3xl font-black text-[#1A365D] dark:text-white tracking-[0.25em] uppercase">OFFICIAL SUCCESSION REGISTER</h1>
                                <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest border-t border-slate-100 pt-2 inline-block px-8">{agencyName}</p>
                            </div>

                            <ReportSection title="Executive Summary">
                                <p className="leading-relaxed text-md font-medium text-slate-700">{report.executiveSummary}</p>
                            </ReportSection>

                            <ReportSection title="Succession Strategy & Lifecycle Intervention">
                                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-[20px] shadow-sm">
                                    <table className="w-full text-left text-[11px] border-collapse">
                                        <thead className="bg-[#1A365D] text-white">
                                            <tr>
                                                <th className="p-5 uppercase tracking-widest font-black">Target Role</th>
                                                <th className="p-5 uppercase tracking-widest font-black">Identified Successor(s)</th>
                                                <th className="p-5 uppercase tracking-widest font-black text-center">Readiness</th>
                                                <th className="p-5 uppercase tracking-widest font-black">Development Needs / Actions</th>
                                                <th className="p-5 uppercase tracking-widest font-black text-center">Timeline</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {report.successionPlan.map((plan, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="p-5 font-bold text-slate-900 dark:text-white">{plan.roleOrPosition}</td>
                                                    <td className="p-5 font-semibold text-slate-700 dark:text-slate-200">{plan.potentialSuccessors.join(', ')}</td>
                                                    <td className="p-5 text-center">
                                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                            plan.readinessLevel === 'Ready Now' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            {plan.readinessLevel}
                                                        </span>
                                                    </td>
                                                    <td className="p-5 leading-relaxed font-medium text-slate-600 dark:text-slate-400">
                                                        {plan.developmentNeeds}
                                                    </td>
                                                    <td className="p-5 text-center font-black text-[#1A365D] dark:text-blue-400 whitespace-nowrap">{plan.estimatedTimeline}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </ReportSection>
                        </div>
                    )}
                </main>
                
                <footer className="p-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    <span>{CUSTODIAN}</span>
                    <span>Official Personnel Record - {new Date().getFullYear()}</span>
                </footer>
            </div>
        </div>
    );
};

const CUSTODIAN = "System Custodian: Department of Personnel Management (DPM)";