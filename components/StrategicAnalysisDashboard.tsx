import React, { useMemo } from 'react';
import { OfficerRecord, EstablishmentRecord, StructuredCorporatePlan } from '../types';
import { XIcon, ChartBarSquareIcon, SparklesIcon, UsersIcon, AcademicCapIcon } from './icons';
import { ChartComponent } from './charts';

interface DashboardProps {
    cnaData: OfficerRecord[];
    establishmentData: EstablishmentRecord[];
    corporatePlanData?: StructuredCorporatePlan;
    agencyName: string;
    baselineData?: {
        kpis: {
            establishmentGap: number;
            baselineScore: number;
            criticalSkillGaps: number;
            trainingCompletion: number;
        };
    };
    onClose: () => void;
}

const StatCard: React.FC<{ title: string; value: string | number; description?: string; icon?: React.ReactNode; color?: string }> = ({ title, value, description, icon, color = 'blue' }) => {
    const colorClasses: Record<string, string> = {
        blue: 'from-blue-500 to-blue-600 bg-blue-50',
        emerald: 'from-emerald-500 to-emerald-600 bg-emerald-50',
        amber: 'from-amber-500 to-amber-600 bg-amber-50',
        purple: 'from-purple-500 to-purple-600 bg-purple-50',
    };
    
    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-card border border-slate-100 overflow-hidden hover:shadow-card-hover transition-shadow duration-300">
            <div className={`h-1.5 bg-gradient-to-r ${colorClasses[color] || colorClasses.blue}`}></div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div className={`p-2.5 rounded-lg ${colorClasses[color]?.split(' ')[2] || 'bg-blue-50'}`}>
                        <div className={`opacity-80 ${colorClasses[color]?.split(' ')[2]?.replace('bg-', 'text-') || 'text-blue-500'}`}>{icon}</div>
                    </div>
                </div>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">{title}</h3>
                {description && <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-2">{description}</p>}
            </div>
        </div>
    );
};

export const StrategicAnalysisDashboard: React.FC<DashboardProps> = ({ cnaData, agencyName, baselineData, onClose }) => {

    const analysis = useMemo(() => {
        if (!cnaData || cnaData.length === 0) return null;

        const totalStaff = cnaData.length;
        
        // FIX: Replaced global parseInt with Number.parseInt to satisfy SonarQube S7773
        const eliteMentors = cnaData.filter(o => Number.parseInt(o.spaRating || '0', 10) >= 4).length;

        let maleCount = 0;
        let femaleCount = 0;
        cnaData.forEach(officer => {
            if (officer.gender === 'Male') maleCount++;
            else if (officer.gender === 'Female') femaleCount++;
        });

        const gradingGroupCounts = cnaData.reduce((acc, o) => {
            const group = o.gradingGroup || 'Other';
            acc[group] = (acc[group] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const avgExperience = cnaData.reduce((sum, o) => sum + (o.yearsOfExperience || 0), 0) / (cnaData.filter(o => o.yearsOfExperience).length || 1);

        return {
            totalStaff,
            femaleCount,
            maleCount,
            eliteMentors,
            gradingGroupCounts,
            avgExperience,
        };
    }, [cnaData]);

    if (!analysis) return null;

    const { gradingGroupCounts, avgExperience, totalStaff, eliteMentors } = analysis;

    const learningModelChartData = {
        labels: ['70% Experiential (Internal)', '20% Social (Mentoring)', '10% Formal (Budget)'],
        datasets: [{
            label: 'CNA Learning Model Allocation',
            data: [70, 20, 10],
            backgroundColor: ['#10B981', '#3B82F6', '#F59E0B'],
            hoverOffset: 4
        }]
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex justify-center items-start p-4 pt-8 overflow-y-auto">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl shadow-2xl max-w-6xl w-full border border-white/20">
                <header className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <ChartBarSquareIcon className="w-8 h-8 text-blue-600" />
                            Strategic Intelligence Dashboard
                        </h1>
                        <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">CNA Analysis: {agencyName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:scale-110 transition-transform">
                        <XIcon className="w-5 h-5 text-slate-600" />
                    </button>
                </header>

                <main className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <StatCard title="Total Workforce" value={totalStaff} description="Active Participants" icon={<UsersIcon className="w-8 h-8" />} />
                        <StatCard title="Internal Mentors" value={eliteMentors} description="Qualified for 20% Social" icon={<SparklesIcon className="w-8 h-8" />} />
                        <StatCard title="Avg Experience" value={`${avgExperience.toFixed(1)} Yrs`} description="Internal Knowledge" icon={<AcademicCapIcon className="w-8 h-8" />} />
                        <StatCard title="Capability Gap Index" value={`${((baselineData?.kpis?.establishmentGap || 18) / 100 * 10).toFixed(1)}/10`} description="ISO 30414 Compliance" icon={<ChartBarSquareIcon className="w-8 h-8" />} />
                        <StatCard title="Succession Bench Strength" value={`${((baselineData?.kpis?.criticalSkillGaps || 12) / totalStaff * 100).toFixed(1)}%`} description="Readiness Levels" icon={<AcademicCapIcon className="w-8 h-8" />} />
                        <StatCard title="Skill Diversification" value={`${(Object.keys(gradingGroupCounts).length / totalStaff * 100).toFixed(1)}%`} description="Competency Distribution" icon={<SparklesIcon className="w-8 h-8" />} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 lg:col-span-2">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Workforce Grade Distribution</h2>
                            <div className="h-64">
                                <ChartComponent 
                                    type="bar" 
                                    data={{
                                        labels: Object.keys(gradingGroupCounts),
                                        datasets: [{ 
                                            label: 'Officers per Group', 
                                            data: Object.values(gradingGroupCounts), 
                                            backgroundColor: '#3B82F6',
                                            borderRadius: 8
                                        }]
                                    }}
                                    options={{ maintainAspectRatio: false }} 
                                />
                            </div>
                        </div>

                        <div className="bg-[#0F172A] p-6 rounded-2xl shadow-xl text-white">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-6">10:20:70 Learning Allocation</h2>
                            <div className="h-56 relative">
                                <ChartComponent 
                                    type="doughnut" 
                                    data={learningModelChartData} 
                                    options={{ 
                                        maintainAspectRatio: false,
                                        plugins: { 
                                            legend: { 
                                                position: 'bottom', 
                                                labels: { color: '#cbd5e1', font: { size: 9 } } 
                                            } 
                                        }
                                    }} 
                                />
                            </div>
                            <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                                <p className="text-[7pt] text-slate-400 leading-relaxed italic">
                                    &apos;Dashboard data indicates high internal mentoring capacity via **{eliteMentors} identified mentors**.&apos;
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
