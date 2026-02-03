import React from 'react';

interface GesiDashboardProps {
    onAnalyzeGaps: () => void;
}

export const GesiDashboard: React.FC<GesiDashboardProps> = ({ onAnalyzeGaps }) => {
    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-black text-slate-900 uppercase mb-4">GESI Dashboard</h2>
                <p className="text-slate-600 mb-6">
                    Comprehensive dashboard for monitoring GESI implementation and progress.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                        <h3 className="text-lg font-bold text-emerald-900 mb-2">Gender Balance</h3>
                        <p className="text-3xl font-black text-emerald-600">68%</p>
                        <p className="text-sm text-emerald-700">Women in leadership</p>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                        <h3 className="text-lg font-bold text-blue-900 mb-2">Inclusion Index</h3>
                        <p className="text-3xl font-black text-blue-600">7.2</p>
                        <p className="text-sm text-blue-700">Out of 10</p>
                    </div>

                    <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                        <h3 className="text-lg font-bold text-purple-900 mb-2">Training Completion</h3>
                        <p className="text-3xl font-black text-purple-600">84%</p>
                        <p className="text-sm text-purple-700">GESI training</p>
                    </div>
                </div>

                <button
                    onClick={onAnalyzeGaps}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold uppercase hover:bg-emerald-700 transition-colors"
                >
                    Analyze Gaps
                </button>
            </div>
        </div>
    );
};
