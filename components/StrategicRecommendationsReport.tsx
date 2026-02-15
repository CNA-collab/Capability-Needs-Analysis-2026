import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { OfficerRecord, AgencyType, EstablishmentRecord } from '../types';
import { DataAggregator } from '../services/DataAggregator';
import { ReportTemplate } from './ReportTemplate';

interface StrategicIntervention {
    pillar: string;
    alignmentPriority?: string;
    targetGap: string;
    learningModel: string;
    action: string;
    expectedOutcome: string;
}

interface StrategicReport {
    executiveSummary: string;
    strategicInterventions: StrategicIntervention[];
    implementationHorizon: string;
}

interface ReportProps {
    data: OfficerRecord[];
    establishmentData: EstablishmentRecord[];
    agencyType: AgencyType;
    agencyName: string;
    onClose: () => void;
}

export const StrategicRecommendationsReport: React.FC<ReportProps> = ({ data, establishmentData, agencyName, onClose }) => {
    const [report, setReport] = useState<StrategicReport | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const stats = useMemo(() => DataAggregator.process(data, establishmentData), [data, establishmentData]);

    useEffect(() => {
        const generateReport = async () => {
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "";
            if (!apiKey) {
                console.error("API Key Missing");
                setLoading(false);
                return;
            }

            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const prompt = `
                Act as a Strategic HR Consultant for ${agencyName}.
                Apply the 10:20:70 Learning Model:
                - 10% Formal (Dept Spend/Budget)
                - 20% Social (Internal Mentoring/Human Resources)
                - 70% Experiential (Internal On-the-Job training)

                Workforce Metrics:
                - Baseline: ${stats.baselineScore.toFixed(1)}/10
                - Gap Area: ${stats.gapSector.name}
                - Mentors: ${data.filter(o => parseInt(o.spaRating) >= 4).length} personnel.

                Generate a 5-year strategy in JSON format with fields: executiveSummary, strategicInterventions (array with pillar, alignmentPriority, targetGap, learningModel, action, expectedOutcome), and implementationHorizon.
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                // Remove any potential markdown backticks if AI includes them
                const cleanJson = text.replace(/```json|```/g, "").trim();
                setReport(JSON.parse(cleanJson));
            } catch (e: unknown) {
                console.error("CNA System AI Error:", e);
            } finally {
                setLoading(false);
            }
        };
        generateReport();
    }, [stats, agencyName, data]);
    
    const handleExport = (format: string) => {
        console.log(`Exporting ${format}...`);
    };

    return (
        <ReportTemplate 
            title="Strategic Recommendations" 
            agencyName={agencyName}
            subtitle="10:20:70 Capability Framework"
            onClose={onClose} 
            onExport={handleExport}
            loading={loading}
        >
            <div className="space-y-6">
                {/* 10:20:70 Strategy Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl">
                        <h4 className="text-[8pt] font-black text-emerald-800 uppercase">Internal Utilization (90%)</h4>
                        <p className="text-[7pt] text-emerald-600 font-bold italic">20% Mentoring + 70% On-Job</p>
                    </div>
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
                        <h4 className="text-[8pt] font-black text-amber-800 uppercase">Department Spend (10%)</h4>
                        <p className="text-[7pt] text-amber-600 font-bold italic">Formal External Certification</p>
                    </div>
                </div>

                

                <section className="bg-[#1A365D] p-6 rounded-2xl text-white shadow-xl">
                    <h3 className="text-[7pt] font-black uppercase tracking-[0.3em] mb-2 text-emerald-400">Executive Strategic Intent</h3>
                    <p className="text-[10pt] leading-relaxed font-light italic">&quot;{report?.executiveSummary}&quot;</p>
                </section>

                <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm">
                    <table className="w-full text-left text-[8pt]">
                        <thead className="bg-slate-50 text-[#1A365D] border-b border-slate-200 uppercase font-black">
                            <tr>
                                <th className="p-4">Pillar</th>
                                <th className="p-4">Model</th>
                                <th className="p-4">Action</th>
                                <th className="p-4">Outcome</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {report?.strategicInterventions?.map((item: StrategicIntervention, i: number) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 font-black text-[#1A365D]">{item.pillar}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[6pt] font-black uppercase ${
                                            item.learningModel?.includes('10%') ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            {item.learningModel}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-slate-800 mb-1">{item.targetGap}</p>
                                        <p className="text-slate-500 italic">{item.action}</p>
                                    </td>
                                    <td className="p-4 font-black text-emerald-600 uppercase tracking-tighter">{item.expectedOutcome}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 className="text-[8pt] font-black text-[#1A365D] uppercase mb-1">5-Year Roadmap Horizon</h4>
                    <p className="text-[9pt] text-slate-600 font-medium leading-relaxed">{report?.implementationHorizon}</p>
                </div>
            </div>
        </ReportTemplate>
    );
};
