import React from 'react';

export const CnaQuestionnaire: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-black text-slate-900 uppercase mb-4">CNA Questionnaire</h2>
                <p className="text-slate-600 mb-6">
                    This section contains the Capability Needs Analysis questionnaire that helps assess individual and organizational capabilities.
                </p>

                <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Questionnaire Overview</h3>
                        <p className="text-slate-600">
                            The CNA questionnaire is designed to gather comprehensive data about employee capabilities,
                            training needs, and organizational requirements. It covers various aspects including technical skills,
                            leadership capabilities, and strategic alignment.
                        </p>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Key Components</h3>
                        <ul className="list-disc list-inside text-slate-600 space-y-2">
                            <li>Individual capability assessment</li>
                            <li>Training needs identification</li>
                            <li>Performance rating evaluation</li>
                            <li>Gap analysis framework</li>
                            <li>Strategic alignment mapping</li>
                        </ul>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Implementation Guide</h3>
                        <p className="text-slate-600">
                            The questionnaire should be administered annually or as needed based on organizational changes.
                            Results should be analyzed to inform training and development strategies.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
