// components/LoginPage.tsx
import React, { useState } from 'react';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple validation for the 2026 CNA System
        if (password === 'admin123') { 
            onLoginSuccess();
        } else {
            alert('Invalid Credentials');
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F7F9] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
                <div className="flex justify-center mb-6">
                    <img src="/Logo/PNG Crest.png" alt="PNG Crest" className="h-20 object-contain" />
                </div>
                <h1 className="text-center text-xl font-black text-[#1A365D] uppercase mb-2">CNA System 2026</h1>
                <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Official Login</p>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-700 uppercase mb-1">Access Token</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Enter password..."
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-[#1A365D] text-white py-3 rounded-xl font-black uppercase text-sm hover:bg-blue-900 transition-colors shadow-lg"
                    >
                        Enter System
                    </button>
                </form>
            </div>
        </div>
    );
};