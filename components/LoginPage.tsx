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
        <div className="min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
            
            {/* DUAL BACKGROUND WATERMARKS (45% Visibility) */}
            <div className="absolute top-[-5%] left-[-5%] opacity-45 pointer-events-none select-none">
                <img src="/Logo/PNG Crest.png" alt="" className="w-[450px]" />
            </div>
            <div className="absolute bottom-[-5%] right-[-5%] opacity-45 pointer-events-none select-none">
                <img src="/Logo/Golden_Jubilee.png" alt="" className="w-[450px]" />
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100 relative z-10">
                
                {/* NATIONAL COLORS STRIP */}
                <div className="absolute top-0 left-0 w-full h-2 flex rounded-t-[2.5rem] overflow-hidden">
                    <div className="flex-1 bg-[#1A365D]"></div>
                    <div className="flex-1 bg-[#E11D48]"></div>
                    <div className="flex-1 bg-[#2AAA52]"></div>
                </div>
                
                <div className="flex justify-center mt-4 mb-6 gap-4">
                    <img src="/Logo/PNG Crest.png" alt="PNG Crest" className="h-16 object-contain drop-shadow-sm" />
                    <div className="w-[1px] h-16 bg-slate-100"></div>
                    <img src="/Logo/Golden_Jubilee.png" alt="Golden Jubilee" className="h-16 object-contain drop-shadow-sm" />
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-2xl font-black text-[#1A365D] uppercase tracking-tight italic">CNA System 2026</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Official Government Portal</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    {/* USERNAME FIELD */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest text-center">Operator ID</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white outline-none transition-all text-center text-sm font-bold"
                            placeholder="DPM_OP_0001"
                        />
                    </div>

                    {/* PASSWORD FIELD */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest text-center">Security Access Token</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-5 py-3 rounded-2xl border-2 transition-all text-center text-lg tracking-widest outline-none
                                ${error 
                                    ? 'border-red-600 bg-red-50 animate-shake' 
                                    : 'border-slate-100 bg-slate-50/50 focus:border-red-500 focus:bg-white focus:shadow-[0_0_20px_rgba(225,29,72,0.15)]'
                                }`}
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit"
                        className="group relative w-full h-14 bg-[#1A365D] hover:bg-red-600 text-white rounded-2xl font-black uppercase text-xs transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(225,29,72,0.4)] mt-4"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Authorize & Enter System
                            <span className="text-lg">→</span>
                        </span>
                    </button>
                </form>

                {/* DPM ADDRESS FOOTER */}
                <div className="mt-10 text-center border-t border-slate-50 pt-6">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.15em] leading-relaxed">
                        Department of Personnel Management<br/>
                        P.O. Box 519, Waigani, NCD<br/>
                        Papua New Guinea
                    </p>
                </div>
            </div>

            {/* POLICY & SPONSOR LOGOS (Full Colors / 100% Opacity) */}
            <div className="mt-10 flex flex-wrap justify-center items-center gap-10">
                <img src="/Logo/HRDSP.png" alt="HRDSP" className="h-12 object-contain" />
                <img src="/Logo/MTDP IV.png" alt="MTDP IV" className="h-12 object-contain" />
                <img src="/Logo/PNGV50.png" alt="PNG Vision 2050" className="h-14 object-contain" />
                <img src="/Logo/SDGs.png" alt="SDGs" className="h-12 object-contain" />
            </div>
        </div>
    );
};