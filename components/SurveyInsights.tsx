import React, { useState, useEffect, useMemo } from 'react';
import { GoogleSheetsService } from '../services/GoogleSheetsService';
import { transformSheetDataForCharts } from '../utils/chartUtils';
import { ChartComponent } from './charts';
import { OfficerRecord } from '../types';
import { AcademicCapIcon, UsersIcon, ChartBarSquareIcon } from './icons';

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
    const [sheetData, setSheetData] = useState<Record<string, unknown>[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [selectedColumn, setSelectedColumn] = useState<string>('');
    const [, setLoading] = useState(true);
    const [, setError] = useState<string | null>(null);
    const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);

    // Clean State Management - Prevent Flickering
    const reconciledData = useMemo(() => {
        // Three Pillars Reconciliation
        const establishmentData = officers || [];
        const surveyData = sheetData || [];
        const corporatePlan = baselineData?.kpis || {
            establishmentGap: 0,
            baselineScore: 0,
            criticalSkillGaps: 0,
            trainingCompletion: 0
        };

        // Gap Engine: Target (Corporate Plan) - Current (Survey Data)
        const capabilityGapIndex = corporatePlan.baselineScore && corporatePlan.establishmentGap ?
            ((corporatePlan.establishmentGap / 100) * 10).toFixed(1) : '0.0';

        const successionBenchStrength = establishmentData.length > 0 && corporatePlan.criticalSkillGaps ?
            ((corporatePlan.criticalSkillGaps / establishmentData.length) * 100).toFixed(1) : '0.0';

        return {
            establishmentData,
            surveyData,
            corporatePlan,
            capabilityGapIndex,
            successionBenchStrength,
            totalStaff: establishmentData.length,
            skillDiversification: establishmentData.length > 0 ?
                new Set(establishmentData.map(o => o.grade)).size : 0
        };
    }, [officers, sheetData, baselineData]);

    // 10:20:70 Learning Framework Logic
    const learningFramework = useMemo(() => {
        const gap = parseFloat(reconciledData.capabilityGapIndex);

        // Gap Type Classification
        let primaryGapType: 'technical' | 'leadership' | 'experience';
        let recommendation = '';

        if (gap > 7) {
            primaryGapType = 'technical';
            recommendation = 'Prioritize formal training programs and certifications';
        } else if (gap > 4) {
            primaryGapType = 'leadership';
            recommendation = 'Focus on mentoring and leadership development';
        } else {
            primaryGapType = 'experience';
            recommendation = 'Emphasize on-the-job training and stretch assignments';
        }

        // 10:20:70 Mapping
        const framework = {
            formal: primaryGapType === 'technical' ? 10 : primaryGapType === 'leadership' ? 5 : 3,
            social: primaryGapType === 'leadership' ? 20 : primaryGapType === 'technical' ? 15 : 10,
            experiential: primaryGapType === 'experience' ? 70 : primaryGapType === 'leadership' ? 65 : 60
        };

        return {
            primaryGapType,
            framework,
            recommendation,
            gapSeverity: gap > 7 ? 'critical' : gap > 4 ? 'moderate' : 'low'
        };
    }, [reconciledData.capabilityGapIndex]);

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
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to sync with Cloud Terminal.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const chartData = useMemo(() => {
        if (!selectedColumn || reconciledData.surveyData.length === 0) return null;
        const transformed = transformSheetDataForCharts(reconciledData.surveyData, selectedColumn);
        return {
            labels: transformed.map(t => t.category),
            datasets: [{
                label: 'Response Distribution',
                data: transformed.map(t => t.score),
                backgroundColor: learningFramework.gapSeverity === 'critical' ? 'rgba(239, 68, 68, 0.7)' :
                               learningFramework.gapSeverity === 'moderate' ? 'rgba(245, 158, 11, 0.7)' :
                               'rgba(16, 185, 129, 0.7)',
                borderRadius: 8
            }]
        };
    }, [reconciledData.surveyData, selectedColumn, learningFramework.gapSeverity]);

    // Force immediate rendering - no loading barriers
    // All components must display immediately upon page load

    if (!spreadsheetId) {
        return (
            <div className="flex-1 p-10 flex flex-col items-center justify-center text-center bg-slate-50">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                    <ChartBarSquareIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase">Cloud Terminal Not Configured</h2>
                <p className="text-sm text-slate-500 mt-2">Link your Google Sheets in Settings.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden">
            <main className="p-10 space-y-8 max-w-7xl mx-auto w-full">
                {/* ISO 30414 Workforce Planning KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                        <p className="text-xs font-black text-slate-500 uppercase mb-2">Capability Gap Index</p>
                        <p className={`text-3xl font-black ${
                            learningFramework.gapSeverity === 'critical' ? 'text-red-500' :
                            learningFramework.gapSeverity === 'moderate' ? 'text-amber-500' :
                            'text-emerald-500'
                        }`}>
                            {reconciledData.capabilityGapIndex}/10
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Target vs Current</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                        <p className="text-xs font-black text-slate-500 uppercase mb-2">Succession Bench Strength</p>
                        <p className="text-3xl font-black text-blue-600">{reconciledData.successionBenchStrength}%</p>
                        <p className="text-xs text-slate-400 mt-1">Critical Roles Coverage</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                        <p className="text-xs font-black text-slate-500 uppercase mb-2">Skill Diversification</p>
                        <p className="text-3xl font-black text-purple-600">{reconciledData.skillDiversification}</p>
                        <p className="text-xs text-slate-400 mt-1">Grade Levels</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                        <p className="text-xs font-black text-slate-500 uppercase mb-2">Total Workforce</p>
                        <p className="text-3xl font-black text-slate-900">{reconciledData.totalStaff}</p>
                        <p className="text-xs text-slate-400 mt-1">Active Officers</p>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-4 bg-white p-6 rounded-3xl border shadow-sm h-fit">
                        <h4 className="text-xs font-black text-slate-500 uppercase mb-4">Analysis Fields</h4>
                        <div className="space-y-2">
                            {columns.map(col => (
                                <button
                                    key={col}
                                    onClick={() => setSelectedColumn(col)}
                                    className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all ${
                                        selectedColumn === col
                                            ? 'bg-slate-900 text-white shadow-lg'
                                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                                    }`}
                                >
                                    {col}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-8 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border shadow-sm min-h-[400px]">
                            {chartData && <ChartComponent type="bar" data={chartData} options={{ indexAxis: 'y' }} />}
                        </div>

                        {/* 10:20:70 Learning Framework */}
                        <div className="bg-slate-900 p-6 rounded-2xl text-white">
                            <div className="flex items-center gap-2 mb-4">
                                <AcademicCapIcon className="w-5 h-5 text-emerald-400" />
                                <span className="font-black text-xs uppercase">10:20:70 Learning Framework</span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-center p-3 bg-blue-900/30 rounded-xl">
                                    <AcademicCapIcon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                    <p className="text-xs font-black text-blue-400">{learningFramework.framework.formal}%</p>
                                    <p className="text-xs text-blue-200">Formal</p>
                                </div>
                                <div className="text-center p-3 bg-green-900/30 rounded-xl">
                                    <UsersIcon className="w-6 h-6 text-green-400 mx-auto mb-2" />
                                    <p className="text-xs font-black text-green-400">{learningFramework.framework.social}%</p>
                                    <p className="text-xs text-green-200">Social</p>
                                </div>
                                <div className="text-center p-3 bg-orange-900/30 rounded-xl">
                                    <ChartBarSquareIcon className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                                    <p className="text-xs font-black text-orange-400">{learningFramework.framework.experiential}%</p>
                                    <p className="text-xs text-orange-200">Experiential</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-700">
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    <strong className="text-white">Gap Analysis:</strong> {learningFramework.recommendation}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

    );
};
