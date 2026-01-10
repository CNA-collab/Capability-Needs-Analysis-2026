import React, { useState } from 'react';

export const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === "DPM_OP_0001" && password === "CNA-Dev-2026") {
            window.location.href = "/dashboard"; 
        } else {
            alert("Login Failed: Please check your Username and Password.");
        }
    };

    return (
        /* BACKGROUND CHANGED TO EXECUTIVE NAVY BLUE */
        <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0f172a] overflow-hidden font-['Inter']">
            
            {/* 1. DIAGONAL WATERMARK GRID (White/Silver at 70% Opacity) */}
            <div className="absolute inset-[-20%] grid grid-cols-6 md:grid-cols-10 gap-12 p-4 pointer-events-none transform -rotate-12">
                {Array.from({ length: 120 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="flex items-center justify-center animate-pop-in"
                        style={{ 
                            animationDelay: `${i * 0.01}s`,
                            opacity: 0
                        }}
                    >
                        <img 
                            src="/Logo/PNG Crest.png" 
                            className="w-16 h-16 brightness-200 grayscale opacity-[0.70]" 
                            alt="" 
                        />
                    </div>
                ))}
            </div>

            {/* 2. LOGIN CARD - Glassmorphism style to contrast with Deep Blue */}
            <div className="relative z-10 w-full max-w-md p-10 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.5)] rounded-3xl border border-white/10">
                <div className="text-center mb-10">
                    {/* WIDENED MAIN CREST */}
                    <img 
                        src="/Logo/PNG Crest.png" 
                        className="w-28 h-28 mx-auto mb-6 drop-shadow-xl" 
                        alt="Main DPM Crest" 
                    />
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                        CNA System 2026
                    </h2>
                    <p className="text-slate-500 text-[11px] mt-2 font-black uppercase tracking-[0.3em]">
                        Dept. of Personnel Management
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-blue-600 focus:bg-white transition-all outline-none text-slate-900 font-bold"
                            placeholder="DPM_OP_0001"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-blue-600 focus:bg-white transition-all outline-none text-slate-900 font-bold"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full py-5 bg-[#1e293b] hover:bg-black text-white rounded-2xl font-black tracking-[0.2em] transition-all shadow-2xl active:scale-[0.97] uppercase text-xs"
                    >
                        Authorize Access
                    </button>
                </form>

                <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <span>Secure Gateway</span>
                    <span>v2.0.26-Alpha</span>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.6) rotate(-10deg); }
                    to { opacity: 0.70; transform: scale(1) rotate(0deg); }
                }
                .animate-pop-in {
                    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
            `}} />
        </div>
    );
};