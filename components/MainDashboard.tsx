import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { OfficerRecord, EligibleOfficer, EstablishmentRecord, StructuredCorporatePlan, AgencyType } from '../types';
import { Sidebar } from './Sidebar';
import { ReportingSuiteModal } from './ReportingSuiteModal';
import { StrategicAnalysisDashboard } from './StrategicAnalysisDashboard';
import { SurveyInsights } from './SurveyInsights';
import { ExpenditureReview } from './ExpenditureReview';
import { CnaPolicyToolkit } from './CnaPolicyToolkit';
import { GesiPolicyToolkit } from './GesiPolicyToolkit';
import { SystemSettings } from './SystemSettings';
import { CapabilityGapAnalysisReport } from './CapabilityGapAnalysisReport';

import { useAppContext } from './AppContext';

// Individual-focused components
import { WelcomeModal } from './WelcomeModal';
import { ImportModal } from './ImportModal';
import { IndividualTalentCardReport } from './IndividualTalentCardReport';
import {
    ChartBarSquareIcon,
    UsersIcon,
    AcademicCapIcon,
    SparklesIcon,
    DocumentChartBarIcon,
    PresentationChartLineIcon,
    UserCircleIcon,
    BuildingOfficeIcon,
    ChevronDownIcon,
    IdentificationIcon,
    ArrowRightIcon,
    ChartPieIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    TableCellsIcon,
    ArrowDownTrayIcon,
    InformationCircleIcon,
    CalendarDaysIcon} from './icons';

interface MainDashboardProps {
    onLogout: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ onLogout }) => {
    const { state, setCurrentView } = useAppContext();
    const [showReportingSuite, setShowReportingSuite] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showCapabilityGapReport, setShowCapabilityGapReport] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    // Use actual imported data or fallback to demo data for display
    const officers = state.officers.length > 0 ? state.officers : [];
    const establishmentData = state.establishmentData.length > 0 ? state.establishmentData : [];
    const corporatePlanData = state.corporatePlanData;
    const aggregatedData = state.aggregatedData;

    // Check if data has been imported
    const hasImportedData = state.officers.length > 0 || state.establishmentData.length > 0;

    // Compute effective data for display
    const effectiveData = useMemo(() => {
        if (hasImportedData) {
            return {
                agencyName: state.corporatePlanData?.strategic_goals?.vision?.substring(0, 30) || 'Imported Agency',
                totalStaff: establishmentData.length,
                activeSurveys: officers.length,
                completionRate: establishmentData.length > 0 ? Math.round((officers.length / establishmentData.length) * 100) : 0,
                criticalGaps: aggregatedData?.skillGapsCount || 0,
                kpis: {
                    establishmentGap: aggregatedData?.vacancyRate || 0,
                    baselineScore: aggregatedData?.baselineScore || 0,
                    criticalSkillGaps: aggregatedData?.skillGapsCount || 0,
                    trainingCompletion: aggregatedData?.participationRate ? Math.round(aggregatedData.participationRate * 100) : 0
                }
            };
        }
        // Fallback demo data when no imported data
        return {
            agencyName: "Department of Personnel Management",
            totalStaff: 245,
            activeSurveys: 189,
            completionRate: 77,
            criticalGaps: 23,
            kpis: {
                establishmentGap: 18,
                baselineScore: 6.5,
                criticalSkillGaps: 12,
                trainingCompletion: 10
            }
        };
    }, [hasImportedData, state.corporatePlanData, establishmentData.length, officers.length, aggregatedData]);

    // Sync local state with context
    useEffect(() => {
        if (state.error) {
            console.error('Application error:', state.error);
        }
    }, [state.error]);

    // Handle import completion
    const handleImport = useCallback((
        data: OfficerRecord[],
        _agencyType: string,
        agencyName: string,
        establishmentRecords?: EstablishmentRecord[],
        corporatePlan?: StructuredCorporatePlan
    ) => {
        console.log('Import completed:', { 
            officersCount: data.length, 
            agencyName, 
            establishmentCount: establishmentRecords?.length,
            hasCorporatePlan: !!corporatePlan 
        });
        
        // Data is already dispatched to context in ImportModal.handleCompleteImport
        // Just close the modal
        setShowImportModal(false);
    }, []);



    const renderView = () => {
        switch (state.currentView) {
            case 'dashboard':
                return (
                    <div className="p-8 space-y-8">
                        {/* Organisational Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-500 uppercase">Total Workforce</p>
                                        <p className="text-2xl font-black text-slate-900">{effectiveData.totalStaff}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400">Active positions in establishment</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <UsersIcon className="w-8 h-8 text-emerald-600" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-500 uppercase">Survey Responses</p>
                                        <p className="text-2xl font-black text-slate-900">{effectiveData.activeSurveys}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400">{effectiveData.completionRate}% completion rate</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <SparklesIcon className="w-8 h-8 text-amber-600" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-500 uppercase">Critical Gaps</p>
                                        <p className="text-2xl font-black text-slate-900">{effectiveData.criticalGaps}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400">High-priority capability needs</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <AcademicCapIcon className="w-8 h-8 text-purple-600" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-500 uppercase">Training Pipeline</p>
                                        <p className="text-2xl font-black text-slate-900">{effectiveData.kpis.trainingCompletion}%</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400">Current training completion</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button
                                onClick={() => setCurrentView('organizational')}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
                            >
                                <ChartBarSquareIcon className="w-8 h-8 mb-3" />
                                <h3 className="text-lg font-black uppercase mb-2">Strategic Analysis</h3>
                                <p className="text-sm opacity-90">View workforce analytics and KPIs</p>
                            </button>

                            <button
                                onClick={() => setCurrentView('individual')}
                                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all transform hover:scale-105"
                            >
                                <UserCircleIcon className="w-8 h-8 mb-3" />
                                <h3 className="text-lg font-black uppercase mb-2">Individual Operations</h3>
                                <p className="text-sm opacity-90">Officer-specific analysis and plans</p>
                            </button>

                            <button
                                onClick={() => setShowReportingSuite(true)}
                                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105"
                            >
                                <DocumentChartBarIcon className="w-8 h-8 mb-3" />
                                <h3 className="text-lg font-black uppercase mb-2">Reporting Suite</h3>
                                <p className="text-sm opacity-90">Generate comprehensive reports</p>
                            </button>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-black text-slate-900 uppercase mb-4">Recent Activity</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900">CNA Survey Analysis Completed</p>
                                        <p className="text-xs text-slate-500">{effectiveData.activeSurveys} responses processed • 2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900">Establishment Data Imported</p>
                                        <p className="text-xs text-slate-500">{effectiveData.totalStaff} positions synchronized • 1 day ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900">{effectiveData.criticalGaps} Critical Gaps Identified</p>
                                        <p className="text-xs text-slate-500">Action plans generated • 3 days ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'organizational':
                return (
                    <StrategicAnalysisDashboard
                        agencyName={effectiveData.agencyName}
                        cnaData={officers}
                        establishmentData={establishmentData}
                        corporatePlanData={corporatePlanData || undefined}
                        onClose={() => setCurrentView('cna')}
                    />
                );

            case 'individual':
                if (selectedItem) {
                    // Render the selected component
                    switch (selectedItem) {
                        case 'individual-talent-card':
                            return (
                                <div className="p-8">
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                                    >
                                        ← Back to Individual Operations
                                    </button>
                                    {officers.length > 0 ? (
                                        <IndividualTalentCardReport
                                            officer={officers[0]}
                                            establishmentData={establishmentData}
                                            onClose={() => setSelectedItem(null)}
                                        />
                                    ) : (
                                        <div className="text-center py-20">
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Data Available</h3>
                                            <p className="text-slate-600">Import data to view individual talent card reports.</p>
                                        </div>
                                    )}
                                </div>
                            );
                        default:
                            return (
                                <div className="p-8">
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                                    >
                                        ← Back to Individual Operations
                                    </button>
                                    <div className="text-center py-20">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Component Under Development</h3>
                                        <p className="text-slate-600">This component is currently being implemented.</p>
                                    </div>
                                </div>
                            );
                    }
                }

                return (
                    <div className="p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-slate-900 uppercase mb-2">Individual Operations</h2>
                            <p className="text-slate-600">Access individual officer reports, forms, and tools in a horizontal view</p>
                        </div>

                        {/* Horizontal Scrollable Container */}
                        <div className="overflow-x-auto pb-4">
                            <div className="flex gap-6 min-w-max">
                                {/* Reports */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-w-[300px]">
                                    <h3 className="text-lg font-black text-slate-900 uppercase mb-4">Reports</h3>
                                    <div className="space-y-3">
                                        <button onClick={() => setSelectedItem('individual-talent-card')} className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-3">
                                            <IdentificationIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">Individual Talent Card Report</h4>
                                                <p className="text-xs text-slate-600">Individual talent assessment</p>
                                            </div>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-3">
                                            <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">Eligible Officers Report</h4>
                                                <p className="text-xs text-slate-600">Training eligibility assessment</p>
                                            </div>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-3">
                                            <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">Training Needs Analysis Report</h4>
                                                <p className="text-xs text-slate-600">Comprehensive training needs assessment</p>
                                            </div>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-3">
                                            <CalendarDaysIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">Training Plan Report</h4>
                                                <p className="text-xs text-slate-600">Strategic training planning</p>
                                            </div>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-3">
                                            <ArrowRightIcon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">Succession Plan Report</h4>
                                                <p className="text-xs text-slate-600">Leadership succession planning</p>
                                            </div>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-3">
                                            <ChartPieIcon className="w-5 h-5 text-pink-600 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">Talent Segmentation Report</h4>
                                                <p className="text-xs text-slate-600">Talent categorization and analysis</p>
                                            </div>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-3">
                                            <UserCircleIcon className="w-5 h-5 text-teal-600 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">Individual Development Profile</h4>
                                                <p className="text-xs text-slate-600">Personal development profile</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Forms */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-w-[300px]">
                                    <h3 className="text-lg font-black text-slate-900 uppercase mb-4">Forms</h3>
                                    <div className="space-y-3">
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Individual Lnd Plan Form</h4>
                                            <p className="text-xs text-slate-600">Personal learning and development planning</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Job Group Knowledge Form</h4>
                                            <p className="text-xs text-slate-600">Job group knowledge requirements</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Automated Eligibility Form</h4>
                                            <p className="text-xs text-slate-600">Automated eligibility assessment</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Manual Eligible Officer Form</h4>
                                            <p className="text-xs text-slate-600">Manual officer eligibility form</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Edit Eligible Officer Modal</h4>
                                            <p className="text-xs text-slate-600">Edit officer eligibility details</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Edit Experience Modal</h4>
                                            <p className="text-xs text-slate-600">Edit work experience details</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Tools */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-w-[300px]">
                                    <h3 className="text-lg font-black text-slate-900 uppercase mb-4">Tools</h3>
                                    <div className="space-y-3">
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-3">
                                            <UserCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">Staff Card</h4>
                                                <p className="text-xs text-slate-600">Individual staff information card</p>
                                            </div>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-3">
                                            <TableCellsIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">Succession Planning Table</h4>
                                                <p className="text-xs text-slate-600">Succession planning interface</p>
                                            </div>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-3">
                                            <ChartPieIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">Framework Graphic</h4>
                                                <p className="text-xs text-slate-600">10:20:70 framework visualization</p>
                                            </div>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-3">
                                            <ArrowDownTrayIcon className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">Export Menu</h4>
                                                <p className="text-xs text-slate-600">Data export options</p>
                                            </div>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-3">
                                            <SparklesIcon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">Lnd Ai Assistant Modal</h4>
                                                <p className="text-xs text-slate-600">AI-powered L&D assistance</p>
                                            </div>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-3">
                                            <InformationCircleIcon className="w-5 h-5 text-teal-600 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">User Guide Modal</h4>
                                                <p className="text-xs text-slate-600">System user guide</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Additional Reports */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-w-[300px]">
                                    <h3 className="text-lg font-black text-slate-900 uppercase mb-4">More Reports</h3>
                                    <div className="space-y-3">
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Training Eligibility Summary Report</h4>
                                            <p className="text-xs text-slate-600">Training eligibility overview</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Training Pathways Report</h4>
                                            <p className="text-xs text-slate-600">Training pathway development</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Development Pathways Report</h4>
                                            <p className="text-xs text-slate-600">Career development pathways</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Competency Domain Report</h4>
                                            <p className="text-xs text-slate-600">Domain-specific competency analysis</p>
                                        </button>
                                        <button onClick={() => setShowCapabilityGapReport(true)} className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Capability Gap Analysis Report</h4>
                                            <p className="text-xs text-slate-600">Identify and analyze capability gaps</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Bulk Talent Card Report</h4>
                                            <p className="text-xs text-slate-600">Bulk talent card generation</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'survey-insights':
                return (
                    <SurveyInsights
                        officers={officers}
                        establishmentData={establishmentData}
                        corporatePlanData={corporatePlanData || undefined}
                        baselineData={{
                            agencyName: effectiveData.agencyName,
                            kpis: effectiveData.kpis
                        }}
                    />
                );

            case 'expenditure-review':
                return (
                    <ExpenditureReview
                        officers={officers}
                        baselineData={{
                            agencyName: effectiveData.agencyName,
                            kpis: effectiveData.kpis
                        }}
                    />
                );

            case 'cna':
                return <CnaPolicyToolkit />;

            case 'gesi':
                return <GesiPolicyToolkit onShowGesiAnalysis={() => {}} />;

            case 'settings':
                return <SystemSettings />;

            case 'pathways':
                return (
                    <div className="p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-slate-900 uppercase mb-2">Development Pathways</h2>
                            <p className="text-slate-600">Access career development pathways and training progression</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <button onClick={() => setCurrentView('all-components')} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 transition-colors text-left">
                                <h3 className="text-lg font-black text-slate-900 uppercase mb-2">Training Pathways Report</h3>
                                <p className="text-sm text-slate-600">View training pathway development</p>
                            </button>
                            <button onClick={() => setCurrentView('all-components')} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 transition-colors text-left">
                                <h3 className="text-lg font-black text-slate-900 uppercase mb-2">Development Pathways Report</h3>
                                <p className="text-sm text-slate-600">Career development pathways</p>
                            </button>
                            <button onClick={() => setCurrentView('all-components')} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 transition-colors text-left">
                                <h3 className="text-lg font-black text-slate-900 uppercase mb-2">Competency Projection Report</h3>
                                <p className="text-sm text-slate-600">Future competency forecasting</p>
                            </button>
                        </div>
                    </div>
                );

            case 'all-components':
                return (
                    <div className="p-8 space-y-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-slate-900 uppercase mb-2">All Components Overview</h2>
                            <p className="text-slate-600">Comprehensive view of all available reports and forms in the system</p>
                        </div>

                        {/* Reports Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-black text-slate-900 uppercase mb-4">Reports</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Annual Training Plan Report</h4>
                                    <p className="text-sm text-slate-600">Yearly training interventions and planning</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Capability Gap Analysis Report</h4>
                                    <p className="text-sm text-slate-600">Identify and analyze capability gaps</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Competency Domain Report</h4>
                                    <p className="text-sm text-slate-600">Domain-specific competency analysis</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Consolidated Lifecycle Plan Report</h4>
                                    <p className="text-sm text-slate-600">Lifecycle planning across the organization</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">GESI Analysis Report</h4>
                                    <p className="text-sm text-slate-600">Gender equity and social inclusion analysis</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Succession Plan Report</h4>
                                    <p className="text-sm text-slate-600">Leadership succession planning</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Talent Segmentation Report</h4>
                                    <p className="text-sm text-slate-600">Talent categorization and analysis</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Workforce Snapshot Report</h4>
                                    <p className="text-sm text-slate-600">Current workforce overview</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Development Pathways Report</h4>
                                    <p className="text-sm text-slate-600">Career development pathways</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Eligible Officers Report</h4>
                                    <p className="text-sm text-slate-600">Training eligibility assessment</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Training Needs Analysis Report</h4>
                                    <p className="text-sm text-slate-600">Comprehensive training needs assessment</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Training Plan Report</h4>
                                    <p className="text-sm text-slate-600">Strategic training planning</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Organisational Structure Report</h4>
                                    <p className="text-sm text-slate-600">Organizational hierarchy analysis</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Organisational Establishment Report</h4>
                                    <p className="text-sm text-slate-600">Establishment data analysis</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Consolidated Strategic Plan Report</h4>
                                    <p className="text-sm text-slate-600">Strategic planning consolidation</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Detailed Capability Breakdown Report</h4>
                                    <p className="text-sm text-slate-600">Detailed capability analysis</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Corporate Plan Analysis Report</h4>
                                    <p className="text-sm text-slate-600">Corporate plan evaluation</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Competency Projection Report</h4>
                                    <p className="text-sm text-slate-600">Future competency forecasting</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Consolidated Training Plan Report</h4>
                                    <p className="text-sm text-slate-600">Training plan consolidation</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Training Pathways Report</h4>
                                    <p className="text-sm text-slate-600">Training pathway development</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Training Eligibility Summary Report</h4>
                                    <p className="text-sm text-slate-600">Training eligibility overview</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Training Calendar Report</h4>
                                    <p className="text-sm text-slate-600">Training schedule management</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Kra Matrix Report</h4>
                                    <p className="text-sm text-slate-600">Key result area analysis</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Item Level Analysis Report</h4>
                                    <p className="text-sm text-slate-600">Detailed item analysis</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Grading Group Report</h4>
                                    <p className="text-sm text-slate-600">Grading group analysis</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Individual Talent Card Report</h4>
                                    <p className="text-sm text-slate-600">Individual talent assessment</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Bulk Talent Card Report</h4>
                                    <p className="text-sm text-slate-600">Bulk talent card generation</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Automated Organisational Analysis Report</h4>
                                    <p className="text-sm text-slate-600">Automated organizational insights</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Automated Job Group Knowledge Report</h4>
                                    <p className="text-sm text-slate-600">Job group knowledge assessment</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Automated Individual Lnd Plans Report</h4>
                                    <p className="text-sm text-slate-600">Individual learning plans</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Automated Lnd Recommendations Report</h4>
                                    <p className="text-sm text-slate-600">Automated learning recommendations</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Automated Desired Experience Report</h4>
                                    <p className="text-sm text-slate-600">Desired experience analysis</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Five Year Plan Report</h4>
                                    <p className="text-sm text-slate-600">Long-term planning report</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">AI Analysis Report</h4>
                                    <p className="text-sm text-slate-600">AI-powered organizational analysis</p>
                                </div>
                            </div>
                        </div>

                        {/* Forms Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-black text-slate-900 uppercase mb-4">Forms</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Individual Lnd Plan Form</h4>
                                    <p className="text-sm text-slate-600">Personal learning and development planning</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Job Group Knowledge Form</h4>
                                    <p className="text-sm text-slate-600">Job group knowledge requirements</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Automated Eligibility Form</h4>
                                    <p className="text-sm text-slate-600">Automated eligibility assessment</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Manual Eligible Officer Form</h4>
                                    <p className="text-sm text-slate-600">Manual officer eligibility form</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Edit Eligible Officer Modal</h4>
                                    <p className="text-sm text-slate-600">Edit officer eligibility details</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Edit Experience Modal</h4>
                                    <p className="text-sm text-slate-600">Edit work experience details</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Training Category Modal</h4>
                                    <p className="text-sm text-slate-600">Training category management</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Import Modal</h4>
                                    <p className="text-sm text-slate-600">Data import functionality</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Lnd Ai Assistant Modal</h4>
                                    <p className="text-sm text-slate-600">AI-powered L&D assistance</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">User Guide Modal</h4>
                                    <p className="text-sm text-slate-600">System user guide</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Welcome Modal</h4>
                                    <p className="text-sm text-slate-600">System welcome screen</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Reporting Suite Modal</h4>
                                    <p className="text-sm text-slate-600">Comprehensive reporting interface</p>
                                </div>
                            </div>
                        </div>

                        {/* Toolkits Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-black text-slate-900 uppercase mb-4">Toolkits</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">CNA Policy Toolkit</h4>
                                    <p className="text-sm text-slate-600">Capability needs analysis tools</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">GESI Policy Toolkit</h4>
                                    <p className="text-sm text-slate-600">Gender equity and social inclusion tools</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">CNA Home</h4>
                                    <p className="text-sm text-slate-600">CNA toolkit homepage</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">CNA Analysis Guide</h4>
                                    <p className="text-sm text-slate-600">CNA analysis guidelines</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">CNA Lnd Planning</h4>
                                    <p className="text-sm text-slate-600">CNA learning planning tools</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">CNA Overview</h4>
                                    <p className="text-sm text-slate-600">CNA process overview</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">CNA Process Guide</h4>
                                    <p className="text-sm text-slate-600">CNA process guidelines</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">CNA Resources</h4>
                                    <p className="text-sm text-slate-600">CNA resource library</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">GESI Overview</h4>
                                    <p className="text-sm text-slate-600">GESI toolkit overview</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">GESI Role Detail</h4>
                                    <p className="text-sm text-slate-600">GESI role-specific details</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">GESI Training Toolkit</h4>
                                    <p className="text-sm text-slate-600">GESI training resources</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">GESI Compliance Tool</h4>
                                    <p className="text-sm text-slate-600">GESI compliance assessment</p>
                                </div>
                            </div>
                        </div>

                        {/* Dashboards Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-black text-slate-900 uppercase mb-4">Dashboards</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Strategic Analysis Dashboard</h4>
                                    <p className="text-sm text-slate-600">Strategic workforce analytics</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Survey Insights</h4>
                                    <p className="text-sm text-slate-600">CNA survey data insights</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Expenditure Review</h4>
                                    <p className="text-sm text-slate-600">Training expenditure analysis</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Visual Dashboard Summary</h4>
                                    <p className="text-sm text-slate-600">Visual data summaries</p>
                                </div>
                            </div>
                        </div>

                        {/* Other Components Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-black text-slate-900 uppercase mb-4">Other Components</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Staff Card</h4>
                                    <p className="text-sm text-slate-600">Individual staff information card</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Cna Evidence Master Table</h4>
                                    <p className="text-sm text-slate-600">CNA evidence management</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Succession Planning Table</h4>
                                    <p className="text-sm text-slate-600">Succession planning interface</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Framework Graphic</h4>
                                    <p className="text-sm text-slate-600">10:20:70 framework visualization</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">System Settings</h4>
                                    <p className="text-sm text-slate-600">System configuration options</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Certificate Of Compliance</h4>
                                    <p className="text-sm text-slate-600">Compliance certification</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Automated Establishment Summary</h4>
                                    <p className="text-sm text-slate-600">Automated establishment overview</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Individual Development Profile</h4>
                                    <p className="text-sm text-slate-600">Personal development profile</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Export Menu</h4>
                                    <p className="text-sm text-slate-600">Data export options</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="flex-1 p-20 flex flex-col items-center justify-center text-center">
                        <h2 className="text-2xl font-bold text-slate-300 uppercase tracking-widest">
                            Section Under Development
                        </h2>
                        <p className="text-slate-400 mt-2">Integrating 10:20:70 Framework...</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar
                currentView={state.currentView}
                setView={setCurrentView}
                onImportClick={() => setShowImportModal(true)}
                isOpen={true}
                onClose={() => {}}
            />

            <main className="flex-1 overflow-y-auto ml-0 md:ml-64 pt-20">
                {/* Top Header with Reporting Suite */}
                <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center fixed top-0 left-0 md:left-64 right-0 z-20">
                    <div>
                        <h1 className="text-xl font-black text-slate-900 uppercase">
                            {effectiveData.agencyName}
                        </h1>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">
                            Capability Needs Analysis System
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowReportingSuite(true)}
                            className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-black uppercase flex items-center gap-2 hover:bg-slate-800 transition-colors"
                        >
                            <PresentationChartLineIcon className="w-4 h-4" />
                            Reporting Suite
                            <ChevronDownIcon className="w-4 h-4" />
                        </button>

                        <button
                            onClick={onLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold uppercase hover:bg-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {renderView()}
            </main>

            {/* Modals */}
            {showReportingSuite && (
                <ReportingSuiteModal
                    division={effectiveData.agencyName}
                    officers={(officers as unknown) as EligibleOfficer[]}
                    establishmentData={establishmentData}
                    corporatePlanData={corporatePlanData || undefined}
                    yearHeaders={[2024, 2025, 2026, 2027, 2028]}
                    onClose={() => setShowReportingSuite(false)}
                />
            )}

            {showWelcome && (
                <WelcomeModal
                    onClose={() => setShowWelcome(false)}
                    onViewPolicy={() => {}}
                />
            )}

            {showImportModal && (
                <ImportModal
                    onImport={handleImport}
                    onClose={() => setShowImportModal(false)}
                />
            )}

            {showCapabilityGapReport && (
                <CapabilityGapAnalysisReport
                    data={officers}
                    agencyName={effectiveData.agencyName}
                    onClose={() => setShowCapabilityGapReport(false)}
                />
            )}
        </div>
    );
};
