import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { OfficerRecord, AgencyType, SuccessionCandidate } from '../types';
import { AI_GAP_ANALYSIS_REPORT_PROMPT_INSTRUCTIONS } from '../constants';
import { ReportTemplate } from './ReportTemplate';
import { SuccessionPlanningTable } from './SuccessionPlanningTable';
import { exportToPdf, exportToDocx, exportToXlsx, ReportData } from '../utils/export';
import { ChartComponent } from './charts';

// SPA Ratings baseline configuration
const SPA_BASELINE = {
  rating1: 10,  // Rating 1: 10% target
  rating2: 20,  // Rating 2: 20% target
  rating3: 30,  // Rating 3: 30% target
  rating4: 25,  // Rating 4: 25% target
  rating5: 15   // Rating 5: 15% target
};

// Training recommendations by rating bracket
const TRAINING_RECOMMENDATIONS = {
  rating1: 'Formal Training - Overseas (10%)',
  rating2: 'In-House Coaching / On-the-Job (70%)',
  rating3: 'Peer Mentorship (20%)',
  rating4: 'Task Diversification',
  rating5: 'Communities of Practice'
};

// Calculate SPA Ratings delta
const calculateSPADelta = (currentRatings: Record<string, number>) => {
  const delta: Record<string, number> = {};
  Object.keys(SPA_BASELINE).forEach(rating => {
    const current = currentRatings[rating] || 0;
    delta[rating] = current - SPA_BASELINE[rating];
  });
  return delta;
};

// Generate training recommendations
const generateTrainingRecommendations = (delta: Record<string, number>) => {
  const recommendations: Array<{
    rating: string;
    current: number;
    target: number;
    delta: number;
    recommendation: string;
  }> = [];

  Object.keys(delta).forEach(rating => {
    const current = SPA_BASELINE[rating] + delta[rating];
    const target = SPA_BASELINE[rating];
    const recommendation = delta[rating] < 0 ? TRAINING_RECOMMENDATIONS[rating] : 'Maintain Current Level';

    recommendations.push({
      rating,
      current,
      target,
      delta: delta[rating],
      recommendation
    });
  });

  return recommendations;
};

// SPA Ratings bar chart data
const createSPABarChartData = (delta: Record<string, number>) => {
  const labels = Object.keys(delta);
  const positiveData = labels.map(rating => Math.max(0, delta[rating]));
  const negativeData = labels.map(rating => Math.min(0, delta[rating]));

  return {
    labels,
    datasets: [
      {
        label: 'Above Target',
        data: positiveData,
        backgroundColor: '#10b981',
        stack: 'Stack 0'
      },
      {
        label: 'Below Target',
        data: negativeData,
        backgroundColor: '#ef4444',
        stack: 'Stack 0'
      }
    ]
  };
};

interface GapAnalysisReport {
    executiveSummary: string;
    prioritizedGaps: Array<{
        gapName: string;
        type: string;
        impact: string;
        context: string;
        actionableIntervention: string;
    }>;
    successionPlan: SuccessionCandidate[];
    spaRatings: {
        currentRatings: Record<string, number>;
        baselineRatings: Record<string, number>;
        deltaRatings: Record<string, number>;
        trainingRecommendations: Array<{
            rating: string;
            current: number;
            target: number;
            delta: number;
            recommendation: string;
        }>;
    };
}

interface ReportProps {
  data: OfficerRecord[];
  agencyType: AgencyType;
  agencyName: string;
  onClose: () => void;
}

const aiGapAnalysisReportSchema = {
    type: Type.OBJECT,
    properties: {
        executiveSummary: { type: Type.STRING },
        prioritizedGaps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    gapName: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['[SKILL GAP]', '[QUALIFICATION GAP]'] },
                    impact: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                    context: { type: Type.STRING },
                    actionableIntervention: { type: Type.STRING, description: "Detailed 70:20:10 or Academic pathway recommendation." }
                },
                required: ["gapName", "type", "impact", "context", "actionableIntervention"]
            }
        },
        successionPlan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    roleOrPosition: { type: Type.STRING },
                    potentialSuccessors: { type: Type.ARRAY, items: { type: Type.STRING } },
                    readinessLevel: { type: Type.STRING },
                    developmentNeeds: { type: Type.STRING },
                    estimatedTimeline: { type: Type.STRING }
                },
                required: ["roleOrPosition", "potentialSuccessors", "readinessLevel", "developmentNeeds", "estimatedTimeline"]
            }
        },
        spaRatings: {
            type: Type.OBJECT,
            properties: {
                currentRatings: { type: Type.OBJECT },
                baselineRatings: { type: Type.OBJECT },
                deltaRatings: { type: Type.OBJECT },
                trainingRecommendations: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            rating: { type: Type.STRING },
                            current: { type: Type.NUMBER },
                            target: { type: Type.NUMBER },
                            delta: { type: Type.NUMBER },
                            recommendation: { type: Type.STRING }
                        },
                        required: ["rating", "current", "target", "delta", "recommendation"]
                    }
                }
            },
            required: ["currentRatings", "baselineRatings", "deltaRatings", "trainingRecommendations"]
        }
    },
    required: ["executiveSummary", "prioritizedGaps", "successionPlan", "spaRatings"]
};

export const CapabilityGapAnalysisReport: React.FC<ReportProps> = ({ data, agencyName, onClose }) => {
    const [report, setReport] = useState<GapAnalysisReport | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [spaChartData] = useState<any>(null);

    // Task progress tracking
    const [taskProgress, setTaskProgress] = useState<{
        completed: string[];
        total: string[];
    }>({
        completed: [],
        total: [
            'Initialize component state',
            'Generate AI report',
            'Process SPA Ratings data',
            'Render report sections',
            'Handle export functionality',
            'Display error states'
        ]
    });

    const handleExport = (format: 'pdf' | 'docx' | 'xlsx') => {
        if (!report) return;
        const reportData: ReportData = {
            title: `Capability Gap Analysis - ${agencyName}`,
            sections: [
                { title: "Executive Strategic Overview", content: [report.executiveSummary] },
                {
                    title: "Prioritized Institutional Gaps",
                    content: [{
                        type: 'table',
                        headers: ['Capability Area', 'Gap Classification', 'Impact', 'Strategic Context', 'Recommended Intervention'],
                        rows: report.prioritizedGaps.map((g) => [
                            g.gapName, g.type, g.impact, g.context, g.actionableIntervention
                        ])
                    }],
                    orientation: 'landscape'
                },
                {
                    title: "SPA Ratings Analysis",
                    content: [{
                        type: 'table',
                        headers: ['Rating', 'Current %', 'Target %', 'Delta %', 'Training Recommendation'],
                        rows: report.spaRatings.trainingRecommendations.map((r: any) => [
                            r.rating, r.current, r.target, r.delta, r.recommendation
                        ])
                    }],
                    orientation: 'landscape'
                },
                {
                    title: "Critical Role Succession Track",
                    content: [{
                        type: 'table',
                        headers: ['Role', 'Candidates', 'Readiness', 'Development Plan', 'Estimated Time'],
                        rows: report.successionPlan.map((s: SuccessionCandidate) => [
                            s.roleOrPosition, s.potentialSuccessors.join(', '), s.readinessLevel, s.developmentNeeds, s.estimatedTimeline
                        ])
                    }],
                    orientation: 'landscape'
                }
            ]
        };

        if (format === 'pdf') exportToPdf(reportData);
        else if (format === 'xlsx') exportToXlsx(reportData);
        else if (format === 'docx') exportToDocx(reportData);
    };

    if (error) {
        return (
            <ReportTemplate
                title="Capability Gap Analysis"
                subtitle={agencyName}
                onClose={onClose}
                onExport={handleExport}
                loading={false}
            >
                <div className="flex items-center justify-center py-32">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-black text-rose-600 uppercase tracking-widest mb-2">Analysis Failed</h3>
                        <p className="text-slate-600 font-medium">{error}</p>
                    </div>
                </div>
            </ReportTemplate>
        );
    }

    return (
        <ReportTemplate
            title="Capability Gap Analysis"
            subtitle={agencyName}
            onClose={onClose}
            onExport={handleExport}
            loading={loading}
        >
            <div className="space-y-12">
                <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Strategic Assessment Summary</h3>
                    <p className="text-[#1A365D] leading-relaxed text-sm font-medium border-l-4 border-[#2AAA52] pl-6 bg-slate-50 py-4 rounded-r-xl shadow-inner">
                        {report?.executiveSummary}
                    </p>
                </section>

                <section>
                    <h3 className="text-xs font-black text-[#1A365D] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                        <div className="w-1 h-6 bg-[#2AAA52] rounded-full"></div>
                        Categorized Gap Matrix (Skill vs. Qualification)
                    </h3>
                    <div className="overflow-x-auto border border-slate-100 rounded-[20px] shadow-xl bg-white">
                        <table className="w-full text-left text-[11px] border-collapse">
                            <thead className="bg-[#1A365D] text-white">
                                <tr>
                                    <th className="p-5 font-black uppercase tracking-widest">Capability Area</th>
                                    <th className="p-5 font-black uppercase tracking-widest">Classification</th>
                                    <th className="p-5 font-black uppercase tracking-widest text-center">Impact</th>
                                    <th className="p-5 font-black uppercase tracking-widest">Recommended Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {report?.prioritizedGaps.map((gap, i: number) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-5">
                                            <p className="font-black text-[#1A365D] text-[12px] group-hover:text-blue-600 transition-colors">{gap.gapName}</p>
                                            <p className="text-[10px] text-slate-400 mt-1 font-semibold">{gap.context}</p>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                                gap.type.includes('QUALIFICATION')
                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            }`}>
                                                {gap.type}
                                            </span>
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className={`text-[10px] font-black ${gap.impact === 'High' ? 'text-rose-600' : 'text-amber-500'}`}>{gap.impact}</span>
                                        </td>
                                        <td className="p-5 leading-relaxed font-semibold text-slate-600 italic whitespace-normal min-w-[300px]">
                                            {gap.actionableIntervention}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h3 className="text-xs font-black text-[#1A365D] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                        <div className="w-1 h-6 bg-[#2AAA52] rounded-full"></div>
                        SPA Ratings Analysis
                    </h3>
                    <div className="overflow-x-auto border border-slate-100 rounded-[20px] shadow-xl bg-white">
                        <table className="w-full text-left text-[11px] border-collapse">
                            <thead className="bg-[#1A365D] text-white">
                                <tr>
                                    <th className="p-5 font-black uppercase tracking-widest">Rating</th>
                                    <th className="p-5 font-black uppercase tracking-widest">Current %</th>
                                    <th className="p-5 font-black uppercase tracking-widest">Target %</th>
                                    <th className="p-5 font-black uppercase tracking-widest">Delta %</th>
                                    <th className="p-5 font-black uppercase tracking-widest">Training Recommendation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {report?.spaRatings.trainingRecommendations.map((rec: any, i: number) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-5 font-black text-[#1A365D] text-[12px]">{rec.rating}</td>
                                        <td className="p-5">{rec.current}%</td>
                                        <td className="p-5">{rec.target}%</td>
                                        <td className={`p-5 ${rec.delta < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                            {rec.delta > 0 ? `+${rec.delta}%` : `${rec.delta}%`}
                                        </td>
                                        <td className="p-5 leading-relaxed font-semibold text-slate-600 italic whitespace-normal">
                                            {rec.recommendation}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h3 className="text-xs font-black text-[#1A365D] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                        <div className="w-1 h-6 bg-[#2AAA52] rounded-full"></div>
                        SPA Ratings Delta Chart
                    </h3>
                    <div className="overflow-x-auto border border-slate-100 rounded-[20px] shadow-xl bg-white">
                        {spaChartData && (
                            <ChartComponent
                                type="horizontalBar"
                                data={spaChartData}
                                options={{
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'top'
                                        },
                                        title: {
                                            display: true,
                                            text: 'SPA Ratings vs Target Baseline'
                                        }
                                    }
                                }}
                            />
                        )}
                    </div>
                </section>

                <section>
                    <h3 className="text-xs font-black text-[#1A365D] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                        Institutional Leadership Succession Track
                    </h3>
                    <SuccessionPlanningTable candidates={report?.successionPlan || []} />
                </section>
            </div>
        </ReportTemplate>
    );
};