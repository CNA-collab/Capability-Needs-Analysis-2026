import React, { useState } from 'react';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Secure Access Logic for 2026 Admin
        if (password === 'admin123') { 
            onLoginSuccess();
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100 relative overflow-hidden">
                
                {/* NATIONAL COLORS TOP BAR */}
                <div className="absolute top-0 left-0 w-full h-3 flex">
                    <div className="flex-1 bg-[#1A365D]"></div>
                    <div className="flex-1 bg-[#E11D48]"></div>
                    <div className="flex-1 bg-[#2AAA52]"></div>
                </div>
                
                <div className="flex justify-center mt-4 mb-6">
                    <img 
                        src="/Logo/PNG Crest.png" 
                        alt="PNG Crest" 
                        className="h-20 object-contain drop-shadow-md" 
                    />
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-2xl font-black text-[#1A365D] uppercase tracking-tight">CNA System 2026</h1>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="h-[1px] w-4 bg-slate-300"></span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Official Login</p>
                        <span className="h-[1px] w-4 bg-slate-300"></span>
                    </div>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-8">
                    {/* PASSWORD FIELD WITH RED GLOW FOCUS */}
                    <div className="relative group">
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Access Token</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-5 py-4 rounded-2xl border-2 transition-all text-center text-lg tracking-widest outline-none
                                ${error 
                                    ? 'border-red-600 bg-red-50 animate-bounce' 
                                    : 'border-slate-100 bg-slate-50/50 focus:border-red-500 focus:bg-white focus:shadow-[0_0_20px_rgba(225,29,72,0.2)]'
                                }`}
                            placeholder="••••••••"
                        />
                    </div>

                    {/* AUTHORIZE BUTTON WITH INTENSE RED GLOW */}
                    <button 
                        type="submit"
                        className="group relative w-full h-16 bg-[#1A365D] hover:bg-[#0f2139] text-white rounded-2xl font-black uppercase text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                        style={{
                            boxShadow: '0 10px 30px -10px rgba(26, 54, 93, 0.5), 0 0 15px rgba(225, 29, 72, 0.3)'
                        }}
                    >
                        {/* THE RED GLOW OVERLAY ON HOVER */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            Authorize & Enter
                            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                    </button>
                </form>

                <div className="mt-10 text-center border-t border-slate-50 pt-6">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                        Department of Personnel Management<br/>
                        Waigani, Papua New Guinea
                    </p>
                </div>
            </div>
        </div>
    );
};