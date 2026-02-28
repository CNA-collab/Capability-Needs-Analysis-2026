import React from 'react';

const ProficiencyCard: React.FC<{ percentage: string; color: string; title: string; description: string; criteria: string[] }> = ({ 
    percentage, color, title, description, criteria 
}) => (
    <div className={`bg-white p-8 rounded-[24px] border-2 ${color} shadow-sm flex flex-col hover:shadow-md transition-all`}>
        <span className={`text-5xl font-black ${color.replace('border-', 'text-')} mb-4 opacity-60`}>{percentage}</span>
        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-4">{title}</h3>
        <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed">{description}</p>
        <ul className="space-y-3 mt-auto">
            {criteria.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-xs font-bold text-slate-500">
                    <div className={`w-1 h-1 mt-1.5 rounded-full flex-shrink-0 ${color.replace('border-', 'bg-')}`}></div> 
                    <span>{c}</span>
                </li>
            ))}
        </ul>
    </div>
);

export const CnaLndPlanning: React.FC = () => {
    return (
        <div className="space-y-12">
            <header className="border-b border-slate-100 pb-6">
                 <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Strategic L&D Formulation</h2>
                 <p className="text-sm text-slate-500 mt-1">Applying the 70:20:10 Blended Learning Framework.</p>
            </header>

            <p className="text-sm text-slate-600 leading-relaxed font-medium max-w-[800px]">
                An effective L&D plan uses a blended learning approach. The 70:20:10 model is a powerful framework for this, suggesting that learning is most effective when it comes from a mix of experience, social interaction, and formal education.
            </p>

            {/* CNA Diagnostic Proficiency Levels - Section 4.1.5 */}
            <section className="bg-slate-50/50 border border-slate-100 p-8 rounded-[24px]">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Section 4.1.5: CNA Diagnostic Proficiency Levels</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6">
                    According to the CNA Policy, the level of proficiency is rated on three categories identified through SWOT analysis consistent with SPA ratings:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ProficiencyCard 
                        percentage="70%"
                        color="border-red-500"
                        title="Knowledge (70%)"
                        description="For officers below 50% competency level with low motivation and capability. Subject to reskilling or redeployment."
                        criteria={[
                            'Aware, understand, and recall basics',
                            'Continuous low performance subject to management decisions',
                            'Considered for reskilling or redeployment',
                            'Targeted for foundational training'
                        ]}
                    />
                    <ProficiencyCard 
                        percentage="20%"
                        color="border-amber-500"
                        title="Competency (20%)"
                        description="For officers at 50-70% competency level with medium or low motivation. Prioritized for further training."
                        criteria={[
                            'Ability to apply new skills in familiar situations',
                            'Structured mentoring or targeted workshops',
                            'Medium or low motivation & capability',
                            'Priority for further training interventions'
                        ]}
                    />
                    <ProficiencyCard 
                        percentage="10%"
                        color="border-emerald-500"
                        title="Capacity (10%)"
                        description="For officers at 70-100% competency level with high motivation. Considered for career progression."
                        criteria={[
                            'Make decisions and use judgement',
                            'Integrate skills and knowledge in all contexts',
                            'High motivation & capability',
                            'Subject to ethical work standards for progression'
                        ]}
                    />
                </div>
            </section>

            {/* 70:20:10 Model Framework */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col hover:border-blue-500 transition-colors">
                    <span className="text-5xl font-black text-blue-100 mb-4">70%</span>
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-4">Experiential Learning</h3>
                    <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed">Learning through doing. This is the foundation of institutional development.</p>
                    <ul className="space-y-3 mt-auto">
                        {['Stretch assignments', 'On-the-job training', 'Job rotation', 'Project leadership'].map(i => (
                            <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                <div className="w-1 h-1 bg-blue-500 rounded-full"></div> {i}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col hover:border-emerald-500 transition-colors">
                    <span className="text-5xl font-black text-emerald-100 mb-4">20%</span>
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-4">Social Learning</h3>
                    <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed">Learning from others through interaction and observation.</p>
                    <ul className="space-y-3 mt-auto">
                        {['Mentoring programs', 'Peer-to-peer coaching', 'Communities of practice', 'Networks'].map(i => (
                            <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                <div className="w-1 h-1 bg-emerald-500 rounded-full"></div> {i}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col hover:border-indigo-500 transition-colors">
                    <span className="text-5xl font-black text-indigo-100 mb-4">10%</span>
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-4">Formal Study</h3>
                    <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed">Structured learning events and academic pursuits.</p>
                    <ul className="space-y-3 mt-auto">
                        {['SILAG Workshops', 'Tertiary Degrees', 'E-learning modules', 'Certifications'].map(i => (
                            <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                <div className="w-1 h-1 bg-indigo-500 rounded-full"></div> {i}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* CNA Assessment Integration */}
            <section className="bg-indigo-900 text-white p-8 rounded-[24px]">
                <h4 className="font-bold text-indigo-100 text-sm mb-4 uppercase tracking-widest">CNA Assessment Integration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                        <h5 className="font-black text-xs uppercase tracking-widest mb-3 text-indigo-200">From CNA Diagnostic to L&D</h5>
                        <p className="text-sm text-indigo-100 leading-relaxed">
                            The CNA assessment is a <strong>mandatory tool</strong> required during selection and recruitment to justify retention, redeployment, or recruitment decisions. Individual proficiency levels identified through the three-category SWOT analysis directly inform workforce planning priorities.
                        </p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                        <h5 className="font-black text-xs uppercase tracking-widest mb-3 text-indigo-200">Workforce Planning Link</h5>
                        <p className="text-sm text-indigo-100 leading-relaxed">
                            L&D needs are projected and prioritized through Workforce Planning interventions including Career Path Plans, Talent Management, Succession Plans, and Exit Plans. The 70:20:10 model informs all interventions.
                        </p>
                    </div>
                </div>
            </section>

            <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                 <h4 className="font-bold text-indigo-900 text-sm mb-2">Automated Planning Integration</h4>
                 <p className="text-xs text-indigo-800 leading-relaxed">This application&apos;s AI-powered reports, such as the &apos;Automated L&D Recommendations&apos;, automatically suggest 70:20:10 interventions for identified gaps based on CNA diagnostic proficiency levels, providing a strong starting point for your strategic L&D plan.</p>
            </div>

            {/* Section 2.2.ii Reference */}
            <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl">
                 <h4 className="font-bold text-blue-900 text-sm mb-2">Policy Alignment: Section 2.2.ii</h4>
                 <p className="text-xs text-blue-800 leading-relaxed">
                    This component aligns with <strong>Section 2.2.ii</strong> of the CNA Policy: <em>Learning & Development Approach (Model) 70:20:10</em>. 
                    The policy emphasizes that the 70:20:10 model is a proven framework emphasizing experiential learning (70%), social learning (20%), and formal education (10%) to ensure holistic skill development within the National Public Service.
                 </p>
            </div>

            {/* Section 4.1.5 Reference */}
            <div className="p-6 bg-slate-100 border border-slate-200 rounded-2xl">
                 <h4 className="font-bold text-slate-800 text-sm mb-2">Policy Alignment: Section 4.1.5 - Learning & Development Approach (Model) 10:20:70</h4>
                 <p className="text-xs text-slate-600 leading-relaxed">
                    Per <strong>Section 4.1.5</strong> of the CNA Policy, capability is determined by aligning the organization&apos;s vision and objectives with its existing capacities. CNAs identify relevant capability gaps through a systematic diagnostic approach using CNA questionnaires. The proficiency levels (Capacity 10%, Competency 20%, Knowledge 70%) are identified through SWOT analysis consistent with SPA ratings.
                 </p>
            </div>

            {/* Section 4.1.6 Reference */}
            <div className="p-6 bg-slate-100 border border-slate-200 rounded-2xl">
                 <h4 className="font-bold text-slate-800 text-sm mb-2">Policy Alignment: Section 4.1.6 - Workforce Planning</h4>
                 <p className="text-xs text-slate-600 leading-relaxed">
                    Per <strong>Section 4.1.6</strong>, individual proficiency levels identified under the three categories in the CNA diagnostic process are prioritized under the Learning & Development Model 10:20:70 for effective workforce planning. As much as possible, workplace-based L&D strategies such as job rotation, secondment, and job shadowing are explored to address identified needs.
                 </p>
            </div>
        </div>
    );
};
