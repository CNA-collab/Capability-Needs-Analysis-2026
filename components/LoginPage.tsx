import React, { useState } from 'react';
import type { JSX } from 'react'; 
import { SpinnerIcon } from './icons';
import { verifyCredentials } from '../utils/auth';

/**
 * PNG National Crest Component
 */
const PNGNationalCrest = () => (
    <div className="flex justify-center mb-8">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl border-2 border-slate-50 p-2 overflow-hidden ring-8 ring-white/50 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white"></div>
            <img 
                src="/Logo/PNG Crest.png" 
                alt="National Crest of Papua New Guinea" 
                className="w-full h-full object-contain relative z-10 p-1"
            />
        </div>
    </div>
);

interface LoginPageProps {
    onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const isValid = await verifyCredentials(username, password);
            if (isValid) {
                onLoginSuccess();
            } else {
                setError('Authentication failed. Please verify your Operator ID and Access Key.');
            }
        } catch (err) {
            setError('System connection error. Please contact DPM IT support.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white font-['Inter',_sans-serif] p-6 relative overflow-hidden">
            
            {/* TILED WATERMARKS */}
            <div className="absolute inset-0 grid grid-cols-6 md:grid-cols-10 gap-8 p-4 opacity-[0.04] pointer-events-none z-0">
                {Array.from({ length: 60 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-center">
                        <img src="/Logo/PNG Crest.png" alt="" className="w-16 h-16 grayscale" />
                    </div>
                ))}
            </div>

            {/* LARGE CENTRAL WATERMARK */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <img 
                    src="/Logo/PNG Crest.png" 
                    alt="National Watermark" 
                    className="w-[75%] max-w-[850px] object-contain opacity-[0.03] grayscale" 
                />
            </div>

            {/* MAIN CONTENT CARD */}
            <div className="w-full max-w-[440px] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.12)] rounded-[40px] p-12 animate-fade-in z-30 border border-slate-100/50">
                <PNGNationalCrest />
                
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight leading-tight">
                        CNAS Central Access
                    </h1>
                    <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-[0.25em] mt-3">
                        National Public Service Portal
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-medium rounded-xl text-center leading-relaxed">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                      Operator Identity
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="DPM-OP-XXXX"
                      className="w-full py-4 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-['Roboto_Mono',_monospace] font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                      Encryption Key
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full py-4 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-['Roboto_Mono',_monospace]"
                    />
                  </div>
                    
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold uppercase tracking-[0.15em] text-xs rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 disabled:bg-slate-300 mt-4"
                  >
                    {isLoading ? (
                      <>
                        <SpinnerIcon className="w-5 h-5 animate-spin" />
                        <span>Authenticating...</span>
                      </>
                    ) : "Verify Security Clearance"}
                  </button>
                </form>
            </div>

            {/* IMPROVED INTERNATIONAL STANDARD FOOTER */}
            <footer className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 px-8 z-30">
                <div className="flex items-center gap-4 w-full max-w-lg">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                </div>
                
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-[0.3em]">
                    Department of Personnel Management
                </p>
                
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
                    <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">
                        &copy; 2026 National Public Service of PNG
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded">
                        Secure Protocol V2.4.0
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                    <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">
                        Validated Access Only
                    </span>
                </div>
            </footer>
        </div>
    );
};