import React from 'react';

 
 
export const FrameworkGraphic: React.FC<{ highlight?: 'formal' | 'social' | 'experiential' }> = ({ highlight }) => (
    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mt-4 transition-all">
        {   }
        <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">
            Targeted L&D Architecture (10:20:70)
        </h5>
        {   }
        <div className="flex gap-1.5 h-12 w-full rounded-lg overflow-hidden shadow-sm">
            {/* 10% Formal */}
            <div className={`w-[10%] flex items-center justify-center text-[10px] font-bold text-white transition-opacity ${highlight === 'formal' ? 'bg-rose-600 ring-2 ring-rose-300' : 'bg-rose-400 opacity-60'}`}>
                10
            </div>
            {/* 20% Mentoring/Social */}
            <div className={`w-[20%] flex items-center justify-center text-[10px] font-bold text-white transition-opacity ${highlight === 'social' ? 'bg-amber-600 ring-2 ring-amber-300' : 'bg-amber-400 opacity-60'}`}>
                20
            </div>
            {/* 70% On-the-job */}
            <div className={`w-[70%] flex items-center justify-center text-[10px] font-bold text-white transition-opacity ${highlight === 'experiential' ? 'bg-emerald-600 ring-2 ring-emerald-300' : 'bg-emerald-400 opacity-60'}`}>
                70
            </div>
        {   }
        </div>
        {   }
        <div className="flex justify-between mt-2 px-1">
            <span className={`text-[8px] font-black uppercase ${highlight === 'formal' ? 'text-rose-700' : 'text-slate-400'}`}>Formal Courses</span>
            {   }
            <span className={`text-[8px] font-black uppercase ${highlight === 'social' ? 'text-amber-700' : 'text-slate-400'}`}>Coaching/Mentoring</span>
            {   }
            <span className={`text-[8px] font-black uppercase ${highlight === 'experiential' ? 'text-emerald-700' : 'text-slate-400'}`}>Workplace Experience</span>
        </div>
    </div>
);
