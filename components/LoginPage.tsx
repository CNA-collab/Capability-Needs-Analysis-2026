import React, { useState } from 'react';

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
        /* LIGHT SLATE PROFESSIONAL BACKGROUND */
        <div className="relative min-h-screen w-full flex items-center justify-center bg-[#F1F5F9] overflow-hidden font-sans" 
             style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* DUAL WATERMARK LAYER - SUBTLE 60% VISIBILITY */}
            <div className="absolute inset-0 flex items-center justify-between px-6 md:px-24 pointer-events-none z-0">
                
                {/* LEFT: GOLDEN JUBILEE LOGO */}
                <div className="w-1/3 flex justify-start">
                    <img 
                        src="/Logo/Golden_Jubilee.png" 
                        className="w-full max-w-[420px] h-auto opacity-60 mix-blend-multiply contrast-125" 
                        alt="Golden Jubilee" 
                    />
                </div>

                {/* RIGHT: PNG NATIONAL CREST */}
                <div className="w-1/3 flex justify-end">
                    <img 
                        src="/Logo/PNG Crest.png" 
                        className="w-full max-w-[420px] h-auto opacity-60 mix-blend-multiply contrast-110" 
                        alt="PNG Crest" 
                    />
                </div>
            </div>

            {/* SQUARE LOGIN CARD */}
            <div className="relative z-10 w-full max-w-[420px] aspect-square p-10 bg-white shadow-[0_50px_100px_rgba(15,23,42,0.25)] rounded-[3rem] border border-white flex flex-col justify-center">
                <div className="text-center mb-8">
                    <img 
                        src="/Logo/PNG Crest.png" 
                        className="w-20 h-20 mx-auto mb-4 drop-shadow-xl" 
                        alt="DPM Crest" 
                    />
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                        CNA System
                    </h2>
                    <p className="text-slate-500 text-[9px] mt-2 font-black uppercase tracking-[0.4em]">
                        Dept. of Personnel Management
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div className="space-y-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-600 focus:bg-white transition-all outline-none text-slate-900 font-bold"
                            placeholder="Enter Username"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-600 focus:bg-white transition-all outline-none text-slate-900 font-bold"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full py-4 bg-red-700 hover:bg-red-800 text-white rounded-2xl font-black tracking-widest transition-all shadow-xl active:scale-[0.97] uppercase text-xs mt-2"
                    >
                        Authorize Access
                    </button>
                </form>

                <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Secure
                    </span>
                    <span>v2.0.38-Alpha</span>
                </div>
            </div>
        </div>
    );
};