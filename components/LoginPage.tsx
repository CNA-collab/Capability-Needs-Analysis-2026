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

    // Main Sponsors - Full Color
    const sponsors = [
        { src: "/Logo/HRDSP.png", alt: "HRDSP" },
        { src: "/Logo/MTDP IV.png", alt: "MTDP IV" },
        { src: "/Logo/PNGV50.png", alt: "PNG Vision 2050" },
        { src: "/Logo/SDGs.png", alt: "SDGs" }
    ];

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC] overflow-hidden font-sans px-4">
            
            {/* DUAL WATERMARKS - FIXED AT 50% VISIBILITY */}
            <div className="absolute inset-0 flex items-center justify-between px-6 md:px-24 pointer-events-none z-0">
                <div className="w-1/3 flex justify-start">
                    <img 
                        src="/Logo/Golden_Jubilee.png" 
                        className="w-full max-w-[420px] opacity-50 mix-blend-multiply contrast-125" 
                        alt="Jubilee Watermark" 
                    />
                </div>
                <div className="w-1/3 flex justify-end">
                    <img 
                        src="/Logo/PNG Crest.png" 
                        className="w-full max-w-[420px] opacity-50 mix-blend-multiply contrast-110" 
                        alt="Crest Watermark" 
                    />
                </div>
            </div>

            {/* LOGIN CARD */}
            <div className="relative z-10 w-full max-w-[420px] p-10 bg-white shadow-[0_50px_100px_rgba(15,23,42,0.12)] rounded-[3rem] border border-white flex flex-col justify-center mb-16">
                <div className="text-center mb-8">
                    <img src="/Logo/PNG Crest.png" className="w-16 h-16 mx-auto mb-4 drop-shadow-md" alt="DPM Crest" />
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">CNA System</h2>
                    <p className="text-slate-400 text-[8px] mt-2 font-black uppercase tracking-[0.4em]">Dept. of Personnel Management</p>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Access ID</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-600 focus:bg-white transition-all outline-none text-sm font-bold shadow-sm"
                            placeholder="DPM_OP_XXXX"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Secure Key</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-600 focus:bg-white transition-all outline-none text-sm font-bold shadow-sm"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full py-4.5 bg-red-700 hover:bg-red-800 text-white rounded-2xl font-black tracking-widest transition-all shadow-xl active:scale-[0.98] uppercase text-[11px] mt-4"
                    >
                        Authorize & Login
                    </button>
                </form>
            </div>

            {/* SPONSOR SECTION - FULL COLOR PILLARS */}
            <div className="relative z-10 w-full max-w-5xl text-center">
                <div className="flex items-center justify-center gap-4 mb-10">
                    <div className="h-[1px] w-12 bg-slate-200"></div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em]">
                        System Sponsors & Policy Framework
                    </p>
                    <div className="h-[1px] w-12 bg-slate-200"></div>
                </div>

                <div className="flex flex-row justify-center items-center gap-8 md:gap-16">
                    {sponsors.map((logo, index) => (
                        <div key={index} className="flex flex-col items-center group">
                            <img 
                                src={logo.src} 
                                alt={logo.alt} 
                                className="h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
                                style={{ transform: 'scale(0.9)' }} 
                            />
                            <p className="mt-4 text-[7px] font-black text-slate-400 uppercase tracking-widest">
                                {logo.alt}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECURITY FOOTER */}
            <div className="absolute bottom-8 flex items-center gap-3 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Secure Government Environment v2.0.38
            </div>
        </div>
    );
};