import React from 'react';
import { ChartBarSquareIcon, SparklesIcon, DocumentChartBarIcon, ScaleIcon, UsersIcon, PresentationChartLineIcon } from '../icons';

const BenefitCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ElementType }> = ({ title, children, icon: Icon }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
            <Icon className="w-5 h-5 text-indigo-600" />
        </div>
        <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm mb-2">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {children}
        </p>
    </div>
);

const CoreTermCard: React.FC<{ number: string; title: string; description: string; detailedDescription: string }> = ({ number, title, description, detailedDescription }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <span className="font-black text-emerald-600 text-sm">{number}</span>
            </div>
            <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{title}</h4>
                <p className="text-xs text-slate-500 mb-3 font-medium">{description}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{detailedDescription}</p>
            </div>
        </div>
    </div>
);

export const CnaOverview: React.FC = () => {
    return (
        <div className="space-y-12 max-w-[1200px]">
            {/* Definition Callout */}
            <section className="bg-blue-50/50 border border-blue-100 p-8 rounded-[24px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full -mr-16 -mt-16"></div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                    What is a Capability Needs Analysis (CNA)?
                </h2>
                <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-700 leading-relaxed font-medium">
                        A Capability Needs Analysis (CNA) is a systematic process to determine the gap between an organization&apos;s current workforce capabilities and the capabilities it needs to achieve its strategic objectives.
                    </p>
                    <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                        It serves as a critical diagnostic tool for effective Human Resource Development (HRD) and Learning & Development (L&D) planning. Instead of guessing what training is needed, a CNA provides evidence-based insights into specific skill and knowledge gaps at individual, team, and organizational levels.
                    </p>
                </div>
            </section>

            {/* Section 2.1: Determining Core Terms in CNA */}
            <section>
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Section 2.1: Determining Core Terms in CNA</h2>
                <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-[24px]">
                    <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6">
                        To effectively implement Capability Needs Analysis (CNA), understanding its foundational terms is paramount. These core definitions establish a shared framework, guiding planning and execution:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <CoreTermCard 
                            number="i" 
                            title="Capacity Building" 
                            description="Strategies that enhance performance across levels to improve overall effectiveness"
                            detailedDescription="This refers to the strategic enhancement of individual, team, and organizational performance. It focuses on equipping stakeholders at all levels with the tools, knowledge, and processes to improve overall effectiveness and meet evolving challenges head-on."
                        />
                        <CoreTermCard 
                            number="ii" 
                            title="Capability" 
                            description="The ability to manage unexpected context effectively, ensuring adaptability"
                            detailedDescription="Capability is the organization's and individual's ability to respond effectively to unforeseen or changing circumstances. It underscores adaptability and resilience, critical traits for navigating today's dynamic professional landscape."
                        />
                        <CoreTermCard 
                            number="iii" 
                            title="Competency" 
                            description="Minimum skills required for job performance, forming the basis for training"
                            detailedDescription="Competency represents the essential skills, knowledge, and behaviors required to perform specific job roles successfully. This concept forms the foundation for designing targeted training programs, ensuring that employees meet or exceed baseline performance standards."
                        />
                    </div>
                </div>
            </section>

            {/* Purpose & Benefits Grid */}
            <section>
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Strategic Purpose & Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <BenefitCard title="Strategic Alignment" icon={ChartBarSquareIcon}>
                        Ensures training investments directly support the organization&apos;s corporate plan and national MTDP IV priorities.
                    </BenefitCard>
                    <BenefitCard title="Targeted Investment" icon={SparklesIcon}>
                        Optimizes the L&D budget by focusing on the most critical skill gaps, maximizing return on institutional investment.
                    </BenefitCard>
                    <BenefitCard title="Improved Performance" icon={PresentationChartLineIcon}>
                        Addresses specific weaknesses that hinder individual and organizational performance, leading to improved service delivery.
                    </BenefitCard>
                    <BenefitCard title="Employee Engagement" icon={UsersIcon}>
                        Demonstrates a commitment to staff development, which improves morale, motivation, and professional retention.
                    </BenefitCard>
                    <BenefitCard title="Succession Planning" icon={ScaleIcon}>
                        Identifies skill gaps in potential future leaders, allowing for targeted development to build a strong talent pipeline.
                    </BenefitCard>
                    <BenefitCard title="Data-Driven Decisions" icon={DocumentChartBarIcon}>
                        Moves HR planning from anecdotal evidence to a robust, data-backed strategy for national capacity building.
                    </BenefitCard>
                </div>
            </section>
        </div>
    );
};
