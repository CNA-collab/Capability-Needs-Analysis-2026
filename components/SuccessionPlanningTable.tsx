import React, { useState, useMemo } from 'react';
import { SuccessionCandidate, OfficerRecord, EstablishmentRecord } from '../types';
import { XIcon, UsersIcon, ArrowPathIcon, CheckCircleIcon } from './icons';

interface SuccessionPlanningTableProps {
    candidates?: SuccessionCandidate[];
    officers?: OfficerRecord[];
    establishmentData?: EstablishmentRecord[];
    onClose?: () => void;
    isModal?: boolean;
}

// Extended interface for mapped succession data
interface MappedSuccessionData {
    officer: OfficerRecord;
    targetRole: EstablishmentRecord | null;
    readinessLevel: 'Ready Now' | '1-2 Years' | '3-5 Years' | 'Long-term';
    developmentNeeds: string;
    pipelineType: '20% Mentoring' | '70% Experiential' | '10% Formal';
}

const GapIcon: React.FC<{ type: string }> = ({ type }) => {
    if (type.includes('QUAL')) return (
        <span title="Qualification Gap: Needs Academic Credential" className="w-5 h-5 rounded-md bg-[#1A365D] text-white flex items-center justify-center text-[10px] font-black shrink-0">Q</span>
    );
    if (type.includes('SKILL')) return (
        <span title="Skill Gap: Needs Workshop/Mentoring" className="w-5 h-5 rounded-md bg-[#2AAA52] text-white flex items-center justify-center text-[10px] font-black shrink-0">S</span>
    );
    if (type.includes('LEADERSHIP')) return (
        <span title="Leadership Gap" className="w-5 h-5 rounded-md bg-purple-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">L</span>
    );
    return null;
};

// Helper to determine SPA rating value (handles both string and number)
const getSpaRatingValue = (spaRating: string | number): number => {
    if (typeof spaRating === 'number') return spaRating;
    const ratingStr = String(spaRating).toLowerCase();
    if (ratingStr.includes('outstanding') || ratingStr === '5') return 5;
    if (ratingStr.includes('good') || ratingStr === '4') return 4;
    if (ratingStr.includes('satisfactory') || ratingStr === '3') return 3;
    if (ratingStr.includes('developing') || ratingStr === '2') return 2;
    if (ratingStr.includes('needs improvement') || ratingStr === '1') return 1;
    return 0;
};

// Helper to determine readiness based on officer data
const determineReadiness = (officer: OfficerRecord): 'Ready Now' | '1-2 Years' | '3-5 Years' | 'Long-term' => {
    const spaValue = getSpaRatingValue(officer.spaRating);
    const experience = officer.yearsOfExperience || 0;
    
    if (spaValue >= 5 && experience >= 5) return 'Ready Now';
    if (spaValue >= 4 && experience >= 3) return '1-2 Years';
    if (spaValue >= 4) return '3-5 Years';
    return 'Long-term';
};

// Helper to determine development needs
const determineDevelopmentNeeds = (officer: OfficerRecord, targetRole: EstablishmentRecord | null): string => {
    const gaps: string[] = [];
    
    // Check qualification gaps
    if (targetRole && officer.jobQualification) {
        const officerQual = officer.jobQualification.toLowerCase();
        const targetGrade = targetRole.grade?.toLowerCase() || '';
        
        if (targetGrade.includes('senior') || targetGrade.includes('manager') || targetGrade.includes('12')) {
            if (!officerQual.includes('master') && !officerQual.includes('degree')) {
                gaps.push('[QUAL] Needs higher qualification for senior role');
            }
        }
    }
    
    // Check skill gaps from technical capability gaps
    if (officer.technicalCapabilityGaps && officer.technicalCapabilityGaps.length > 0) {
        gaps.push(`[SKILL] Develop: ${officer.technicalCapabilityGaps.slice(0, 2).join(', ')}`);
    }
    
    // Check leadership gaps
    if (officer.leadershipCapabilityGaps && officer.leadershipCapabilityGaps.length > 0) {
        gaps.push(`[LEADERSHIP] Build: ${officer.leadershipCapabilityGaps.slice(0, 1).join(', ')}`);
    }
    
    return gaps.length > 0 ? gaps.join(' | ') : '[ALIGNED] Ready for advancement';
};

// Determine pipeline type based on development needs
const determinePipelineType = (developmentNeeds: string): '20% Mentoring' | '70% Experiential' | '10% Formal' => {
    if (developmentNeeds.includes('[QUAL]')) return '10% Formal';
    if (developmentNeeds.includes('[SKILL]') || developmentNeeds.includes('[LEADERSHIP]')) return '20% Mentoring';
    return '70% Experiential';
};

export const SuccessionPlanningTable: React.FC<SuccessionPlanningTableProps> = ({ 
    candidates, 
    officers = [], 
    establishmentData = [],
    onClose,
    isModal = false 
}) => {
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [showFilteredView, setShowFilteredView] = useState(false);
    
    // Filter officers with SPA Rating 5 or 4
    const topPerformers = useMemo(() => {
        return officers.filter(officer => {
            const spaValue = getSpaRatingValue(officer.spaRating);
            return spaValue >= 4;
        });
    }, [officers]);
    
    // Get vacant or critical roles from establishment data
    const vacantCriticalRoles = useMemo(() => {
        return establishmentData.filter(est => {
            const status = est.status?.toLowerCase() || '';
            return status === 'vacant' || status === 'critical' || status === 'unfilled';
        });
    }, [establishmentData]);
    
    // Map top performers to potential succession roles
    const mappedSuccessionData: MappedSuccessionData[] = useMemo(() => {
        return topPerformers.map(officer => {
            // Find a matching role based on grade/level progression
            const currentGrade = officer.grade?.toLowerCase() || '';
            const targetRole = vacantCriticalRoles.find(role => {
                const roleGrade = role.grade?.toLowerCase() || '';
                // Simple logic: look for higher grade positions
                return roleGrade > currentGrade;
            }) || null;
            
            const developmentNeeds = determineDevelopmentNeeds(officer, targetRole);
            
            return {
                officer,
                targetRole,
                readinessLevel: determineReadiness(officer),
                developmentNeeds,
                pipelineType: determinePipelineType(developmentNeeds)
            };
        });
    }, [topPerformers, vacantCriticalRoles]);
    
    // Toggle row selection
    const toggleRowSelection = (index: number) => {
        const newSelection = new Set(selectedRows);
        if (newSelection.has(index)) {
            newSelection.delete(index);
        } else {
            newSelection.add(index);
        }
        setSelectedRows(newSelection);
    };
    
    // Handle generate button click
    const handleGenerate = () => {
        setShowFilteredView(true);
    };
    
    // Display data - either legacy candidates or new filtered view
    const displayData = showFilteredView ? mappedSuccessionData : candidates || [];
    
    // If we have officers data and should show filtered view, render the new table
    if (officers.length > 0 && showFilteredView) {
        const content = (
            <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl">
                        <p className="text-xs font-bold uppercase opacity-80">Top Performers (SPA 4-5)</p>
                        <p className="text-2xl font-black">{topPerformers.length}</p>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 rounded-xl">
                        <p className="text-xs font-bold uppercase opacity-80">Ready Now</p>
                        <p className="text-2xl font-black">{mappedSuccessionData.filter(d => d.readinessLevel === 'Ready Now').length}</p>
                    </div>
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-xl">
                        <p className="text-xs font-bold uppercase opacity-80">Vacant Roles</p>
                        <p className="text-2xl font-black">{vacantCriticalRoles.length}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-xl">
                        <p className="text-xs font-bold uppercase opacity-80">Selected for Analysis</p>
                        <p className="text-2xl font-black">{selectedRows.size}</p>
                    </div>
                </div>
                
                {/* Pipeline Visualization */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-black uppercase text-slate-700 dark:text-slate-300 mb-3">20/70 Mentoring Pipeline</h4>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 text-center">
                            <p className="text-xs font-bold text-blue-700 dark:text-blue-400">10% Formal</p>
                            <p className="text-lg font-black text-blue-800 dark:text-blue-300">
                                {mappedSuccessionData.filter(d => d.pipelineType === '10% Formal').length}
                            </p>
                        </div>
                        <div className="flex-1 bg-green-100 dark:bg-green-900/30 rounded-lg p-3 text-center">
                            <p className="text-xs font-bold text-green-700 dark:text-green-400">20% Mentoring</p>
                            <p className="text-lg font-black text-green-800 dark:text-green-300">
                                {mappedSuccessionData.filter(d => d.pipelineType === '20% Mentoring').length}
                            </p>
                        </div>
                        <div className="flex-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 text-center">
                            <p className="text-xs font-bold text-purple-700 dark:text-purple-400">70% Experiential</p>
                            <p className="text-lg font-black text-purple-800 dark:text-purple-300">
                                {mappedSuccessionData.filter(d => d.pipelineType === '70% Experiential').length}
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Data Table */}
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-[16px] shadow-sm">
                    <table className="w-full text-left text-[11px] border-collapse">
                        <thead className="bg-[#1A365D] text-white">
                            <tr>
                                <th className="p-3 uppercase tracking-widest font-black w-8">
                                    <input 
                                        type="checkbox" 
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedRows(new Set(mappedSuccessionData.map((_, i) => i)));
                                            } else {
                                                setSelectedRows(new Set());
                                            }
                                        }}
                                        checked={selectedRows.size === mappedSuccessionData.length && mappedSuccessionData.length > 0}
                                        className="w-4 h-4 rounded"
                                    />
                                </th>
                                <th className="p-3 uppercase tracking-widest font-black">Officer Name</th>
                                <th className="p-3 uppercase tracking-widest font-black">Current Position</th>
                                <th className="p-3 uppercase tracking-widest font-black">SPA Rating</th>
                                <th className="p-3 uppercase tracking-widest font-black">Target Role / Position</th>
                                <th className="p-3 uppercase tracking-widest font-black text-center">Readiness</th>
                                <th className="p-3 uppercase tracking-widest font-black">Pipeline Type</th>
                                <th className="p-3 uppercase tracking-widest font-black">Development Needs / Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {mappedSuccessionData.map((data, idx) => (
                                <tr 
                                    key={idx} 
                                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                                        selectedRows.has(idx) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                    }`}
                                    onClick={() => toggleRowSelection(idx)}
                                >
                                    <td className="p-3">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedRows.has(idx)}
                                            onChange={() => toggleRowSelection(idx)}
                                            className="w-4 h-4 rounded"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="p-3 font-bold text-slate-800 dark:text-white">{data.officer.name}</td>
                                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-200">{data.officer.position}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                                            getSpaRatingValue(data.officer.spaRating) >= 5 
                                                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                                        }`}>
                                            {data.officer.spaRating}
                                        </span>
                                    </td>
                                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-200">
                                        {data.targetRole ? (
                                            <div>
                                                <div>{data.targetRole.designation}</div>
                                                <div className="text-[9px] text-amber-600 font-bold">{data.targetRole.status}</div>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic">No matching role</span>
                                        )}
                                    </td>
                                    <td className="p-3 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            data.readinessLevel === 'Ready Now' 
                                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                                : data.readinessLevel === '1-2 Years'
                                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                                        }`}>
                                            {data.readinessLevel}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-[9px] font-bold ${
                                            data.pipelineType === '10% Formal' 
                                                ? 'bg-blue-100 text-blue-700' 
                                                : data.pipelineType === '20% Mentoring'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-purple-100 text-purple-700'
                                        }`}>
                                            {data.pipelineType}
                                        </span>
                                    </td>
                                    <td className="p-3 leading-relaxed font-semibold text-slate-600 dark:text-slate-400 whitespace-normal min-w-[200px]">
                                        <div className="flex items-start gap-2 flex-wrap">
                                            {data.developmentNeeds.includes('[QUAL') && <GapIcon type="QUAL" />}
                                            {data.developmentNeeds.includes('[SKILL') && <GapIcon type="SKILL" />}
                                            {data.developmentNeeds.includes('[LEADERSHIP') && <GapIcon type="LEADERSHIP" />}
                                            <span>{data.developmentNeeds}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {mappedSuccessionData.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest italic">
                                        No top performers (SPA 4-5) found in the current data
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Selected Analysis Panel */}
                {selectedRows.size > 0 && (
                    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                            <h4 className="font-black text-emerald-800 dark:text-emerald-400 uppercase text-sm">
                                {selectedRows.size} Officer{selectedRows.size > 1 ? 's' : ''} Selected for Further Analysis
                            </h4>
                        </div>
                        <div className="space-y-2">
                            {Array.from(selectedRows).map(idx => (
                                <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-2 text-sm">
                                    <span className="font-bold text-slate-800 dark:text-slate-200">
                                        {mappedSuccessionData[idx]?.officer.name}
                                    </span>
                                    <span className="text-slate-500">
                                        {mappedSuccessionData[idx]?.readinessLevel} • {mappedSuccessionData[idx]?.pipelineType}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
        
        // If this is a modal, render with modal wrapper
        if (isModal && onClose) {
            return (
                <div className="fixed inset-0 bg-black/90 z-50 flex justify-center items-start p-4 pt-12 animate-fade-in no-print overflow-y-auto">
                    <div className="bg-slate-50 dark:bg-slate-950 rounded-[32px] shadow-2xl max-w-6xl w-full flex flex-col mb-12 overflow-hidden border border-white/10">
                        <header className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                                    <UsersIcon className="w-6 h-6 text-[#1A365D] dark:text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-black text-[#1A365D] dark:text-white uppercase tracking-tighter">Succession Planning Table</h1>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">20/70 Mentoring Pipeline Analysis</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-rose-600 hover:text-white rounded-2xl transition-all shadow-sm group">
                                <XIcon className="w-6 h-6 transition-transform group-hover:rotate-90" />
                            </button>
                        </header>
                        <main className="p-6 bg-white dark:bg-slate-900 min-h-[400px] overflow-y-auto">
                            {content}
                        </main>
                    </div>
                </div>
            );
        }
        
        return content;
    }
    
    // Legacy view - display candidates (original behavior)
    return (
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-[16px] shadow-sm">
            <table className="w-full text-left text-[11px] border-collapse">
                <thead className="bg-[#1A365D] text-white">
                    <tr>
                        <th className="p-4 uppercase tracking-widest font-black">Target Role / Position</th>
                        <th className="p-4 uppercase tracking-widest font-black">Identified Successor(s)</th>
                        <th className="p-4 uppercase tracking-widest font-black text-center">Readiness</th>
                        <th className="p-4 uppercase tracking-widest font-black">Development Needs / Actions</th>
                        <th className="p-4 uppercase tracking-widest font-black text-center">Timeline</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {candidates?.map((plan, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-4 font-bold text-slate-800 dark:text-white">{plan.roleOrPosition}</td>
                            <td className="p-4 font-semibold text-slate-700 dark:text-slate-200">{plan.potentialSuccessors.join(', ')}</td>
                            <td className="p-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    plan.readinessLevel === 'Ready Now' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                                }`}>
                                    {plan.readinessLevel}
                                </span>
                            </td>
                            <td className="p-4 leading-relaxed font-semibold text-slate-600 dark:text-slate-400 whitespace-normal min-w-[200px]">
                                <div className="flex items-start gap-3">
                                    {plan.developmentNeeds.includes('[QUAL') && <GapIcon type="QUAL" />}
                                    {plan.developmentNeeds.includes('[SKILL') && <GapIcon type="SKILL" />}
                                    <span>{plan.developmentNeeds}</span>
                                </div>
                            </td>
                            <td className="p-4 text-center font-black text-[#1A365D] dark:text-blue-400 whitespace-nowrap">{plan.estimatedTimeline}</td>
                        </tr>
                    ))}
                    {(!candidates || candidates.length === 0) && (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest italic">
                                No succession candidates identified in current assessment
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Standalone component with Generate button for when used as a tool
export const SuccessionPlanningTool: React.FC<{
    officers: OfficerRecord[];
    establishmentData: EstablishmentRecord[];
}> = ({ officers, establishmentData }) => {
    const [showTable, setShowTable] = useState(false);
    
    return (
        <div className="space-y-4">
            {!showTable ? (
                <div className="text-center py-12">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 max-w-md mx-auto">
                        <UsersIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Succession Planning Table</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                            Generate a dynamic table that filters officers with SPA Rating of 5 or 4 and maps them against vacant or critical roles to visualize the 20/70 mentoring pipeline.
                        </p>
                        <button
                            onClick={() => setShowTable(true)}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-black uppercase flex items-center gap-2 mx-auto hover:from-blue-700 hover:to-blue-800 transition-all"
                        >
                            <ArrowPathIcon className="w-5 h-5" />
                            Generate Pipeline View
                        </button>
                        <div className="mt-4 text-xs text-slate-500">
                            <p>Officers: {officers.length} | Vacant/Critical Roles: {establishmentData.filter(e => ['vacant', 'critical', 'unfilled'].includes(e.status?.toLowerCase() || '')).length}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <SuccessionPlanningTable 
                    officers={officers} 
                    establishmentData={establishmentData}
                    isModal={false}
                />
            )}
        </div>
    );
}