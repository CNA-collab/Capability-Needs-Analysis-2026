import React, { useState } from 'react';

// Interface for TypeScript props
interface LoginPageProps {
    onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Authorization Logic
        if (username.trim() === "DPM_OP_0001" && password.trim() === "CNA-Dev-2026") {
            onLoginSuccess(); 
        } else {
            alert("Authorization Failed: Please check your credentials.");
        }
    };

    return (
        /* UNIVERSAL FONT STACK: Inter, System-UI, Sans-Serif */
        <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0f172a] overflow-hidden font-sans selection:bg-red-500/30" 
             style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            
            {/* 90% VISIBILITY WATERMARK - Refined for Dark Mode */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img 
                    src="/Logo/PNG Crest.png" 
                    className="w-[85%] max-w-[900px] h-auto opacity-90 brightness-50 contrast-125 mix-blend-screen transform scale-100" 
                    alt="Background Watermark" 
                />
            </div>

            {/* LOGIN CARD */}
            <div className="relative z-10 w-full max-w-md p-10 bg-white shadow-[0_35px_80px_rgba(0,0,0,0.6)] rounded-[2rem] border border-white/10">
                <div className="text-center mb-10">
                    <img 
                        src="/Logo/PNG Crest.png" 
                        className="w-24 h-24 mx-auto mb-6 drop-shadow-2xl" 
                        alt="Main DPM Crest" 
                    />
                    {/* TIGHTER TRACKING FOR MODERN LOOK */}
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
                        CNA System
                    </h2>
                    <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-[0.4em]">
                        Dept. of Personnel Management
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-red-600 focus:bg-white transition-all outline-none text-slate-900 font-medium placeholder:text-slate-300"
                            placeholder="DPM_OP_0001"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-red-600 focus:bg-white transition-all outline-none text-slate-900 font-medium placeholder:text-slate-300"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full py-4 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold tracking-widest transition-all shadow-xl active:scale-[0.98] uppercase text-sm mt-4"
                    >
                        Authorize Access
                    </button>
                </form>

                <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Secure Gateway
                    </span>
                    <span>v2.0.38-Alpha</span>
                </div>
            </div>
        </div>
    );
};