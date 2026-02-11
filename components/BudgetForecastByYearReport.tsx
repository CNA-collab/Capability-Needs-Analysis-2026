import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { OfficerRecord, AiBudgetForecastByYearReport, QUESTION_TEXT_MAPPING, AgencyType } from '../types';
import { AI_TRAINING_PLAN_PROMPT_INSTRUCTIONS } from '../constants';
import { XIcon, SparklesIcon, CurrencyDollarIcon } from './icons';
import { ExportMenu } from './ExportMenu';
import { exportToPdf, exportToXlsx, ReportData, exportToDocx } from '../utils/export';

interface ReportProps {
  data: OfficerRecord[];
  agencyType: AgencyType;
  agencyName: string;
  onClose: () => void;
}

const aiBudgetForecastSchema = {
    type: Type.OBJECT,
    properties: {
        executiveSummary: { type: Type.STRING },
        budgetForecasts: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    year: { type: Type.NUMBER },
                    totalBudget: { type: Type.STRING },
                    trainingBudget: { type: Type.STRING },
                    developmentBudget: { type: Type.STRING },
                    fundingSources: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                source: { type: Type.STRING },
                                amount: { type: Type.STRING },
                                allocation: { type: Type.STRING }
                            },
                            required: ["source", "amount", "allocation"]
                        }
                    },
                    projectedCosts: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                category: { type: Type.STRING },
                                amount: { type: Type.STRING },
                                justification: { type: Type.STRING }
                            },
                            required: ["category", "amount", "justification"]
                        }
                    }
                },
                required: ["year", "totalBudget", "trainingBudget", "developmentBudget", "fundingSources", "projectedCosts"]
            }
        },
        budgetSummary: { type: Type.STRING }
    },
    required: ["executiveSummary", "budgetForecasts", "budgetSummary"]
};

const ReportSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">{title}</h2>
        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">{children}</div>
    </div>
);

export const BudgetForecastByYearReport: React.FC<ReportProps> = ({ data, agencyType, agencyName, onClose }) => {
    const [report, setReport] = useState<AiBudgetForecastByYearReport | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const promptContext = useMemo(() => {
        if (agencyName && agencyType !== 'All Agencies') {
            return `The analysis should be tailored for a '${agencyName}', a '${agencyType}'.`;
        }
        if (agencyType !== 'All Agencies') {
            return `The analysis should be tailored for a '${agencyType}'.`;
        }
        return 'The analysis should be general and applicable for all agencies.';
    }, [agencyType, agencyName]);

    useEffect(() => {
        const generateReport = async () => {
            if (!process.env.GEMINI_API_KEY) {
                setError("API key is not configured.");
                setLoading(false);
                return;
            }
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                const promptText = `Please analyze the following CNA data and generate a budget forecast by year for training and development needs.\n\nCONTEXT: ${promptContext}\n\nDATA:\n${JSON.stringify(data, null, 2)}`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: `You MUST use this mapping to understand the question codes: ${JSON.stringify(QUESTION_TEXT_MAPPING, null, 2)}\n${promptText}`,
                    config: {
                        systemInstruction: AI_TRAINING_PLAN_PROMPT_INSTRUCTIONS,
                        responseMimeType: "application/json",
                        responseSchema: aiBudgetForecastSchema,
                    },
                });
                setReport(JSON.parse(response.text.trim()) as AiBudgetForecastByYearReport);
            } catch (e) {
                console.error("AI Budget Forecast Error:", e);
                setError("An error occurred while generating the AI analysis for the budget forecast.");
            } finally {
                setLoading(false);
            }
        };
        generateReport();
    }, [data, promptContext]);

    const getReportDataForExport = (): ReportData => {
        if (!report) throw new Error("Report not available");

        const sections: { title: string; content: (string | { type: 'table'; headers: string[]; rows: string[][] })[] }[] = [
            { title: "Executive Summary", content: [report.executiveSummary] }
        ];

        report.budgetForecasts.forEach(forecast => {
            sections.push({
                title: `Budget Forecast - ${forecast.year}`,
                content: [
                    `Total Budget: ${forecast.totalBudget}`,
                    `Training Budget: ${forecast.trainingBudget}`,
                    `Development Budget: ${forecast.developmentBudget}`,
                    {
                        type: 'table',
                        headers: ['Funding Source', 'Amount', 'Allocation'],
                        rows: forecast.fundingSources.map(source => [source.source, source.amount, source.allocation])
                    },
                    {
                        type: 'table',
                        headers: ['Cost Category', 'Amount', 'Justification'],
                        rows: forecast.projectedCosts.map(cost => [cost.category, cost.amount, cost.justification])
                    }
                ]
            });
        });

        sections.push({ title: "Budget Summary", content: [report.budgetSummary] });

        return {
            title: `Budget Forecast by Year - ${agencyName}`,
            sections
        };
    };
    
    const handleExport = (format: 'pdf' | 'docx' | 'xlsx' | 'csv' | 'sheets' | 'json' | 'print') => {
        if (format === 'pdf' || format === 'xlsx' || format === 'docx') {
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
        } else {
            console.warn(`Export format '${format}' is not supported for this report.`);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 min-h-[400px]">
                    <SparklesIcon className="w-16 h-16 text-purple-500 animate-pulse" />
                    <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100">Generating Budget Forecast...</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Gemini is analyzing training costs and projecting budget requirements.</p>
                </div>
            );
        }
        if (error) {
            return (
                 <div className="p-8 bg-red-50 dark:bg-red-900/20 rounded-lg min-h-[400px] text-center">
                    <XIcon className="w-16 h-16 text-red-500 mx-auto" />
                    <h2 className="mt-4 text-2xl font-bold text-red-700 dark:text-red-300">Analysis Failed</h2>
                    <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
                </div>
            );
        }
        if (report) {
            return (
                <div className="space-y-6">
                    <ReportSection title="Executive Summary">
                        <p>{report.executiveSummary}</p>
                    </ReportSection>

                    {report.budgetForecasts.map((forecast, index) => (
                        <ReportSection key={index} title={`Budget Forecast - ${forecast.year}`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">Total Budget</h3>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{forecast.totalBudget}</p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                    <h3 className="font-semibold text-green-800 dark:text-green-200">Training Budget</h3>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{forecast.trainingBudget}</p>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                                    <h3 className="font-semibold text-purple-800 dark:text-purple-200">Development Budget</h3>
                                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{forecast.developmentBudget}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Funding Sources</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-200 dark:bg-gray-700/50 text-xs uppercase">
                                            <tr>
                                                <th className="p-2 font-semibold">Source</th>
                                                <th className="p-2 font-semibold">Amount</th>
                                                <th className="p-2 font-semibold">Allocation</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {forecast.fundingSources.map((source, idx) => (
                                                <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/20">
                                                    <td className="p-2 font-semibold">{source.source}</td>
                                                    <td className="p-2">{source.amount}</td>
                                                    <td className="p-2">{source.allocation}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3">Projected Costs</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-200 dark:bg-gray-700/50 text-xs uppercase">
                                            <tr>
                                                <th className="p-2 font-semibold">Category</th>
                                                <th className="p-2 font-semibold">Amount</th>
                                                <th className="p-2 font-semibold">Justification</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {forecast.projectedCosts.map((cost, idx) => (
                                                <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/20">
                                                    <td className="p-2 font-semibold">{cost.category}</td>
                                                    <td className="p-2">{cost.amount}</td>
                                                    <td className="p-2 text-xs">{cost.justification}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </ReportSection>
                    ))}

                    <ReportSection title="Budget Summary">
                        <p>{report.budgetSummary}</p>
                    </ReportSection>
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
                        <CurrencyDollarIcon className="w-7 h-7 text-green-500" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budget Forecast by Year</h1>
                    </div>
                     <div className="flex items-center gap-4">
                        <ExportMenu onExport={handleExport} />
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Close report">
                            <XIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </header>
                <main className="overflow-y-auto p-6">
                    {renderContent()}
                </main>
                 <footer className="text-center p-2 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <p className="text-xs text-slate-500 dark:text-gray-400">Analysis generated by Google Gemini. Please verify critical information.</p>
                </footer>
            </div>
        </div>
    );
};
