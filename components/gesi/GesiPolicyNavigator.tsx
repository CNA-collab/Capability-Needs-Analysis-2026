import React from 'react';

export const GesiPolicyNavigator: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-black text-slate-900 uppercase mb-4">GESI Policy Navigator</h2>
                <p className="text-slate-600 mb-6">
                    Navigate through the Gender Equity and Social Inclusion policies and guidelines.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Policy Framework</h3>
                        <p className="text-slate-600">
                            Comprehensive framework for implementing GESI policies across the organization.
                        </p>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Implementation Guidelines</h3>
                        <p className="text-slate-600">
                            Step-by-step guidelines for policy implementation and monitoring.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
