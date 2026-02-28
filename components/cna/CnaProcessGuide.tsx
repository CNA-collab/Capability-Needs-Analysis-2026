import React from 'react';

const Step: React.FC<{ number: number; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="flex items-start gap-6 mb-8 group">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
            {number}
        </div>
        <div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{title}</h3>
            <div className="text-sm text-slate-600 leading-relaxed font-medium">{children}</div>
        </div>
    </div>
);

const FocusAreaCard: React.FC<{ number: string; title: string; description: string; detailedDescription: string }> = ({ number, title, description, detailedDescription }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <span className="font-black text-blue-600 text-sm">{number}</span>
            </div>
            <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{title}</h4>
                <p className="text-xs text-slate-500 mb-3 font-medium">{description}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{detailedDescription}</p>
            </div>
        </div>
    </div>
);

export const CnaProcessGuide: React.FC = () => {
    return (
        <div className="max-w-[800px] mx-auto space-y-12">
            <header className="border-b border-slate-100 pb-6">
                 <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Standard Operating Procedure</h2>
                 <p className="text-sm text-slate-500 mt-1">Following the Department of Personnel Management guidelines.</p>
            </header>

            {/* Section 2.2: Scope of the CNA Policy */}
            <section className="bg-slate-50/50 border border-slate-100 p-8 rounded-[24px]">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Section 2.2: Scope of the CNA Policy</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6">
                    The CNA policy is strategically designed to address key aspects of workforce planning and development within the National Public Service. It centers on fostering a culture of continuous learning and adaptive skill-building through four pivotal focus areas:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FocusAreaCard 
                        number="i" 
                        title="Capability Needs Analysis (CNA)" 
                        description="Systematic process of identifying gaps between current and desired capabilities"
                        detailedDescription="This involves a systematic process of identifying gaps between current and desired capabilities, enabling data-driven decisions for workforce development."
                    />
                    <FocusAreaCard 
                        number="ii" 
                        title="Learning & Development Approach (Model) 70:20:10" 
                        description="Proven framework for holistic skill development"
                        detailedDescription="The policy embraces the 70:20:10 model, a proven framework emphasizing experiential learning (70%), social learning (20%), and formal education (10%) to ensure holistic skill development."
                    />
                    <FocusAreaCard 
                        number="iii" 
                        title="Learning & Development Plan" 
                        description="Comprehensive roadmap for addressing capability gaps"
                        detailedDescription="This serves as a comprehensive roadmap for addressing the identified capability gaps. It aligns workforce development initiatives with organizational goals, ensuring that training investments deliver measurable outcomes."
                    />
                    <FocusAreaCard 
                        number="iv" 
                        title="Administration of the L&D Approach" 
                        description="Governance mechanisms for monitoring and evaluating L&D strategies"
                        detailedDescription="Effective implementation of the learning and development approach requires robust governance. The policy outlines mechanisms for monitoring, evaluating, and refining L&D strategies to maximize their impact."
                    />
                </div>
                <p className="text-xs text-slate-500 mt-6 leading-relaxed">
                    By establishing these core definitions and scope, the CNA policy lays a solid foundation for workforce transformation, aligning individual growth with institutional excellence.
                </p>
            </section>

            <div className="space-y-4">
                <Step number={1} title="Define Strategic Objectives">
                    <p>Start with the end in mind. Review your organization&apos;s Corporate Plan, divisional work plans, and strategic goals. What capabilities are essential to achieve these goals in the next 1-3 years?</p>
                </Step>
                <Step number={2} title="Identify Required Capabilities">
                    <p>For each objective, list the specific knowledge, skills, and behaviors required from your workforce. This can be done through workshops with managers and subject matter experts.</p>
                </Step>
                <Step number={3} title="Assess Current Capabilities">
                    <p>This is where the CNA survey comes in. Use a structured questionnaire to allow staff to self-assess their current proficiency against the required capabilities. This can be supplemented with manager assessments and performance data (e.g., SPA ratings).</p>
                </Step>
                <Step number={4} title="Analyze the Gaps">
                    <p>Compare the &apos;required&apos; capability levels with the &apos;current&apos; levels to identify gaps. The formula is: <strong>Gap = Required Level - Current Level</strong>. Analyze this data to find trends: What are the most common gaps? Are there specific gaps in certain divisions or job levels?</p>
                </Step>
                <Step number={5} title="Prioritize Needs & Develop Solutions">
                    <p>Prioritize the identified gaps based on their impact on strategic goals. For each priority gap, develop a learning solution using the 70:20:10 model (on-the-job, social, formal learning). This forms the basis of your L&D plan.</p>
                </Step>
                <Step number={6} title="Implement & Evaluate">
                    <p>Roll out the training plan. It is crucial to evaluate the effectiveness of the training by reassessing capabilities after the intervention to measure improvement and calculate return on investment.</p>
                </Step>
            </div>
        </div>
    );
};
