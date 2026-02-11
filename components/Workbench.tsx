import React, { useState, useEffect, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { UrgencyLevel, GradingGroup, PerformanceRatingLevel, CapabilityRating, GapTag, TrainingRecord, OfficerRecord, EligibleOfficer } from '../types';
import { Sidebar } from './Sidebar';
import { SurveyInsights } from './SurveyInsights';
import { ReportingSuiteModal } from './ReportingSuiteModal';
import { StrategicAnalysisDashboard } from './StrategicAnalysisDashboard';
import { ExpenditureReview } from './ExpenditureReview';
import { CnaPolicyToolkit } from './CnaPolicyToolkit';
import { GesiPolicyToolkit } from './GesiPolicyToolkit';
import { useAppContext } from './AppContext';
import { WelcomeModal } from './WelcomeModal';
import { ImportModal } from './ImportModal';
import {
    ChartBarSquareIcon,
    SparklesIcon,
    DocumentChartBarIcon,
    PresentationChartLineIcon,
    UserCircleIcon,
    BuildingOfficeIcon,
    ChartPieIcon,
    TerminalIcon,
    ChatBubbleLeftRightIcon,
    XMarkIcon,
    Bars3Icon} from './icons';

// Terminal Component for 10% Formal Training logs
const TrainingTerminal: React.FC<{
    isVisible: boolean;
    onToggle: () => void;
    trainingLogs: string[];
}> = ({ isVisible, onToggle, trainingLogs }) => {
    if (!isVisible) {
        return (
            <button
                onClick={onToggle}
                className="fixed bottom-4 right-4 bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition-colors z-50"
                title="Show Training Terminal"
            >
                <TerminalIcon className="w-5 h-5" />
            </button>
        );
    }

    return (
        <div className="bg-slate-900 text-white border-t border-slate-700">
            <div className="flex items-center justify-between p-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <TerminalIcon className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold">Training Terminal (10% Formal)</span>
                </div>
                <button
                    onClick={onToggle}
                    className="text-slate-400 hover:text-white transition-colors"
                >
                    <XMarkIcon className="w-4 h-4" />
                </button>
            </div>
            <div className="p-3 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                    {trainingLogs.length === 0 ? (
                        <div className="text-slate-400 text-sm italic">
                            No training logs available. Import data to see formal training activities.
                        </div>
                    ) : (
                        trainingLogs.map((log, index) => (
                            <div key={index} className="text-xs font-mono bg-slate-800 p-2 rounded border-l-2 border-blue-500">
                                <span className="text-blue-400">[{new Date().toLocaleTimeString()}]</span> {log}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// Coaching Panel for 20% Mentoring/Matching
const CoachingPanel: React.FC<{
    isMinimized: boolean;
    onToggle: () => void;
    mentoringMatches: unknown[];
}> = ({ isMinimized, onToggle, mentoringMatches }) => {
    if (isMinimized) {
        return (
            <div className="bg-slate-800 border-l border-slate-700 p-2">
                <button
                    onClick={onToggle}
                    className="w-full flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
                    title="Expand Coaching Panel"
                >
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    <span className="text-xs font-bold writing-mode-vertical">MENTORING</span>
                </button>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 text-white border-l border-slate-700">
            <div className="flex items-center justify-between p-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <ChatBubbleLeftRightIcon className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-bold">Coaching & Mentoring (20%)</span>
                </div>
                <button
                    onClick={onToggle}
                    className="text-slate-400 hover:text-white transition-colors"
                >
                    <Bars3Icon className="w-4 h-4" />
                </button>
            </div>
            <div className="p-3 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                    {mentoringMatches.length === 0 ? (
                        <div className="text-slate-400 text-sm italic text-center py-8">
                            <UserCircleIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            No mentoring matches available. Import officer data to generate matches.
                        </div>
                    ) : (
                        mentoringMatches.map((match, index) => (
                            <div key={index} className="bg-slate-700 p-3 rounded-lg border border-slate-600">
                                <div className="flex items-center gap-2 mb-2">
                                    <UserCircleIcon className="w-4 h-4 text-green-400" />
                                    <span className="text-sm font-bold">{match.mentee}</span>
                                </div>
                                <div className="text-xs text-slate-300">
                                    Matched with: <span className="text-green-400 font-medium">{match.mentor}</span>
                                </div>
                                <div className="text-xs text-slate-400 mt-1">
                                    Focus: {match.focusArea}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

interface WorkbenchProps {
    onLogout: () => void;
}

export const Workbench: React.FC<WorkbenchProps> = ({ onLogout }) => {
    const { state } = useAppContext();
    const [showReportingSuite, setShowReportingSuite] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [showImportModal, setShowImportModal] = useState(false);
    // eslint-disable-next-line no-empty-pattern
    const [] = useState<string | null>(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [terminalVisible, setTerminalVisible] = useState(false);
    const [coachingMinimized, setCoachingMinimized] = useState(true);
    const [activeTab, setActiveTab] = useState('survey-insights');

    // Sync local state with context
    useEffect(() => {
        if (state.error) {
            console.error('Application error:', state.error);
        }
    }, [state.error]);

    // Demo data for organisational overview
    const demoData = useMemo(() => ({
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
    }), []);

    // Demo establishment data
    const demoEstablishmentData = useMemo(() => [
        {
            positionNumber: 'NP-001',
            division: 'Policy & Planning',
            grade: 'Grade 12',
            designation: 'Senior Planning Officer',
            occupant: 'John Smith',
            status: 'Confirmed',
            gen: 'M'
        },
        {
            positionNumber: 'NP-002',
            division: 'M&E Division',
            grade: 'Grade 11',
            designation: 'Monitoring & Evaluation Specialist',
            occupant: 'Mary Johnson',
            status: 'Confirmed',
            gen: 'F'
        },
        {
            positionNumber: 'NP-003',
            division: 'Program Implementation',
            grade: 'Grade 10',
            designation: 'Project Manager',
            occupant: 'David Wilson',
            status: 'Confirmed',
            gen: 'M'
        }
    ], []);

    // Demo corporate plan data
    const demoCorporatePlanData = useMemo(() => ({
        strategic_goals: {
            vision: 'To be a leading public service organization in PNG',
            mission: 'Deliver efficient and effective public services',
            objectives: ['Improve service delivery', 'Enhance workforce capabilities', 'Strengthen governance'],
            values: ['Integrity', 'Excellence', 'Innovation']
        },
        training_needs: 'Leadership development, technical skills enhancement, digital literacy',
        financial_context: 'Budget allocation for training programs',
        risk_assessment: 'Skills gaps in critical areas',
        personnel_establishment: 'Current staffing levels adequate but skill gaps exist',
        full_document_context: 'Strategic plan focuses on organizational development and capacity building'
    }), []);

    // Demo officers data (simplified for demo purposes)
    const demoOfficers: OfficerRecord[] = useMemo(() => [
        {
            employmentStatus: 'Confirmed',
            lifecycleStage: 'Peak Performer',
            urgency: 'High' as UrgencyLevel,
            jobQualification: 'Masters Degree',
            technicalCapabilityGaps: ['Strategic Planning'],
            yearsOfExperience: 15,
            gradingGroup: 'Senior Management' as GradingGroup,
            gender: 'Male',
            spaRating: 'Outstanding',
            age: 45,
            email: 'john.smith@gov.na',
            name: 'John Smith',
            position: 'Senior Planning Officer',
            positionNumber: 'NP-001',
            dateOfBirth: '1979-05-15',
            commencementDate: '2009-01-01',
            division: 'Policy & Planning',
            grade: 'Grade 12',
            performanceRatingLevel: 'Well Above Required' as PerformanceRatingLevel,
            capabilityRatings: [] as CapabilityRating[],
            gapTag: '[ALIGNED]' as GapTag,
            gapTagReason: 'Strong alignment with organizational goals',
            trainingHistory: [] as TrainingRecord[],
            trainingPreferences: ['Leadership Development', 'Strategic Planning'],
            ictSkills: ['Advanced Excel', 'PowerPoint'],
            leadershipCapabilityGaps: [],
            // Additional properties for ReportingSuiteModal
            occupant: 'John Smith',
            designation: 'Senior Planning Officer',
            status: 'Confirmed',
            cnaSubmission: 'Yes',
            trainingYear: [2024, 2025],
            branch: 'Policy & Planning'
        },
        {
            employmentStatus: 'Confirmed',
            lifecycleStage: 'High Potential',
            urgency: 'Medium' as UrgencyLevel,
            jobQualification: 'Bachelors Degree',
            technicalCapabilityGaps: ['Data Analytics'],
            yearsOfExperience: 8,
            gradingGroup: 'Professional' as GradingGroup,
            gender: 'Female',
            spaRating: 'Good',
            age: 35,
            email: 'mary.johnson@gov.na',
            name: 'Mary Johnson',
            position: 'Monitoring & Evaluation Specialist',
            positionNumber: 'NP-002',
            dateOfBirth: '1989-03-22',
            commencementDate: '2016-07-01',
            division: 'M&E Division',
            grade: 'Grade 11',
            performanceRatingLevel: 'Above Required' as PerformanceRatingLevel,
            capabilityRatings: [] as CapabilityRating[],
            gapTag: '[SKILL_GAP]' as GapTag,
            gapTagReason: 'Needs development in data analytics',
            trainingHistory: [] as TrainingRecord[],
            trainingPreferences: ['Data Analytics', 'Monitoring & Evaluation'],
            ictSkills: ['Excel', 'SPSS'],
            leadershipCapabilityGaps: [],
            // Additional properties for ReportingSuiteModal
            occupant: 'Mary Johnson',
            designation: 'Monitoring & Evaluation Specialist',
            status: 'Confirmed',
            cnaSubmission: 'Yes',
            trainingYear: [2024],
            branch: 'M&E Division'
        },
        {
            employmentStatus: 'Confirmed',
            lifecycleStage: 'Early Career',
            urgency: 'High' as UrgencyLevel,
            jobQualification: 'Bachelors Degree',
            technicalCapabilityGaps: ['Project Management'],
            yearsOfExperience: 3,
            gradingGroup: 'Professional' as GradingGroup,
            gender: 'Male',
            spaRating: 'Developing',
            age: 28,
            email: 'david.wilson@gov.na',
            name: 'David Wilson',
            position: 'Project Manager',
            positionNumber: 'NP-003',
            dateOfBirth: '1996-11-08',
            commencementDate: '2021-09-01',
            division: 'Program Implementation',
            grade: 'Grade 10',
            performanceRatingLevel: 'Below Required Level' as PerformanceRatingLevel,
            capabilityRatings: [] as CapabilityRating[],
            gapTag: '[CRITICAL_GAP]' as GapTag,
            gapTagReason: 'Critical gap in project management skills',
            trainingHistory: [] as TrainingRecord[],
            trainingPreferences: ['Project Management', 'Team Leadership'],
            ictSkills: ['MS Project', 'Word'],
            leadershipCapabilityGaps: ['Team Management'],
            // Additional properties for ReportingSuiteModal
            occupant: 'David Wilson',
            designation: 'Project Manager',
            status: 'Confirmed',
            cnaSubmission: 'Yes',
            trainingYear: [2024, 2025, 2026],
            branch: 'Program Implementation'
        }
    ], []);

    // Mock training logs for terminal
    const trainingLogs = useMemo(() => [
        'Formal training session completed: Leadership Development Workshop',
        'Certification achieved: Project Management Professional (PMP)',
        'Online course completed: Advanced Data Analytics',
        'Workshop attended: Strategic Planning and Execution',
        'Training program initiated: Digital Literacy Enhancement'
    ], []);

    // Mock mentoring matches
    const mentoringMatches = useMemo(() => [
        { mentee: 'David Wilson', mentor: 'John Smith', focusArea: 'Project Management' },
        { mentee: 'Sarah Chen', mentor: 'Mary Johnson', focusArea: 'Data Analytics' },
        { mentee: 'Mike Johnson', mentor: 'John Smith', focusArea: 'Leadership Skills' }
    ], []);

    const renderMainContent = () => {
        switch (activeTab) {
            case 'survey-insights':
                return (
                    <SurveyInsights
                        officers={demoOfficers}
                        baselineData={{
                            agencyName: demoData.agencyName,
                            kpis: demoData.kpis
                        }}
                        corporatePlanData={demoCorporatePlanData}
                        establishmentData={demoEstablishmentData}
                    />
                );
            case 'organizational':
                return (
                    <StrategicAnalysisDashboard
                        agencyName={demoData.agencyName}
                        cnaData={demoOfficers}
                        establishmentData={[]}
                        onClose={() => setActiveTab('survey-insights')}
                    />
                );
            case 'expenditure-review':
                return (
                    <ExpenditureReview
                        officers={demoOfficers}
                        baselineData={{
                            agencyName: demoData.agencyName,
                            kpis: demoData.kpis
                        }}
                    />
                );
            case 'cna':
                return <CnaPolicyToolkit />;
            case 'gesi':
                return <GesiPolicyToolkit onShowGesiAnalysis={() => {}} />;
            default:
                return (
                    <div className="flex-1 p-20 flex flex-col items-center justify-center text-center">
                        <h2 className="text-2xl font-bold text-slate-300 uppercase tracking-widest">
                            Select a Pane
                        </h2>
                        <p className="text-slate-400 mt-2">Choose a component from the sidebar to display</p>
                    </div>
                );
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="h-screen bg-slate-50 flex flex-col">
                {/* Top Header */}
                <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <Bars3Icon className="w-5 h-5 text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 uppercase">
                                {demoData.agencyName}
                            </h1>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">
                                CNA Workbench
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-xs font-medium text-slate-700">Live Data</span>
                        </div>

                        <button
                            onClick={() => setShowReportingSuite(true)}
                            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-black uppercase flex items-center gap-2 hover:bg-slate-800 transition-colors"
                        >
                            <PresentationChartLineIcon className="w-4 h-4" />
                            Reports
                        </button>

                        <button
                            onClick={onLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase hover:bg-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Main Workbench Area */}
                <div className="flex-1 overflow-hidden">
                    <PanelGroup direction="horizontal">
                        {/* Sidebar Panel */}
                        <Panel defaultSize={20} minSize={15} maxSize={30} collapsible={true}>
                            <div className="h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 border-r border-white/20">
                                <Sidebar
                                    currentView={activeTab}
                                    setView={setActiveTab}
                                    onImportClick={() => setShowImportModal(true)}
                                    isOpen={true}
                                    onClose={() => {}}
                                />
                            </div>
                        </Panel>

                        <PanelResizeHandle className="w-1 bg-slate-300 hover:bg-slate-400 transition-colors" />

                        {/* Main Content Area */}
                        <Panel defaultSize={60} minSize={40}>
                            <PanelGroup direction="vertical">
                                {/* Tabbed Main Center */}
                                <Panel defaultSize={75} minSize={50}>
                                    <div className="h-full bg-white border-b border-slate-200">
                                        {/* Tab Bar */}
                                        <div className="flex items-center border-b border-slate-200 bg-slate-50">
                                            <div className="flex items-center gap-1 px-4">
                                                {[
                                                    { id: 'survey-insights', label: 'Survey Insights', icon: ChartBarSquareIcon },
                                                    { id: 'organizational', label: 'Strategic Analysis', icon: BuildingOfficeIcon },
                                                    { id: 'expenditure-review', label: 'Expenditure Review', icon: ChartPieIcon },
                                                    { id: 'cna', label: 'CNA Toolkit', icon: DocumentChartBarIcon },
                                                    { id: 'gesi', label: 'GESI Toolkit', icon: SparklesIcon }
                                                ].map((tab) => (
                                                    <button
                                                        key={tab.id}
                                                        onClick={() => setActiveTab(tab.id)}
                                                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                                            activeTab === tab.id
                                                                ? 'border-blue-500 text-blue-600 bg-white'
                                                                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        <tab.icon className="w-4 h-4" />
                                                        {tab.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Main Content */}
                                        <div className="h-full overflow-auto">
                                            {renderMainContent()}
                                        </div>
                                    </div>
                                </Panel>

                                <PanelResizeHandle className="h-1 bg-slate-300 hover:bg-slate-400 transition-colors" />

                                {/* Bottom Terminal */}
                                <Panel defaultSize={25} minSize={15} maxSize={40} collapsible={true}>
                                    <TrainingTerminal
                                        isVisible={terminalVisible}
                                        onToggle={() => setTerminalVisible(!terminalVisible)}
                                        trainingLogs={trainingLogs}
                                    />
                                </Panel>
                            </PanelGroup>
                        </Panel>

                        <PanelResizeHandle className="w-1 bg-slate-300 hover:bg-slate-400 transition-colors" />

                        {/* Right Coaching Panel */}
                        <Panel defaultSize={20} minSize={15} maxSize={30} collapsible={true}>
                            <CoachingPanel
                                isMinimized={coachingMinimized}
                                onToggle={() => setCoachingMinimized(!coachingMinimized)}
                                mentoringMatches={mentoringMatches}
                            />
                        </Panel>
                    </PanelGroup>
                </div>

                {/* Modals */}
                {showReportingSuite && (
                    <ReportingSuiteModal
                        division={demoData.agencyName}
                        officers={(demoOfficers as unknown) as EligibleOfficer[]}
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
                        onImport={(data, agencyType, agencyName, establishmentData, corporatePlanContext) => {
                            console.log('Import completed:', { data, agencyType, agencyName, establishmentData, corporatePlanContext });
                            setShowImportModal(false);
                        }}
                        onClose={() => setShowImportModal(false)}
                    />
                )}
            </div>
        </DndProvider>
    );
};
