import React, { useState, useMemo } from 'react';
import { View } from '../types';
import { Sidebar } from './Sidebar';
import { ReportingSuiteModal } from './ReportingSuiteModal';
import { StrategicAnalysisDashboard } from './StrategicAnalysisDashboard';
import { SurveyInsights } from './SurveyInsights';


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
    const [currentView, setCurrentView] = useState<View>('cna');
    const [showReportingSuite, setShowReportingSuite] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);

    // Demo data for organisational overview
    const demoData = useMemo(() => ({
        agencyName: "Department of National Planning & Monitoring",
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

    // Demo officers data (simplified for demo purposes)
    const demoOfficers = useMemo(() => [
        {
            id: '1',
            name: 'John Smith',
            position: 'Senior Planning Officer',
            positionNumber: 'NP-001',
            dateOfBirth: '1979-05-15',
            commencementDate: '2009-01-01',
            grade: 'Grade 12',
            division: 'Policy & Planning',
            performanceRating: 'Exceeds Expectations',
            capabilityGaps: ['Strategic Planning', 'Digital Transformation'],
            lifecycleStage: 'Peak Performer',
            urgency: 'High',
            jobQualification: 'Masters Degree',
            technicalCapabilityGaps: ['Strategic Planning'],
            yearsOfExperience: 15,
            currentSalary: 85000,
            targetSalary: 95000,
            trainingNeeds: ['Digital Transformation'],
            developmentAreas: ['Leadership'],
            successionReadiness: 'Ready Now',
            retentionRisk: 'Low',
            engagementScore: 8.5,
            gradingGroup: 'Senior Management',
            gender: 'Male',
            spaRating: 'Outstanding',
            age: 45,
            email: 'john.smith@gov.na',
            performanceRatingLevel: 'Exceeds Expectations',
            capabilityRatings: []
        },
        {
            id: '2',
            name: 'Mary Johnson',
            position: 'Monitoring & Evaluation Specialist',
            positionNumber: 'NP-002',
            dateOfBirth: '1989-03-22',
            commencementDate: '2016-07-01',
            grade: 'Grade 11',
            division: 'M&E Division',
            performanceRating: 'Meets Expectations',
            capabilityGaps: ['Data Analytics', 'Impact Assessment'],
            lifecycleStage: 'High Potential',
            urgency: 'Medium',
            jobQualification: 'Bachelors Degree',
            technicalCapabilityGaps: ['Data Analytics'],
            yearsOfExperience: 8,
            currentSalary: 65000,
            targetSalary: 75000,
            trainingNeeds: ['Impact Assessment'],
            developmentAreas: ['Technical Skills'],
            successionReadiness: '1-2 Years',
            retentionRisk: 'Medium',
            engagementScore: 7.2,
            gradingGroup: 'Professional',
            gender: 'Female',
            spaRating: 'Good',
            age: 35,
            email: 'mary.johnson@gov.na',
            performanceRatingLevel: 'Meets Expectations',
            capabilityRatings: []
        },
        {
            id: '3',
            name: 'David Wilson',
            position: 'Project Manager',
            positionNumber: 'NP-003',
            dateOfBirth: '1996-11-08',
            commencementDate: '2021-09-01',
            grade: 'Grade 10',
            division: 'Program Implementation',
            performanceRating: 'Developing',
            capabilityGaps: ['Project Management', 'Risk Assessment'],
            lifecycleStage: 'Early Career',
            urgency: 'High',
            jobQualification: 'Bachelors Degree',
            technicalCapabilityGaps: ['Project Management'],
            yearsOfExperience: 3,
            currentSalary: 45000,
            targetSalary: 55000,
            trainingNeeds: ['Risk Assessment'],
            developmentAreas: ['Project Management'],
            successionReadiness: '3-5 Years',
            retentionRisk: 'High',
            engagementScore: 6.8,
            gradingGroup: 'Professional',
            gender: 'Male',
            spaRating: 'Developing',
            age: 28,
            email: 'david.wilson@gov.na',
            performanceRatingLevel: 'Developing',
            capabilityRatings: []
        }
    ], []);

    const getLifecycleStageClass = (lifecycleStage: string) => {
        switch (lifecycleStage) {
            case 'Peak Performer':
                return 'bg-emerald-100 text-emerald-800';
            case 'High Potential':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-amber-100 text-amber-800';
        }
    };

    const getPerformanceRatingClass = (performanceRating: string) => {
        if (performanceRating === 'Exceeds Expectations') {
            return 'text-emerald-600';
        } else if (performanceRating === 'Meets Expectations') {
            return 'text-blue-600';
        } else {
            return 'text-amber-600';
        }
    };

    const renderView = () => {
        switch (currentView) {
            case 'cna':
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
                            <p className="text-slate-600">Quick view of officer results after analyzing CNA data, establishment register, and corporate plan</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {demoOfficers.map(officer => {
                                const lifecycleStageClass = getLifecycleStageClass(officer.lifecycleStage);

                                return (
                                    <div key={officer.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900">{officer.name}</h3>
                                                <p className="text-sm text-slate-600">{officer.position}</p>
                                            </div>
                                            <div className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${lifecycleStageClass}`}>
                                                {officer.lifecycleStage}
                                            </div>
                                        </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-slate-500">Grade:</span>
                                            <span className="text-sm font-black text-slate-900">{officer.grade}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-slate-500">Division:</span>
                                            <span className="text-sm font-black text-slate-900">{officer.division}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-slate-500">Performance:</span>
                                            <span className={`text-sm font-black ${getPerformanceRatingClass(officer.performanceRating)}`}>
                                                {officer.performanceRating}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm font-bold text-slate-500 mb-2">Capability Gaps:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {officer.capabilityGaps.map((gap) => (
                                                <span key={gap} className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                                                    {gap}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-xl text-xs font-black uppercase hover:bg-blue-700 transition-colors">
                                            View Details
                                        </button>
                                        <button className="flex-1 bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs font-black uppercase hover:bg-emerald-700 transition-colors">
                                            Generate Plan
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
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
                    />
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

            <main className="flex-1 overflow-y-auto">
                {/* Top Header with Reporting Suite */}
                <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-20">
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
