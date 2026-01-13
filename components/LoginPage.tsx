import React, { useState } from 'react';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Updated credentials for 2026 Deployment
        if (username === 'DPM_OP_0001' && password === 'CNA-Dev-2026') { 
            onLoginSuccess();
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
            
            {/* FULL SCREEN BACKGROUND WATERMARK - Maintained */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.12] pointer-events-none select-none">
                <img 
                    src="/Logo/PNG Crest.png" 
                    alt="" 
                    className="w-[900px] md:w-[1200px] object-contain transition-all duration-1000" 
                />
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.2)] w-full max-w-md border border-slate-100 relative z-10 backdrop-blur-md">
                
                {/* NATIONAL COLORS STRIP - Maintained */}
                <div className="absolute top-0 left-0 w-full h-2 flex rounded-t-[2.5rem] overflow-hidden">
                    <div className="flex-1 bg-[#1A365D]"></div>
                    <div className="flex-1 bg-[#E11D48]"></div>
                    <div className="flex-1 bg-[#2AAA52]"></div>
                </div>
                
                {/* Header Logo - Maintained */}
                <div className="flex justify-center mt-4 mb-6">
                    <img src="/Logo/PNG Crest.png" alt="PNG Crest" className="h-20 object-contain drop-shadow-md" />
                </div>

                {/* Updated Branding Title: Removed "2026" */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-[#1A365D] uppercase tracking-tighter italic leading-tight">
                        CNA System
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-1">
                         <div className="h-[1px] w-6 bg-slate-200"></div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                            Official Government HR Portal
                         </p>
                         <div className="h-[1px] w-6 bg-slate-200"></div>
                    </div>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest text-center">Operator ID</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-[#1A365D] focus:bg-white outline-none transition-all text-center text-sm font-bold shadow-inner"
                            placeholder="DPM_OP_0001"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest text-center">Security Access Token</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-5 py-4 rounded-2xl border-2 transition-all text-center text-lg tracking-widest outline-none shadow-inner
                                ${error 
                                    ? 'border-red-600 bg-red-50 animate-shake' 
                                    : 'border-slate-100 bg-slate-50/50 focus:border-red-500 focus:bg-white focus:shadow-[0_0_20px_rgba(225,29,72,0.15)]'
                                }`}
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit"
                        className="group relative w-full h-14 bg-[#1A365D] hover:bg-[#E11D48] text-white rounded-2xl font-black uppercase text-xs transition-all duration-500 shadow-xl hover:shadow-[0_15px_35px_rgba(225,29,72,0.3)] mt-4 active:scale-95"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Authorize & Enter System
                            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                    </button>
                </form>

                <div className="mt-12 text-center border-t border-slate-100 pt-6">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] leading-relaxed">
                        Department of Personnel Management<br/>
                        P.O. Box 519, Waigani, NCD<br/>
                        Papua New Guinea
                    </p>
                </div>
            </div>

            {/* POLICY & SPONSOR LOGOS - Maintained with high visibility */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-12 opacity-100 transition-opacity duration-300">
                <img src="/Logo/HRDSP.png" alt="HRDSP" className="h-14 object-contain transition-all hover:scale-110" />
                <img src="/Logo/MTDP IV.png" alt="MTDP IV" className="h-14 object-contain transition-all hover:scale-110" />
                <img src="/Logo/PNGV50.png" alt="PNG Vision 2050" className="h-16 object-contain transition-all hover:scale-110" />
                <img src="/Logo/SDGs.png" alt="SDGs" className="h-14 object-contain transition-all hover:scale-110" />
            </div>
        </div>
    );
};