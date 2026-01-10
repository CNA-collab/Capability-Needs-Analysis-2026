import React, { useState } from 'react';

export const LoginPage: React.FC = () => {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-white overflow-hidden font-['Inter']">
            
            {/* 1. HIGH-VISIBILITY SECURITY WATERMARK GRID */}
            <div className="absolute inset-0 grid grid-cols-6 md:grid-cols-10 grid-rows-8 gap-4 p-4 pointer-events-none">
                {Array.from({ length: 80 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="flex items-center justify-center animate-pop-in"
                        style={{ 
                            animationDelay: `${i * 0.03}s`,
                            opacity: 0 // Starts at 0, animates to 0.70
                        }}
                    >
                        <img 
                            src="/Logo/PNG Crest.png" 
                            className="w-14 h-14 grayscale opacity-[0.70]" 
                            alt="PNG Crest Watermark" 
                        />
                    </div>
                ))}
            </div>

            {/* 2. LOGIN CARD - Increased contrast to sit above bold watermarks */}
            <div className="relative z-10 w-full max-w-md p-8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl border border-slate-200">
                <div className="text-center mb-10">
                    <img src="/Logo/PNG Crest.png" className="w-20 h-20 mx-auto mb-4" alt="Crest" />
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                        CNA System 2026
                    </h2>
                    <p className="text-slate-600 text-sm mt-2 font-bold italic">
                        Independent State of Papua New Guinea 
                    </p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1 text-shadow-sm">Official Email</label>
                        <input 
                            type="email" 
                            className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-slate-900 transition-all outline-none text-slate-900 font-medium"
                            placeholder="name@dpm.gov.pg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-slate-900 transition-all outline-none text-slate-900 font-medium"
                            placeholder="••••••••"
                        />
                    </div>
                    <button className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-black tracking-widest transition-all shadow-xl active:scale-[0.98]">
                        AUTHORIZE ACCESS
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <span>Secure Matrix</span>
                    <span>Validated 2026 [cite: 12]</span>
                </div>
            </div>

            {/* 3. CUSTOM KEYFRAMES FOR 70% OPACITY */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.5); }
                    to { opacity: 0.70; transform: scale(1); }
                }
                .animate-pop-in {
                    animation: popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
            `}} />
        </div>
    );
};