import React, { useState, useMemo } from 'react';
import { View, UrgencyLevel, GradingGroup, PerformanceRatingLevel, CapabilityRating, GapTag, TrainingRecord, OfficerRecord } from '../types';
import { Sidebar } from './Sidebar';
import { ReportingSuiteModal } from './ReportingSuiteModal';
import { StrategicAnalysisDashboard } from './StrategicAnalysisDashboard';
import { SurveyInsights } from './SurveyInsights';
import { ExpenditureReview } from './ExpenditureReview';
import { CnaPolicyToolkit } from './CnaPolicyToolkit';
import { GesiPolicyToolkit } from './GesiPolicyToolkit';

// Individual-focused components
import { WelcomeModal } from './WelcomeModal';
import {
    ChartBarSquareIcon,
    UsersIcon,
    AcademicCapIcon,
    SparklesIcon,
    DocumentChartBarIcon,
    PresentationChartLineIcon,
    UserCircleIcon,
    BuildingOfficeIcon,
    ChevronDownIcon
} from './icons';

interface MainDashboardProps {
    onLogout: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ onLogout }) => {
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [showReportingSuite, setShowReportingSuite] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);

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



    const renderView = () => {
        switch (currentView) {
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
                                        <p className="text-2xl font-black text-slate-900">{demoData.totalStaff}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400">Active positions in establishment</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <UsersIcon className="w-8 h-8 text-emerald-600" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-500 uppercase">Survey Responses</p>
                                        <p className="text-2xl font-black text-slate-900">{demoData.activeSurveys}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400">{demoData.completionRate}% completion rate</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <SparklesIcon className="w-8 h-8 text-amber-600" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-500 uppercase">Critical Gaps</p>
                                        <p className="text-2xl font-black text-slate-900">{demoData.criticalGaps}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400">High-priority capability needs</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <AcademicCapIcon className="w-8 h-8 text-purple-600" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-500 uppercase">Training Pipeline</p>
                                        <p className="text-2xl font-black text-slate-900">{demoData.kpis.trainingCompletion}%</p>
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
                                        <p className="text-xs text-slate-500">189 responses processed • 2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900">Establishment Data Imported</p>
                                        <p className="text-xs text-slate-500">245 positions synchronized • 1 day ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900">23 Critical Gaps Identified</p>
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
                        agencyName={demoData.agencyName}
                        cnaData={demoOfficers}
                        establishmentData={[]}
                        onClose={() => setCurrentView('cna')}
                    />
                );

            case 'individual':
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
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Individual Talent Card Report</h4>
                                            <p className="text-xs text-slate-600">Individual talent assessment</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Eligible Officers Report</h4>
                                            <p className="text-xs text-slate-600">Training eligibility assessment</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Training Needs Analysis Report</h4>
                                            <p className="text-xs text-slate-600">Comprehensive training needs assessment</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Training Plan Report</h4>
                                            <p className="text-xs text-slate-600">Strategic training planning</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Succession Plan Report</h4>
                                            <p className="text-xs text-slate-600">Leadership succession planning</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Talent Segmentation Report</h4>
                                            <p className="text-xs text-slate-600">Talent categorization and analysis</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Individual Development Profile</h4>
                                            <p className="text-xs text-slate-600">Personal development profile</p>
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
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Staff Card</h4>
                                            <p className="text-xs text-slate-600">Individual staff information card</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Succession Planning Table</h4>
                                            <p className="text-xs text-slate-600">Succession planning interface</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Framework Graphic</h4>
                                            <p className="text-xs text-slate-600">10:20:70 framework visualization</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Export Menu</h4>
                                            <p className="text-xs text-slate-600">Data export options</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">Lnd Ai Assistant Modal</h4>
                                            <p className="text-xs text-slate-600">AI-powered L&D assistance</p>
                                        </button>
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <h4 className="font-bold text-slate-900 text-sm">User Guide Modal</h4>
                                            <p className="text-xs text-slate-600">System user guide</p>
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
                                        <button className="w-full text-left p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
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
                        officers={demoOfficers}
                        baselineData={{
                            agencyName: demoData.agencyName,
                            kpis: demoData.kpis
                        }}
                        corporatePlanData={demoCorporatePlanData}
                        establishmentData={demoEstablishmentData}
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
                currentView={currentView}
                setView={setCurrentView}
                isOpen={true}
                onClose={() => {}}
            />

            <main className="flex-1 overflow-y-auto ml-0 md:ml-64 pt-20">
                {/* Top Header with Reporting Suite */}
                <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center fixed top-0 left-0 md:left-64 right-0 z-20">
                    <div>
                        <h1 className="text-xl font-black text-slate-900 uppercase">
                            {demoData.agencyName}
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
                    division={demoData.agencyName}
                    officers={demoOfficers}
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
        </div>
    );
};
