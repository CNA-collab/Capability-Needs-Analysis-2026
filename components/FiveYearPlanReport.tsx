import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { OfficerRecord, EstablishmentRecord, AgencyType, AiFiveYearPlan, FiveYearPlanByDivision, QUESTION_TEXT_MAPPING } from '../types';
import { AI_FIVE_YEAR_PLAN_PROMPT_INSTRUCTIONS } from '../constants';
import { XIcon, SparklesIcon, ArrowPathIcon, DocumentChartBarIcon, ArrowLeftIcon, ArrowRightIcon, HomeIcon } from './icons';
import { ExportMenu } from './ExportMenu';
import { exportToPdf, exportToDocx, exportToXlsx, ReportData } from '../utils/export';
import { saveReportToCache, getReportFromCache, clearReportCache } from '../utils/reportCache';

interface FiveYearPlanReportProps {
  data: OfficerRecord[];
  establishmentData: EstablishmentRecord[];
  agencyType: AgencyType;
  agencyName: string;
  onClose: () => void;
}

const CACHE_KEY_FIVE_YEAR_PLAN = 'cna_five_year_plan_report';

const aiReportSummarySchema = {
    type: Type.OBJECT,
    properties: {
        totalGapsDetected: { type: Type.NUMBER },
        criticalGapsCount: { type: Type.NUMBER },
        staffCategoryDistribution: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    category: { type: Type.STRING },
                    count: { type: Type.NUMBER },
                },
                required: ["category", "count"],
            }
        },
        topImprovementAreas: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    area: { type: Type.STRING },
                    reason: { type: Type.STRING },
                },
                required: ["area", "reason"],
            }
        },
        concludingIntervention: { type: Type.STRING },
    },
    required: ["totalGapsDetected", "criticalGapsCount", "staffCategoryDistribution", "topImprovementAreas", "concludingIntervention"]
};

const fiveYearPlanItemSchema = {
    type: Type.OBJECT,
    properties: {
        positionNumber: { type: Type.STRING },
        grade: { type: Type.STRING },
        designation: { type: Type.STRING },
        occupant: { type: Type.STRING },
        proposedCourse: { type: Type.STRING },
        institution: { type: Type.STRING },
        year2026: { type: Type.STRING },
        year2027: { type: Type.STRING },
        year2028: { type: Type.STRING },
        year2029: { type: Type.STRING },
        year2030: { type: Type.STRING },
    },
    required: ["positionNumber", "grade", "designation", "occupant", "proposedCourse", "institution", "year2026", "year2027", "year2028", "year2029", "year2030"]
};

const fiveYearPlanDivisionSchema = {
    type: Type.OBJECT,
    properties: {
        division: { type: Type.STRING },
        positions: {
            type: Type.ARRAY,
            items: fiveYearPlanItemSchema
        }
    },
    required: ["division", "positions"]
};

const aiFiveYearPlanSchema = {
    type: Type.OBJECT,
    properties: {
        executiveSummary: { type: Type.STRING },
        trainingPlan: {
            type: Type.ARRAY,
            items: fiveYearPlanDivisionSchema
        },
        summary: aiReportSummarySchema
    },
    required: ["executiveSummary", "trainingPlan", "summary"]
};


const ReportSection: React.FC<{ title: string; children: React.ReactNode; anchorId?: string }> = ({ title, children, anchorId }) => (
    <div className="pt-4 mb-4" id={anchorId}>
        <h2 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100 border-b border-slate-300 dark:border-slate-600 pb-1">{title}</h2>
        <div className="text-slate-700 dark:text-slate-300 text-sm space-y-2">{children}</div>
    </div>
);

/* trunk-ignore(git-diff-check/error) */
export const FiveYearPlanReport: React.FC<FiveYearPlanReportProps> = ({ 
    data, 
    establishmentData, 
    agencyType, 
    agencyName, 
    onClose 
}) => {
    const [report, setReport] = useState<AiFiveYearPlan | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

    const promptContext = useMemo(() => {
        if (agencyName && agencyType !== 'All Agencies') {
            return `The analysis should be tailored for a '${agencyName}', a '${agencyType}'.`;
        }
        if (agencyType !== 'All Agencies') {
            return `The analysis should be tailored for a '${agencyType}'.`;
        }
        return 'The analysis should be general and applicable for all agencies.';
    }, [agencyType, agencyName]);

    // Prepare data for AI analysis
    const analysisData = useMemo(() => {
        return {
            officerData: data,
            establishmentData: establishmentData
        };
    }, [data, establishmentData]);

    const generateReport = async () => {
        setLoading(true);
        setError(null);
        if (!process.env.GEMINI_API_KEY) {
            setError("API key is not configured.");
            setLoading(false);
            return;
        }
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            
            const promptText = `Please analyze the following CNA data and establishment register to generate a comprehensive 5-year Learning & Development Plan (2026-2030).

CONTEXT: ${promptContext}

DATA:
${JSON.stringify(analysisData, null, 2)}`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `You MUST use this mapping to understand question codes: ${JSON.stringify(QUESTION_TEXT_MAPPING, null, 2)}\n${promptText}`,
                config: {
                    systemInstruction: AI_FIVE_YEAR_PLAN_PROMPT_INSTRUCTIONS,
                    responseMimeType: "application/json",
                    responseSchema: aiFiveYearPlanSchema,
                },
            });

            const jsonStr = response.text?.trim() || '{}';
            const result = JSON.parse(jsonStr) as AiFiveYearPlan;
            setReport(result);
            saveReportToCache(CACHE_KEY_FIVE_YEAR_PLAN, result);
        } catch (e) {
            console.error("AI Five Year Plan Error:", e);
            setError("An error occurred while generating the 5-year training plan.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const cachedData = getReportFromCache<AiFiveYearPlan>(CACHE_KEY_FIVE_YEAR_PLAN);
        if (cachedData) {
            setReport(cachedData);
            setLoading(false);
        } else {
            generateReport();
        }
    }, [analysisData, promptContext]);

    const handleRefresh = () => {
        clearReportCache(CACHE_KEY_FIVE_YEAR_PLAN);
        generateReport();
    };

    const getReportDataForExport = (): ReportData => {
        if (!report) throw new Error("Report not available");
        
        // Flatten the data for export
        const tableData: { headers: string[], rows: string[][] } = {
            headers: ['Division', 'Position No.', 'Grade', 'Designation', 'Occupant', 'Proposed Training Course', 'Institution', '2026', '2027', '2028', '2029', '2030'],
            rows: []
        };

        report.trainingPlan.forEach((division: FiveYearPlanByDivision) => {
            division.positions.forEach((position) => {
                tableData.rows.push([
                    division.division,
                    position.positionNumber,
                    position.grade,
                    position.designation,
                    position.occupant,
                    position.proposedCourse,
                    position.institution,
                    position.year2026,
                    position.year2027,
                    position.year2028,
                    position.year2029,
                    position.year2030
                ]);
            });
        });

        return {
            title: `Five Year Training Plan 2026-2030 - ${agencyName || 'Organization'}`,
            sections: [
                { title: "Executive Summary", content: [report.executiveSummary] },
                { 
                    title: "Training Plan by Division", 
                    content: [{
                        type: 'table',
                        headers: tableData.headers,
                        rows: tableData.rows
                    }]
                }
            ]
        };
    };
    
    const handleExport = (format: 'pdf' | 'xlsx' | 'docx') => {
        try {
            const reportData = getReportDataForExport();
            if(format === 'pdf') {
                 exportToPdf(reportData);
            } else if (format === 'xlsx') {
                 exportToXlsx(reportData);
            } else if (format === 'docx') {
                 exportToDocx(reportData);
            }
        } catch(e) {
             console.error("Export failed:", e);
             alert("Could not export report.");
        }
    };

    const renderDivisionTable = (division: FiveYearPlanByDivision) => (
        <div className="mb-8" key={division.division}>
            <h3 className="text-lg font-bold text-[#1A365D] mb-4 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                {division.division}
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-[#1A365D] text-white">
                        <tr>
                            <th className="p-2 font-semibold">Pos No.</th>
                            <th className="p-2 font-semibold">Grade</th>
                            <th className="p-2 font-semibold">Designation</th>
                            <th className="p-2 font-semibold">Occupant</th>
                            <th className="p-2 font-semibold">Proposed Training Course</th>
                            <th className="p-2 font-semibold">Institution</th>
                            <th className="p-2 font-semibold text-center">2026</th>
                            <th className="p-2 font-semibold text-center">2027</th>
                            <th className="p-2 font-semibold text-center">2028</th>
                            <th className="p-2 font-semibold text-center">2029</th>
                            <th className="p-2 font-semibold text-center">2030</th>
                        </tr>
                    </thead>
                    <tbody>
                        {division.positions.map((position, idx) => (
                            <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/20">
                                <td className="p-2 font-medium">{position.positionNumber}</td>
                                <td className="p-2">{position.grade}</td>
                                <td className="p-2">{position.designation}</td>
                                <td className="p-2">{position.occupant}</td>
                                <td className="p-2">{position.proposedCourse}</td>
                                <td className="p-2">{position.institution}</td>
                                <td className="p-2 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        position.year2026 === 'Yes' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'text-gray-400'
                                    }`}>
                                        {position.year2026}
                                    </span>
                                </td>
                                <td className="p-2 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        position.year2027 === 'Yes' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'text-gray-400'
                                    }`}>
                                        {position.year2027}
                                    </span>
                                </td>
                                <td className="p-2 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        position.year2028 === 'Yes' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'text-gray-400'
                                    }`}>
                                        {position.year2028}
                                    </span>
                                </td>
                                <td className="p-2 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        position.year2029 === 'Yes' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'text-gray-400'
                                    }`}>
                                        {position.year2029}
                                    </span>
                                </td>
                                <td className="p-2 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        position.year2030 === 'Yes' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'text-gray-400'
                                    }`}>
                                        {position.year2030}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const sections = useMemo(() => {
        if (!report) return [];
        return [
            {
                title: "Executive Summary",
                content: (
                    <ReportSection title="Executive Summary" anchorId="exec-summary">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <p className="text-lg leading-relaxed">{report.executiveSummary}</p>
                        </div>
                        {report.summary && (
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Gaps Detected</p>
                                    <p className="text-2xl font-bold text-[#1A365D] dark:text-white">{report.summary.totalGapsDetected}</p>
                                </div>
                                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Critical Gaps</p>
                                    <p className="text-2xl font-bold text-red-600">{report.summary.criticalGapsCount}</p>
                                </div>
                                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Concluding Intervention</p>
                                    <p className="text-sm font-medium text-[#1A365D] dark:text-white">{report.summary.concludingIntervention}</p>
                                </div>
                            </div>
                        )}
                    </ReportSection>
                )
            },
            {
                title: "Training Plan by Division",
                content: (
                    <ReportSection title="2026-2030 Training Plan by Division" anchorId="training-plan">
                        <div className="bg-white dark:bg-gray-800 rounded-lg">
                            <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <h4 className="font-bold text-[#1A365D] dark:text-white">
                                    SUMMARY OF {agencyName?.toUpperCase() || '[DEPARTMENT/AGENCY/ORGANISATION NAME]'}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    2026 – 2030 LEARNING & DEVELOPMENT PLAN
                                </p>
                            </div>
                            {report.trainingPlan.map((division: FiveYearPlanByDivision) => renderDivisionTable(division))}
                        </div>
                    </ReportSection>
                )
            }
        ];
    }, [report, agencyName]);

    const handlePrev = () => setCurrentSectionIndex(prev => Math.max(0, prev - 1));
    const handleNext = () => setCurrentSectionIndex(prev => Math.min(sections.length - 1, prev + 1));

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 min-h-[400px]">
                    <SparklesIcon className="w-16 h-16 text-purple-500 animate-pulse" />
                    <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-100">Generating 5-Year Training Plan...</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Gemini is analyzing workforce data to create a comprehensive 2026-2030 training roadmap.</p>
                </div>
            );
        }
        if (error) {
            return (
                 <div className="p-8 bg-red-50 dark:bg-red-900/20 rounded-lg min-h-[400px] text-center">
                    <XIcon className="w-16 h-16 text-red-500 mx-auto" />
                    <h2 className="mt-4 text-2xl font-bold text-red-700 dark:text-red-300">Analysis Failed</h2>
                    <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
                    <button onClick={handleRefresh} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Retry</button>
                </div>
            );
        }
        if (report && sections.length > 0) {
            return (
                <div className="space-y-6">
                    {sections[currentSectionIndex].content}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start p-4 pt-12 animate-fade-in" aria-modal="true" role="dialog">
            <div className="bg-gray-100 dark:bg-gray-900 rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                     <div className="flex items-center gap-3">
                        <DocumentChartBarIcon className="w-7 h-7 text-purple-500" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Five Year Training Plan (2026-2030)</h1>
                    </div>
                     <div className="flex items-center gap-4">
                        <button 
                            onClick={handleRefresh} 
                            disabled={loading}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
                            title="Refresh Analysis"
                        >
                            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                        <ExportMenu onExport={handleExport as unknown as (format: 'pdf' | 'xlsx' | 'docx') => void} />
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Close report">
                            <XIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </header>
                <main className="overflow-y-auto p-6 flex-1">
                    {renderContent()}
                </main>
                {/* Navigation Bar */}
                {report && (
                    <footer className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center flex-shrink-0">
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md"
                        >
                            <HomeIcon className="w-4 h-4" />
                            <span>Home</span>
                        </button>
                        
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handlePrev}
                                disabled={currentSectionIndex === 0}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowLeftIcon className="w-4 h-4" />
                                <span>Previous Section</span>
                            </button>
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                Section {currentSectionIndex + 1} of {sections.length}
                            </span>
                            <button
                                onClick={handleNext}
                                disabled={currentSectionIndex === sections.length - 1}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>Next Section</span>
                                <ArrowRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};
