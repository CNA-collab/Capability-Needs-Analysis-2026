import React, { useState, useEffect, useMemo } from 'react';
import { GoogleSheetsService } from '../services/GoogleSheetsService';
import { transformSheetDataForCharts } from '../utils/chartUtils';
import { ChartComponent } from './charts';
import { OfficerRecord } from '../types';

// INTERNAL ICON DEFINITIONS (To stop "No exported member" warnings)
const ChartBarIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125-1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);
const GlobeAltIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.015 9.015 0 018.716 5.253M12 3a9.015 9.015 0 00-8.716 5.253m0 0a8.961 8.961 0 011.892 7.523M18.824 8.253a8.961 8.961 0 00-1.892 7.523" />
    </svg>
);
const ArrowPathIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);
const SparklesIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);

interface SurveyInsightsProps {
    officers: OfficerRecord[];
    baselineData: {
        agencyName: string;
        kpis: {
            establishmentGap: number;
            baselineScore: number;
            criticalSkillGaps: number;
            trainingCompletion: number;
        };
    };
}

export const SurveyInsights: React.FC<SurveyInsightsProps> = ({ officers, baselineData }) => {
    const [sheetData, setSheetData] = useState<any[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [selectedColumn, setSelectedColumn] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
    const [strategicMode, setStrategicMode] = useState(false);

    useEffect(() => {
        const savedId = localStorage.getItem('cna_system_spreadsheet_id');
        if (savedId) {
            setSpreadsheetId(savedId);
            fetchData(savedId);
        }
    }, []);

    const fetchData = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await GoogleSheetsService.fetchSurveyData(id);
            if (data && data.length > 0) {
                setSheetData(data);
                const headers = Object.keys(data[0]);
                setColumns(headers);
                const defaultCol = headers.find(h => h.includes('?') || h.toLowerCase().includes('rate')) || headers[0];
                setSelectedColumn(defaultCol);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to sync with Cloud Terminal.');
        } finally {
            setLoading(false);
        }
    };

    const chartData = useMemo(() => {
        if (!selectedColumn || sheetData.length === 0) return null;
        const transformed = transformSheetDataForCharts(sheetData, selectedColumn);
        return {
            labels: transformed.map(t => t.category),
            datasets: [{
                label: strategicMode ? 'Strategic Priority Matches' : 'Response Count',
                data: transformed.map(t => t.score),
                backgroundColor: 'rgba(26, 54, 93, 0.7)',
                borderRadius: 8
            }]
        };
    }, [sheetData, selectedColumn, strategicMode]);

    if (!spreadsheetId) {
        return (
            <div className="flex-1 p-10 flex flex-col items-center justify-center text-center bg-[#F4F7F9]">
                <GlobeAltIcon className="w-16 h-16 text-slate-300 mb-4" />
                <h2 className="text-xl font-black text-slate-900 uppercase">Cloud Terminal Not Configured</h2>
                <p className="text-sm text-slate-500 mt-2">Link your Google Sheets in Settings.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-[#F4F7F9] relative overflow-hidden">
            <header className="p-8 bg-white/80 backdrop-blur-md border-b flex justify-between items-center sticky top-0 z-20">
                <div>
                    <h1 className="text-2xl font-black text-[#1A365D] uppercase flex items-center gap-3">
                        <ChartBarIcon className="w-7 h-7" />
                        {baselineData.agencyName}
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        System Status: <span className="text-emerald-500 animate-pulse">● Active Analysis</span>
                    </p>
                </div>
                <button onClick={() => fetchData(spreadsheetId)} className="px-6 py-2 bg-[#1A365D] text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                    <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Data
                </button>
            </header>

            <main className="p-10 space-y-8 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Establishment Gap</p>
                        <p className="text-2xl font-black text-rose-600">{baselineData.kpis.establishmentGap}%</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Baseline Score</p>
                        <p className="text-2xl font-black text-blue-600">{baselineData.kpis.baselineScore}/10</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Skill Gaps</p>
                        <p className="text-2xl font-black text-amber-600">{baselineData.kpis.criticalSkillGaps}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Training Done</p>
                        <p className="text-2xl font-black text-emerald-600">{baselineData.kpis.trainingCompletion}%</p>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-4 bg-white p-6 rounded-3xl border shadow-sm h-fit">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4">Fields</h4>
                        <div className="space-y-2">
                            {columns.map(col => (
                                <button key={col} onClick={() => setSelectedColumn(col)} className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all ${selectedColumn === col ? 'bg-[#1A365D] text-white shadow-lg' : 'bg-slate-50 hover:bg-slate-100'}`}>
                                    {col}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-8 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border shadow-sm min-h-[400px]">
                            {chartData && <ChartComponent type="bar" data={chartData} options={{ indexAxis: 'y' }} />}
                        </div>
                        <div className="bg-[#1A365D] p-6 rounded-2xl text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <SparklesIcon className="w-5 h-5 text-emerald-400" />
                                <span className="font-black text-xs uppercase">10:20:70 Recommendation</span>
                            </div>
                            <p className="text-xs text-blue-100 leading-relaxed">
                                To address the 18% gap in {selectedColumn}, focus 20% on internal mentoring and 70% on task-based learning.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};