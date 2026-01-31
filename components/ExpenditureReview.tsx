import React, { useState, useMemo } from 'react';
import { OfficerRecord } from '../types';
import {
    BuildingOfficeIcon,
    ChartBarSquareIcon,
    DocumentIcon,
    AcademicCapIcon
} from './icons';

interface ExpenditureReviewProps {
    officers: OfficerRecord[];
    baselineData: {
        agencyName: string;
        kpis: {
            establishmentGap: number;
            baselineScore: number;
            criticalSkillGaps: number;
            trainingCompletion: number;
        };
    };
}

export const ExpenditureReview: React.FC<ExpenditureReviewProps> = ({ officers, baselineData }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Force immediate rendering - no loading states
    const expenditureData = useMemo(() => {
        // Calculate expenditure projections based on workforce data
        const totalWorkforce = officers.length;
        const averageSalary = 45000; // Base salary assumption
        const trainingBudgetPerPerson = 2500; // Annual training budget per person
        const developmentBudgetPerPerson = 1500; // Development budget per person

        const totalSalaryExpenditure = totalWorkforce * averageSalary;
        const totalTrainingExpenditure = totalWorkforce * trainingBudgetPerPerson;
        const totalDevelopmentExpenditure = totalWorkforce * developmentBudgetPerPerson;
        const totalExpenditure = totalSalaryExpenditure + totalTrainingExpenditure + totalDevelopmentExpenditure;

        // Gap-based adjustments
        const capabilityGapMultiplier = baselineData.kpis.establishmentGap / 100;
        const adjustedTrainingBudget = totalTrainingExpenditure * (1 + capabilityGapMultiplier);

        return {
            totalWorkforce,
            totalSalaryExpenditure,
            totalTrainingExpenditure,
            totalDevelopmentExpenditure,
            totalExpenditure,
            adjustedTrainingBudget,
            capabilityGapMultiplier,
            categories: [
                { name: 'Base Salaries', amount: totalSalaryExpenditure, percentage: 85 },
                { name: 'Training Programs', amount: totalTrainingExpenditure, percentage: 10 },
                { name: 'Development Initiatives', amount: totalDevelopmentExpenditure, percentage: 5 }
            ]
        };
    }, [officers, baselineData]);

    const filteredData = useMemo(() => {
        if (selectedCategory === 'all') return expenditureData.categories;
        return expenditureData.categories.filter(cat => cat.name.toLowerCase().includes(selectedCategory.toLowerCase()));
    }, [expenditureData.categories, selectedCategory]);

    return (
        <div className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden">
            <header className="p-8 bg-white/80 backdrop-blur-md border-b flex justify-between items-center sticky top-0 z-20">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase flex items-center gap-3">
                        <BuildingOfficeIcon className="w-7 h-7 text-slate-600" />
                        Department of Personnel Management
                    </h1>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                        Expenditure Review Dashboard
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-xl text-sm font-bold uppercase"
                    >
                        <option value="all">All Categories</option>
                        <option value="salaries">Salaries</option>
                        <option value="training">Training</option>
                        <option value="development">Development</option>
                    </select>
                </div>
            </header>

            <main className="p-10 space-y-8 max-w-7xl mx-auto w-full">
                {/* Key Expenditure Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                        <p className="text-xs font-black text-slate-500 uppercase mb-2">Total Workforce</p>
                        <p className="text-3xl font-black text-slate-900">{expenditureData.totalWorkforce}</p>
                        <p className="text-xs text-slate-400 mt-1">Active Officers</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                        <p className="text-xs font-black text-slate-500 uppercase mb-2">Annual Expenditure</p>
                        <p className="text-3xl font-black text-blue-600">${expenditureData.totalExpenditure.toLocaleString()}</p>
                        <p className="text-xs text-slate-400 mt-1">Total Budget</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                        <p className="text-xs font-black text-slate-500 uppercase mb-2">Training Budget</p>
                        <p className="text-3xl font-black text-emerald-600">${expenditureData.adjustedTrainingBudget.toLocaleString()}</p>
                        <p className="text-xs text-slate-400 mt-1">Gap-Adjusted</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                        <p className="text-xs font-black text-slate-500 uppercase mb-2">Capability Gap Impact</p>
                        <p className="text-3xl font-black text-amber-600">{(expenditureData.capabilityGapMultiplier * 100).toFixed(1)}%</p>
                        <p className="text-xs text-slate-400 mt-1">Budget Multiplier</p>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Expenditure Breakdown */}
                    <div className="col-span-8 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border shadow-sm">
                            <h3 className="text-lg font-black text-slate-900 uppercase mb-6">Expenditure Breakdown</h3>
                            <div className="space-y-4">
                                {filteredData.map((category, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                                                {category.name.includes('Salaries') && <BuildingOfficeIcon className="w-6 h-6 text-slate-600" />}
                                                {category.name.includes('Training') && <DocumentIcon className="w-6 h-6 text-slate-600" />}
                                                {category.name.includes('Development') && <AcademicCapIcon className="w-6 h-6 text-slate-600" />}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900">{category.name}</p>
                                                <p className="text-sm text-slate-500">{category.percentage}% of total budget</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-slate-900">${category.amount.toLocaleString()}</p>
                                            <div className="w-32 bg-slate-200 rounded-full h-2 mt-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${category.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-slate-900 p-6 rounded-2xl text-white">
                            <div className="flex items-center gap-2 mb-4">
                                <ChartBarSquareIcon className="w-5 h-5 text-emerald-400" />
                                <span className="font-black text-xs uppercase">Budget Optimization Recommendations</span>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 bg-slate-800/50 rounded-xl">
                                    <p className="text-sm text-slate-300">
                                        <strong className="text-white">Capability Gap Response:</strong> Allocate additional ${(expenditureData.adjustedTrainingBudget - expenditureData.totalTrainingExpenditure).toLocaleString()} for training programs to address identified skill gaps.
                                    </p>
                                </div>
                                <div className="p-3 bg-slate-800/50 rounded-xl">
                                    <p className="text-sm text-slate-300">
                                        <strong className="text-white">Efficiency Measure:</strong> Implement targeted development programs to reduce long-term recruitment costs by optimizing internal capability building.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Panel */}
                    <div className="col-span-4 bg-white p-6 rounded-3xl border shadow-sm h-fit">
                        <h4 className="text-xs font-black text-slate-500 uppercase mb-4">Budget Summary</h4>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <p className="text-xs font-black text-blue-600 uppercase">Primary Expenditure</p>
                                <p className="text-lg font-black text-blue-900">Base Salaries</p>
                                <p className="text-sm text-blue-700">85% of total budget</p>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-xl">
                                <p className="text-xs font-black text-emerald-600 uppercase">Growth Investment</p>
                                <p className="text-lg font-black text-emerald-900">Training & Development</p>
                                <p className="text-sm text-emerald-700">15% of total budget</p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-xl">
                                <p className="text-xs font-black text-amber-600 uppercase">Gap Response</p>
                                <p className="text-lg font-black text-amber-900">Adjusted Training Budget</p>
                                <p className="text-sm text-amber-700">Gap-driven allocation</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
