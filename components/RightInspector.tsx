import React, { useMemo } from 'react';
import { OfficerRecord, StructuredCorporatePlan } from '../types';
import { XIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from './icons';

interface RightInspectorProps {
    selectedOfficer: OfficerRecord | null;
    corporatePlanData: StructuredCorporatePlan | null;
    isOpen: boolean;
    onClose: () => void;
}

export const RightInspector: React.FC<RightInspectorProps> = ({
    selectedOfficer,
    corporatePlanData,
    isOpen,
    onClose
}) => {
    // Calculate alignment with corporate objectives
    const alignmentAnalysis = useMemo(() => {
        if (!selectedOfficer || !corporatePlanData) {
            return null;
        }

        const objectives = corporatePlanData.strategic_goals?.objectives || [];
        const trainingNeeds = corporatePlanData.training_needs || '';

        // Check alignment with strategic objectives
        const objectiveAlignment = objectives.map(objective => {
            const lowerObjective = objective.toLowerCase();
            const matchesPosition = selectedOfficer.position.toLowerCase().includes(lowerObjective) ||
                                  selectedOfficer.division.toLowerCase().includes(lowerObjective);
            const matchesTraining = selectedOfficer.trainingPreferences.some(pref =>
                lowerObjective.includes(pref.toLowerCase())
            );

            return {
                objective,
                aligned: matchesPosition || matchesTraining,
                strength: matchesPosition && matchesTraining ? 'strong' : matchesPosition || matchesTraining ? 'moderate' : 'weak'
            };
        });

        // Check training needs alignment
        const trainingAlignment = {
            aligned: selectedOfficer.trainingPreferences.some(pref =>
                trainingNeeds.toLowerCase().includes(pref.toLowerCase())
            ),
            gaps: selectedOfficer.technicalCapabilityGaps.filter(gap =>
                !trainingNeeds.toLowerCase().includes(gap.toLowerCase())
            )
        };

        // Calculate overall alignment score
        const alignedObjectives = objectiveAlignment.filter(o => o.aligned).length;
        const alignmentScore = objectives.length > 0 ? (alignedObjectives / objectives.length) * 100 : 0;

        return {
            objectiveAlignment,
            trainingAlignment,
            alignmentScore: Math.round(alignmentScore),
            overallAlignment: alignmentScore >= 80 ? 'high' : alignmentScore >= 60 ? 'moderate' : 'low'
        };
    }, [selectedOfficer, corporatePlanData]);

    if (!isOpen) return null;

    if (!selectedOfficer) {
        return (
            <div className="fixed right-0 top-0 h-full w-80 bg-slate-900 border-l border-slate-700 z-30 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h3 className="text-sm font-mono text-slate-300">Inspector</h3>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex-1 flex items-center justify-center text-center p-8">
                    <div className="text-slate-500">
                        <InformationCircleIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Select an officer to view alignment analysis</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed right-0 top-0 h-full w-80 bg-slate-900 border-l border-slate-700 z-30 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 shrink-0">
                <h3 className="text-sm font-mono text-slate-300">Inspector</h3>
                <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
                    <XIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Officer Info */}
                <div className="p-4 border-b border-slate-700">
                    <h4 className="text-lg font-bold text-white mb-2">{selectedOfficer.name}</h4>
                    <p className="text-sm text-slate-400 mb-1">{selectedOfficer.position}</p>
                    <p className="text-sm text-slate-400">{selectedOfficer.division} • {selectedOfficer.grade}</p>
                </div>

                {/* Alignment Score */}
                {alignmentAnalysis && (
                    <div className="p-4 border-b border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-mono text-slate-300">Corporate Alignment</span>
                            <span className={`text-sm font-mono ${
                                alignmentAnalysis.overallAlignment === 'high' ? 'text-green-400' :
                                alignmentAnalysis.overallAlignment === 'moderate' ? 'text-yellow-400' :
                                'text-red-400'
                            }`}>
                                {alignmentAnalysis.alignmentScore}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${
                                    alignmentAnalysis.overallAlignment === 'high' ? 'bg-green-500' :
                                    alignmentAnalysis.overallAlignment === 'moderate' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                }`}
                                style={{ width: `${alignmentAnalysis.alignmentScore}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Strategic Objectives Alignment */}
                {alignmentAnalysis && (
                    <div className="p-4 border-b border-slate-700">
                        <h5 className="text-sm font-mono text-slate-300 mb-3">Strategic Objectives</h5>
                        <div className="space-y-2">
                            {alignmentAnalysis.objectiveAlignment.map((item, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    {item.aligned ? (
                                        <CheckCircleIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                            item.strength === 'strong' ? 'text-green-400' :
                                            item.strength === 'moderate' ? 'text-yellow-400' :
                                            'text-blue-400'
                                        }`} />
                                    ) : (
                                        <ExclamationTriangleIcon className="w-4 h-4 mt-0.5 text-slate-500 flex-shrink-0" />
                                    )}
                                    <span className={`text-xs ${
                                        item.aligned ? 'text-slate-300' : 'text-slate-500'
                                    }`}>
                                        {item.objective}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Training Alignment */}
                {alignmentAnalysis && (
                    <div className="p-4 border-b border-slate-700">
                        <h5 className="text-sm font-mono text-slate-300 mb-3">Training Alignment</h5>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                {alignmentAnalysis.trainingAlignment.aligned ? (
                                    <CheckCircleIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                                ) : (
                                    <ExclamationTriangleIcon className="w-4 h-4 text-red-400 flex-shrink-0" />
                                )}
                                <span className="text-xs text-slate-300">
                                    {alignmentAnalysis.trainingAlignment.aligned
                                        ? 'Training preferences align with corporate needs'
                                        : 'Training preferences need corporate alignment'
                                    }
                                </span>
                            </div>

                            {alignmentAnalysis.trainingAlignment.gaps.length > 0 && (
                                <div className="mt-3">
                                    <span className="text-xs text-slate-400 block mb-1">Unaddressed Gaps:</span>
                                    {alignmentAnalysis.trainingAlignment.gaps.map((gap, index) => (
                                        <div key={index} className="flex items-center gap-2 mt-1">
                                            <ExclamationTriangleIcon className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                                            <span className="text-xs text-yellow-300">{gap}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Capability Gaps */}
                <div className="p-4 border-b border-slate-700">
                    <h5 className="text-sm font-mono text-slate-300 mb-3">Capability Gaps</h5>
                    <div className="space-y-2">
                        {selectedOfficer.technicalCapabilityGaps.length > 0 ? (
                            selectedOfficer.technicalCapabilityGaps.map((gap, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <ExclamationTriangleIcon className="w-4 h-4 text-red-400 flex-shrink-0" />
                                    <span className="text-xs text-red-300">{gap}</span>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center gap-2">
                                <CheckCircleIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                                <span className="text-xs text-green-300">No technical gaps identified</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Training Preferences */}
                <div className="p-4">
                    <h5 className="text-sm font-mono text-slate-300 mb-3">Training Preferences</h5>
                    <div className="space-y-1">
                        {selectedOfficer.trainingPreferences.map((pref, index) => (
                            <div key={index} className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                                {pref}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
