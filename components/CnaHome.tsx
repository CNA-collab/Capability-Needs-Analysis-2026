import React from 'react';
// Note: If FrameworkGraphic or icons cause errors, ensure those files exist
import { ShieldCheckIcon, UsersIcon, ChartBarSquareIcon, AcademicCapIcon } from './icons';

// THIS WAS MISSING OR UNRESOLVED - defining the interface here
interface CnaHomeProps {
    agencyName: string;
    kpis: {
        establishmentGap: number;
        baselineScore: number;
        criticalSkillGaps: number;
        trainingCompletion: number;
    };
    onRunAI: () => void;
}

export const CnaHome: React.FC<CnaHomeProps> = ({ agencyName, kpis, onRunAI }) => {
    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                    {agencyName}
                </h1>
                <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">
                    CNA Strategic Diagnostic Dashboard
                </p>
            </header>

            {/* KPI STRIP */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Baseline Score</span>
                        <ShieldCheckIcon className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">{kpis.baselineScore}/10</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Vacancy Gap</span>
                        <UsersIcon className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="text-2xl font-black text-rose-600">{kpis.establishmentGap}%</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Critical Gaps</span>
                        <ChartBarSquareIcon className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-black text-amber-600">{kpis.criticalSkillGaps}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">10% Formal Sync</span>
                        <AcademicCapIcon className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-black text-emerald-600">{kpis.trainingCompletion}%</div>
                </div>
            </div>

            {/* 10:20:70 FRAMEWORK SECTION */}
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm mb-8">
                <h2 className="text-xl font-black mb-6 uppercase tracking-tight text-slate-800">
                    National L&D Framework (10:20:70 Model)
                </h2>
                
                {/* YOUR LOCAL IMAGE FROM PUBLIC/LOGO/ */}
                <div className="flex justify-center mb-8 bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200">
                    <img 
                        src="/Logo/l&d framework.png" 
                        alt="National L&D Framework" 
                        className="max-w-full h-auto rounded-xl shadow-lg border border-slate-200"
                        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/800x400?text=Check+Public+Folder+for+Logo/l%26d+framework.png")}
                    />
                </div>

                <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="max-w-xl">
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            <span className="font-bold text-slate-900">Strategic Alignment:</span> This diagnostic utilizes the 10:20:70 model where 10% is formal training, 20% is coaching/mentoring, and 70% is on-the-job experiential learning.
                        </p>
                    </div>
                    <button 
                        onClick={onRunAI} 
                        className="whitespace-nowrap bg-[#1e293b] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200"
                    >
                        Run Strategic Master Scan
                    </button>
                </div>
            </div>
        </div>
    );
};