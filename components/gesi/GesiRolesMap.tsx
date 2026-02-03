import React from 'react';

export const GesiRolesMap: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-black text-slate-900 uppercase mb-4">Roles & Responsibilities</h2>
                <p className="text-slate-600 mb-6">
                    Clear definition of roles and responsibilities for GESI implementation across all levels.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Executive Leadership</h3>
                        <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
                            <li>Set strategic direction</li>
                            <li>Ensure resource allocation</li>
                            <li>Monitor progress</li>
                            <li>Champion GESI initiatives</li>
                        </ul>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Middle Management</h3>
                        <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
                            <li>Implement policies</li>
                            <li>Support team development</li>
                            <li>Report progress</li>
                            <li>Foster inclusive culture</li>
                        </ul>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">HR Department</h3>
                        <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
                            <li>Develop GESI policies</li>
                            <li>Provide training</li>
                            <li>Monitor compliance</li>
                            <li>Support recruitment</li>
                        </ul>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">All Employees</h3>
                        <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
                            <li>Understand policies</li>
                            <li>Participate in training</li>
                            <li>Report concerns</li>
                            <li>Promote inclusion</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
