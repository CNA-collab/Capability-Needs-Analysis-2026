import React, { useState } from "react";
import { ShieldCheckIcon, EyeIcon, EyeSlashIcon } from "./icons";

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Demo login - accept any username/password for now
    setTimeout(() => {
      if (username.trim() && password.trim()) {
        onLogin(username, password);
      } else {
        setError("Please enter both username and password");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col overflow-hidden">
      {/* Transparent Header with Policy Logos - Compact */}
      <header className="w-full bg-transparent px-3 py-2 flex-shrink-0">
        <div className="flex justify-end items-center gap-2 md:gap-4">
          {/* CNA Logo */}
          <div className="transform transition-transform duration-300 hover:scale-110">
            <img
              src="/Logo/HRDSP.png"
              alt="CNA - Human Resource Development Scheme"
              className="h-6 md:h-8 w-auto filter grayscale hover:grayscale-0 transition-all duration-300 opacity-90 hover:opacity-100"
            />
          </div>
          {/* SDGs Logo */}
          <div className="transform transition-transform duration-300 hover:scale-110">
            <img
              src="/Logo/SDGs.png"
              alt="Sustainable Development Goals"
              className="h-6 md:h-8 w-auto filter grayscale hover:grayscale-0 transition-all duration-300 opacity-90 hover:opacity-100"
            />
          </div>
          {/* PNG Vision 2050 Logo */}
          <div className="transform transition-transform duration-300 hover:scale-110">
            <img
              src="/Logo/PNGV50.png"
              alt="PNG Vision 2050"
              className="h-6 md:h-8 w-auto filter grayscale hover:grayscale-0 transition-all duration-300 opacity-90 hover:opacity-100"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area - Compact and Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 md:px-4 py-2 overflow-y-auto">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: 'url("/Logo/PNG%20Crest.png")' }}
        ></div>

        {/* Login Panel - Compact */}
        <div className="max-w-sm w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
          <div className="p-5 md:p-6">
            <div className="text-center mb-4">
              {/* National Crest - Smaller size */}
              <img
                src="/Logo/PNG%20Crest.png"
                alt="PNG Crest - Bird of Paradise"
                className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 drop-shadow-lg"
              />
              <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
                CNA Strategic Portal
              </h1>
              <p className="text-slate-300 text-xs md:text-sm mt-1">
                Capability Needs Analysis System
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 md:py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="Enter your username"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 md:py-2.5 pr-10 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2">
                  <p className="text-red-300 text-xs font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 text-white font-bold py-2.5 px-4 rounded-lg uppercase tracking-wider transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className="w-4 h-4" />
                    Login
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Demo Credentials
              </h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Enter any username and password to access the system.
              </p>
            </div>
          </div>
        </div>

        {/* Images Section - More Compact */}
        <div className="w-full max-w-2xl mt-4">
          <div className="grid grid-cols-5 gap-2 md:gap-3">
            {/* MTDP IV */}
            <div className="flex flex-col items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1.5 md:p-2 border border-white/20">
                <img
                  src="/Logo/MTDP%20IV.png"
                  alt="MTDP IV"
                  className="h-8 md:h-10 w-auto mx-auto"
                />
              </div>
              <span className="text-[9px] md:text-[10px] text-slate-400 mt-1 text-center">
                MTDP IV
              </span>
            </div>

            {/* Golden Jubilee */}
            <div className="flex flex-col items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1.5 md:p-2 border border-white/20">
                <img
                  src="/Logo/Golden_Jubilee.png"
                  alt="Golden Jubilee"
                  className="h-8 md:h-10 w-auto mx-auto"
                />
              </div>
              <span className="text-[9px] md:text-[10px] text-slate-400 mt-1 text-center">
                Golden Jubilee
              </span>
            </div>

            {/* L&D Framework */}
            <div className="flex flex-col items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1.5 md:p-2 border border-white/20">
                <img
                  src="/Logo/l&d%20framework.jpg"
                  alt="L&D Framework"
                  className="h-8 md:h-10 w-auto mx-auto rounded"
                />
              </div>
              <span className="text-[9px] md:text-[10px] text-slate-400 mt-1 text-center">
                L&D
              </span>
            </div>

            {/* Parliament Haus */}
            <div className="flex flex-col items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1.5 md:p-2 border border-white/20">
                <img
                  src="/Logo/parliament%20haus.jpg"
                  alt="Parliament Haus"
                  className="h-8 md:h-10 w-auto mx-auto rounded"
                />
              </div>
              <span className="text-[9px] md:text-[10px] text-slate-400 mt-1 text-center">
                Parliament
              </span>
            </div>

            {/* PNG Vision 2050 */}
            <div className="flex flex-col items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1.5 md:p-2 border border-white/20">
                <img
                  src="/Logo/PNGV50.png"
                  alt="PNG Vision 2050"
                  className="h-8 md:h-10 w-auto mx-auto"
                />
              </div>
              <span className="text-[9px] md:text-[10px] text-slate-400 mt-1 text-center">
                Vision 2050
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Policy Text - Compact */}
      <footer className="w-full bg-transparent px-3 py-1.5 text-center flex-shrink-0">
        <p className="text-[9px] md:text-[10px] text-slate-400 tracking-[1px] opacity-70">
          Sponsoring & Mandated Macros Policies
        </p>
      </footer>
    </div>
  );
};
