import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { OfficerRecord, EstablishmentRecord, IndividualLndPlan, AgencyType } from '../types';

// Icons internalized to prevent import errors
const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
);

interface ReportProps {
  data: OfficerRecord[];
  establishmentData: EstablishmentRecord[];
  agencyName: string;
  agencyType: AgencyType;
  onClose: () => void;
}

export const AutomatedIndividualLndPlansReport: React.FC<ReportProps> = ({ data, agencyName, onClose }) => {
  const [report, setReport] = useState<IndividualLndPlan[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runAI = async () => {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "";
      if (!apiKey) {
        setError("API Key Missing in .env file");
        setLoading(false);
        return;
      }

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Generate PNG Government L&D plans using the 10:20:70 model for ${agencyName}.
        10% Formal, 20% Coaching, 70% Experiential. 
        Return JSON format with "plans" array. 
        Data: ${JSON.stringify(data.slice(0, 5))}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const parsed = JSON.parse(response.text());
        setReport(parsed.plans);
      } catch (err) {
        setError("AI Generation failed. Check API key and console.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    runAI();
  }, [data, agencyName]);

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        <header className="p-6 bg-[#1A365D] text-white flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-tight">AI 10:20:70 Learning Plans</h2>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full">
              <SparklesIcon className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="font-bold text-slate-400 uppercase text-xs">Mapping HR Resources...</p>
            </div>
          )}

          {!loading && error && (
            <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-100 font-bold text-center">
              {error}
            </div>
          )}

          {!loading && !error && report && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.map((plan) => {
                const formalTraining = plan.trainingNeeds.formal?.[0] || "N/A";
                const coachingTraining = plan.trainingNeeds.social?.[0] || "N/A"; // Rename Social → Coaching
                const experientialTraining = plan.trainingNeeds.experiential?.[0] || "N/A";

                return (
                  <div key={plan.officer.occupant} className="p-5 border border-slate-200 rounded-2xl bg-slate-50">
                    <h3 className="font-black text-[#1A365D] uppercase text-sm mb-1">{plan.officer.occupant}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-4">{plan.officer.designation}</p>

                    <div className="space-y-3">
                      <div className="p-3 bg-rose-100/50 rounded-lg">
                        <p className="text-[9px] font-black text-rose-700 uppercase">10% Formal</p>
                        <p className="text-xs font-medium">{formalTraining}</p>
                      </div>
                      <div className="p-3 bg-emerald-100/50 rounded-lg">
                        <p className="text-[9px] font-black text-emerald-700 uppercase">20% Coaching</p>
                        <p className="text-xs font-medium">{coachingTraining}</p>
                      </div>
                      <div className="p-3 bg-blue-100/50 rounded-lg">
                        <p className="text-[9px] font-black text-blue-700 uppercase">70% Experiential</p>
                        <p className="text-xs font-medium">{experientialTraining}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
