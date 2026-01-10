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
        /* VIBRANT SKY BLUE BACKGROUND */
        <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0EA5E9] overflow-hidden font-['Inter']">
            
            {/* 45 DEGREE DIAGONAL WATERMARK GRID */}
            <div 
                className="absolute inset-[-50%] grid grid-cols-6 md:grid-cols-12 gap-16 p-4 pointer-events-none transform rotate-[45deg]"
            >
                {Array.from({ length: 144 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="flex items-center justify-center animate-pop-in"
                        style={{ 
                            animationDelay: `${i * 0.01}s`,
                            opacity: 0
                        }}
                    >
                        {/* THE CREST REMAINS UPRIGHT (COMPENSATING FOR GRID ROTATION) */}
                        <img 
                            src="/Logo/PNG Crest.png" 
                            className="w-14 h-14 brightness-200 grayscale opacity-[0.40] transform -rotate-[45deg]" 
                            alt="" 
                        />
                    </div>
                ))}
            </div>

            {/* LOGIN CARD */}
            <div className="relative z-10 w-full max-w-md p-10 bg-white shadow-[0_35px_80px_rgba(0,0,0,0.3)] rounded-[2.5rem] border border-white/20">
                <div className="text-center mb-10">
                    {/* WIDENED MAIN CREST */}
                    <img 
                        src="/Logo/PNG Crest.png" 
                        className="w-28 h-28 mx-auto mb-6 drop-shadow-xl" 
                        alt="Main DPM Crest" 
                    />
                    {/* REMOVED "2026" PER REQUEST */}
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                        CNA System
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
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-sky-500 focus:bg-white transition-all outline-none text-slate-900 font-bold"
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
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-sky-500 focus:bg-white transition-all outline-none text-slate-900 font-bold"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full py-5 bg-[#0f172a] hover:bg-black text-white rounded-2xl font-black tracking-[0.2em] transition-all shadow-2xl active:scale-[0.97] uppercase text-xs"
                    >
                        Authorize Access
                    </button>
                </form>

                <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <span>Secure Gateway</span>
                    <span>v2.0.38-Alpha</span>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.6); }
                    to { opacity: 0.40; transform: scale(1); }
                }
                .animate-pop-in {
                    animation: popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
            `}} />
        </div>
    );
};