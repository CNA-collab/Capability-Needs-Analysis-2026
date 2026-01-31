import React, { useState } from 'react';
import { ShieldCheckIcon, EyeIcon, EyeSlashIcon } from './icons';

interface LoginPageProps {
    onLogin: (username: string, password: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Demo login - accept any username/password for now
        setTimeout(() => {
            if (username.trim() && password.trim()) {
                onLogin(username, password);
            } else {
                setError('Please enter both username and password');
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: 'url("/Logo/PNG%20Crest.png")' }}></div>
            <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <img src="/Logo/PNG%20Crest.png" alt="PNG Crest" className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-2xl font-black text-white uppercase tracking-wider">
                            CNA Strategic Portal
                        </h1>
                        <p className="text-slate-300 text-sm mt-2">
                            Capability Needs Analysis System
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="Enter your username"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Enter your password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="w-5 h-5" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
                                <p className="text-red-300 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 text-white font-black py-3 px-6 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <ShieldCheckIcon className="w-5 h-5" />
                                    Login to Dashboard
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">
                            Demo Credentials
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            For demonstration purposes, enter any username and password to access the system.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
