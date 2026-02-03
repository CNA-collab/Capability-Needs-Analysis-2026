import React, { useState, useMemo } from 'react';
import { OfficerRecord, StructuredCorporatePlan } from '../types';
import { ComputerDesktopIcon, AcademicCapIcon, UsersIcon, LightBulbIcon, XIcon, TerminalIcon } from './icons';

interface BottomPanelProps {
    officers: OfficerRecord[];
    corporatePlanData: StructuredCorporatePlan | null;
    isOpen: boolean;
    onToggle: () => void;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
    officers,
    corporatePlanData,
    isOpen,
    onToggle
}) => {
    const [activeTab, setActiveTab] = useState<'logs' | 'roi' | 'interventions'>('logs');

    // Calculate 10:20:70 framework metrics
    const frameworkMetrics = useMemo(() => {
        if (!officers.length) return { formal: 0, coaching: 0, ojt: 0 };

        // Formal (10%): Budgeted training aligned with Corporate Plan
        const formal = officers.filter(o =>
            o.trainingHistory.length > 0 &&
            corporatePlanData?.training_needs &&
            o.trainingPreferences.some(pref =>
                corporatePlanData.training_needs.toLowerCase().includes(pref.toLowerCase())
            )
        ).length;

        // Coaching (20%): Mentorship based on skill gaps vs experience
        const coaching = officers.filter(o =>
            o.yearsOfExperience && o.yearsOfExperience > 5 &&
            (o.technicalCapabilityGaps.length > 0 || o.leadershipCapabilityGaps.length > 0)
        ).length;

        // OJT (70%): Task-based interventions linked to job descriptions
        const ojt = officers.filter(o =>
            o.trainingPreferences.some(pref =>
                o.position.toLowerCase().includes(pref.toLowerCase()) ||
                o.division.toLowerCase().includes(pref.toLowerCase())
            )
        ).length;

        return { formal, coaching, ojt };
    }, [officers, corporatePlanData]);

    // Generate training logs
    const trainingLogs = useMemo(() => {
        const logs: Array<{
            timestamp: string;
            type: 'info' | 'success' | 'warning' | 'error';
            message: string;
            officer?: string;
        }> = [];

        officers.forEach(officer => {
            if (officer.trainingHistory.length > 0) {
                logs.push({
                    timestamp: new Date().toISOString(),
                    type: 'success',
                    message: `Training completed: ${officer.trainingHistory[0].courseName}`,
                    officer: officer.name
                });
            }

            if (officer.technicalCapabilityGaps.length > 0) {
                logs.push({
                    timestamp: new Date().toISOString(),
                    type: 'warning',
                    message: `Skill gap identified: ${officer.technicalCapabilityGaps[0]}`,
                    officer: officer.name
                });
            }
        });

        return logs.slice(-10); // Last 10 logs
    }, [officers]);

    // Calculate ROI projections
    const roiProjections = useMemo(() => {
        const totalInvestment = officers.length * 5000; // Assume $5000 per officer
        const expectedReturns = {
            formal: frameworkMetrics.formal * 15000, // High ROI for formal training
            coaching: frameworkMetrics.coaching * 8000, // Medium ROI for coaching
            ojt: frameworkMetrics.ojt * 3000 // Lower ROI for OJT
        };

        const totalReturn = Object.values(expectedReturns).reduce((sum, val) => sum + val, 0);
        const roi = totalInvestment > 0 ? ((totalReturn - totalInvestment) / totalInvestment) * 100 : 0;

        return {
            totalInvestment,
            totalReturn,
            roi: Math.round(roi),
            breakdown: expectedReturns
        };
    }, [officers.length, frameworkMetrics]);

    if (!isOpen) {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-40">
                <button
                    onClick={onToggle}
                    className="w-full bg-slate-800 text-slate-300 p-2 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                    <ComputerDesktopIcon className="w-4 h-4" />
                    <span className="text-xs font-mono">Terminal</span>
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 z-40">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-700">
                <div className="flex items-center gap-4">
                    <TerminalIcon className="w-5 h-5 text-slate-400" />
                    <div className="flex gap-1">
                        <button
                            onClick={() => setActiveTab('logs')}
                            className={`px-3 py-1 text-xs font-mono rounded ${
                                activeTab === 'logs'
                                    ? 'bg-slate-700 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            Training Logs
                        </button>
                        <button
                            onClick={() => setActiveTab('roi')}
                            className={`px-3 py-1 text-xs font-mono rounded ${
                                activeTab === 'roi'
                                    ? 'bg-slate-700 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            ROI Analysis
                        </button>
                        <button
                            onClick={() => setActiveTab('interventions')}
                            className={`px-3 py-1 text-xs font-mono rounded ${
                                activeTab === 'interventions'
                                    ? 'bg-slate-700 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            10:20:70 Framework
                        </button>
                    </div>
                </div>
                <button
                    onClick={onToggle}
                    className="p-1 text-slate-400 hover:text-white"
                >
                    <XIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="h-64 overflow-y-auto">
                {activeTab === 'logs' && (
                    <div className="p-4 space-y-2 font-mono text-xs">
                        {trainingLogs.length === 0 ? (
                            <div className="text-slate-500 text-center py-8">
                                No training logs available
                            </div>
                        ) : (
                            trainingLogs.map((log, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <span className="text-slate-500 flex-shrink-0">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </span>
                                    <span className={`flex-shrink-0 ${
                                        log.type === 'success' ? 'text-green-400' :
                                        log.type === 'warning' ? 'text-yellow-400' :
                                        log.type === 'error' ? 'text-red-400' :
                                        'text-blue-400'
                                    }`}>
                                        [{log.type.toUpperCase()}]
                                    </span>
                                    <span className="text-slate-300 flex-1">
                                        {log.message}
                                        {log.officer && (
                                            <span className="text-slate-500 ml-2">({log.officer})</span>
                                        )}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'roi' && (
                    <div className="p-4 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-slate-800 p-3 rounded">
                                <div className="text-xs text-slate-400 mb-1">Total Investment</div>
                                <div className="text-lg font-mono text-white">
                                    ${roiProjections.totalInvestment.toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-slate-800 p-3 rounded">
                                <div className="text-xs text-slate-400 mb-1">Expected Return</div>
                                <div className="text-lg font-mono text-green-400">
                                    ${roiProjections.totalReturn.toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-slate-800 p-3 rounded">
                                <div className="text-xs text-slate-400 mb-1">Projected ROI</div>
                                <div className={`text-lg font-mono ${
                                    roiProjections.roi > 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {roiProjections.roi > 0 ? '+' : ''}{roiProjections.roi}%
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-mono text-slate-300">Breakdown by Category</h4>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <AcademicCapIcon className="w-4 h-4 text-blue-400" />
                                    <span className="text-slate-400">Formal:</span>
                                    <span className="font-mono text-white">
                                        ${roiProjections.breakdown.formal.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <UsersIcon className="w-4 h-4 text-green-400" />
                                    <span className="text-slate-400">Coaching:</span>
                                    <span className="font-mono text-white">
                                        ${roiProjections.breakdown.coaching.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <LightBulbIcon className="w-4 h-4 text-orange-400" />
                                    <span className="text-slate-400">OJT:</span>
                                    <span className="font-mono text-white">
                                        ${roiProjections.breakdown.ojt.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'interventions' && (
                    <div className="p-4 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded">
                                <div className="flex items-center gap-2 mb-2">
                                    <AcademicCapIcon className="w-5 h-5 text-blue-400" />
                                    <span className="text-sm font-mono text-blue-400">10% Formal</span>
                                </div>
                                <div className="text-2xl font-mono text-white mb-1">
                                    {frameworkMetrics.formal}
                                </div>
                                <div className="text-xs text-slate-400">
                                    Budgeted training aligned with Corporate Plan
                                </div>
                            </div>

                            <div className="bg-green-900/20 border border-green-500/30 p-4 rounded">
                                <div className="flex items-center gap-2 mb-2">
                                    <UsersIcon className="w-5 h-5 text-green-400" />
                                    <span className="text-sm font-mono text-green-400">20% Coaching</span>
                                </div>
                                <div className="text-2xl font-mono text-white mb-1">
                                    {frameworkMetrics.coaching}
                                </div>
                                <div className="text-xs text-slate-400">
                                    Mentorship based on skill gaps vs experience
                                </div>
                            </div>

                            <div className="bg-orange-900/20 border border-orange-500/30 p-4 rounded">
                                <div className="flex items-center gap-2 mb-2">
                                    <LightBulbIcon className="w-5 h-5 text-orange-400" />
                                    <span className="text-sm font-mono text-orange-400">70% OJT</span>
                                </div>
                                <div className="text-2xl font-mono text-white mb-1">
                                    {frameworkMetrics.ojt}
                                </div>
                                <div className="text-xs text-slate-400">
                                    Task-based interventions linked to Job Descriptions
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800 p-3 rounded">
                            <h4 className="text-sm font-mono text-slate-300 mb-2">Framework Distribution</h4>
                            <div className="flex gap-1 h-2 rounded overflow-hidden">
                                <div
                                    className="bg-blue-500"
                                    style={{ width: `${(frameworkMetrics.formal / officers.length) * 100}%` }}
                                />
                                <div
                                    className="bg-green-500"
                                    style={{ width: `${(frameworkMetrics.coaching / officers.length) * 100}%` }}
                                />
                                <div
                                    className="bg-orange-500"
                                    style={{ width: `${(frameworkMetrics.ojt / officers.length) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>10%</span>
                                <span>20%</span>
                                <span>70%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
