import React, { useState } from 'react';
import { View } from '../types';

interface SidebarProps {
    currentView: View;
    // Changed from setCurrentView to setView to match App.tsx
    setView: (view: View) => void; 
    onImportClick?: () => void;
    onHelpClick?: () => void;
    onShowLndAiAssistant?: () => void;
    onLogout?: () => void;
    onShowPowerBi?: () => void;
    isOpen: boolean; 
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    currentView, 
    setView, 
    onImportClick = () => {}, 
    onShowLndAiAssistant = () => {},
    onLogout = () => {}, 
    isOpen, 
    onClose 
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { id: 'organisational', label: 'Dashboard', icon: '📊' },
        { id: 'individual', label: 'Operations', icon: '👥' },
        { id: 'pathways', label: 'Pathways', icon: '🛤️' },
        { id: 'gesi', label: 'GESI Toolkit', icon: '⚖️' },
        { id: 'cna', label: 'CNA Policy Toolkit', icon: '📜' },
        { id: 'survey-insights', label: 'Survey Insights', icon: '📈' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <>
            {/* MOBILE OVERLAY */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm" 
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed md:relative z-50 h-screen transition-all duration-300 ease-in-out
                bg-[#1A365D] border-r border-blue-900/30 flex flex-col
                ${isCollapsed ? 'w-20' : 'w-64'} 
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                
                {/* TOP SECTION: PNG CREST */}
                <div className="p-6 flex flex-col items-center">
                    <div className="mb-6 flex justify-center w-full bg-white/10 p-2 rounded-2xl">
                        <img 
                            src="/Logo/PNG Crest.png" 
                            alt="PNG Crest" 
                            className="transition-all duration-300 object-contain brightness-0 invert"
                            style={{ width: isCollapsed ? '28px' : '38px' }} 
                            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/40?text=PNG")}
                        />
                    </div>

                    {!isCollapsed && (
                        <div className="text-center mb-4">
                            <p className="text-white font-black text-[11px] uppercase tracking-tighter">CNA Admin</p>
                            <p className="text-[9px] text-blue-300/60 font-bold uppercase tracking-widest">10:20:70 Framework</p>
                        </div>
                    )}
                </div>

                {/* COLLAPSE TOGGLE */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3 top-20 bg-white text-[#1A365D] rounded-full w-6 h-6 items-center justify-center shadow-lg z-[60] border border-blue-100"
                >
                    <span className="text-[10px]">{isCollapsed ? '▶' : '◀'}</span>
                </button>

                {/* NAVIGATION */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setView(item.id as View);
                                if (window.innerWidth < 768) onClose();
                            }}
                            className={`
                                w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group
                                ${currentView === item.id 
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                                    : 'text-blue-100/70 hover:bg-white/10 hover:text-white'}
                            `}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {!isCollapsed && (
                                <span className="text-[10px] font-black uppercase tracking-tight">
                                    {item.label}
                                </span>
                            )}
                        </button>
                    ))}

                    <div className="pt-4 mt-4 border-t border-blue-800/50">
                        <button 
                            onClick={onShowLndAiAssistant}
                            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition-all"
                        >
                            <span className="text-xl">🤖</span>
                            {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-tight">AI L&D Assistant</span>}
                        </button>
                    </div>
                </nav>

                {/* BOTTOM ACTIONS */}
                <div className="p-4 mt-auto border-t border-blue-800/50 bg-blue-900/20">
                    <button 
                        onClick={onImportClick}
                        className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-blue-200 hover:bg-white/10 transition-all mb-1"
                    >
                        <span className="text-xl">📥</span>
                        {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-tight">Import Data</span>}
                    </button>
                    
                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <span className="text-xl">🚪</span>
                        {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-tight">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};