import React, { useState } from 'react';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim() === "DPM_OP_0001" && password.trim() === "CNA-Dev-2026") {
            onLoginSuccess(); 
        } else {
            alert("Authorization Failed: Please check your credentials.");
        }
    };

    return (
        /* LIGHT SLATE BACKGROUND */
        <div className="relative min-h-screen w-full flex items-center justify-center bg-[#F1F5F9] overflow-hidden font-sans" 
             style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            
            {/* DUAL WATERMARK LAYER - Fixed Filename & Positioning */}
            <div className="absolute inset-0 flex items-center justify-between px-4 md:px-20 pointer-events-none z-0">
                
                {/* LEFT: GOLDEN JUBILEE LOGO */}
                <div className="w-1/2 flex justify-start items-center">
                    <img 
                        src="/Logo/Golden_Jubilee.png" 
                        className="w-full max-w-[400px] md:max-w-[500px] h-auto opacity-90 brightness-105 contrast-110 mix-blend-multiply" 
                        alt="Golden Jubilee" 
                    />
                </div>

                {/* RIGHT: PNG NATIONAL CREST */}
                <div className="w-1/2 flex justify-end items-center">
                    <img 
                        src="/Logo/PNG Crest.png" 
                        className="w-full max-w-[400px] md:max-w-[500px] h-auto opacity-90 brightness-105 contrast-110 mix-blend-multiply" 
                        alt="PNG Crest" 
                    />
                </div>
            </div>

            {/* LOGIN CARD - Elevated with z-10 */}
            <div className="relative z-10 w-full max-w-md p-10 bg-white shadow-[0_35px_80px_rgba(0,0,0,0.15)] rounded-[2.5rem] border border-white/60">
                <div className="text-center mb-10">
                    <img 
                        src="/Logo/PNG Crest.png" 
                        className="w-24 h-24 mx-auto mb-6 drop-shadow-lg" 
                        alt="Main DPM Crest" 
                    />
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
                            className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-red-600 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                            placeholder="Enter Username"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-red-600 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full py-4 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold tracking-widest transition-all shadow-lg active:scale-[0.98] uppercase text-sm mt-4"
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