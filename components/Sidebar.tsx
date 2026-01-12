import React, { useState } from 'react';

type View = 'organisational' | 'individual' | 'pathways' | 'gesi' | 'cna' | 'settings' | 'survey-insights';

interface SidebarProps {
    currentView: View;
    setCurrentView: (view: View, tab?: any) => void;
    onImportClick: () => void;
    onHelpClick: () => void;
    onShowLndAiAssistant: () => void;
    onLogout: () => void;
    onShowPowerBi: () => void;
    isOpen: boolean; 
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    currentView, 
    setCurrentView, 
    onImportClick, 
    onShowLndAiAssistant,
    onLogout, 
    isOpen, 
    onClose 
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Updated menuItems to include CNA Policy Toolkit and Survey Insights
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
                
                {/* TOP SECTION: LOGO & PROFILE */}
                <div className="p-6 flex flex-col items-center">
                    <div className="mb-6 flex justify-center w-full bg-white/10 p-2 rounded-2xl">
                        <img 
                            src="/Logo/PNG Crest.png" 
                            alt="PNG Crest" 
                            className="transition-all duration-300 object-contain brightness-0 invert"
                            style={{ width: isCollapsed ? '28px' : '38px' }} 
                        />
                    </div>

                    {!isCollapsed && (
                        <div className="text-center mb-4">
                            <p className="text-white font-black text-[11px] uppercase tracking-tighter">CNA Admin</p>
                            <p className="text-[9px] text-blue-300/60 font-bold uppercase tracking-widest">DPM Officer</p>
                        </div>
                    )}
                </div>

                {/* COLLAPSE TOGGLE */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3 top-20 bg-white text-[#1A365D] rounded-full w-6 h-6 items-center justify-center shadow-lg z-[60] border border-blue-100 hover:text-red-600 transition-colors"
                >
                    <span className="text-[10px]">{isCollapsed ? '▶' : '◀'}</span>
                </button>

                {/* NAVIGATION */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-sidebar-scroll">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setCurrentView(item.id as View);
                                if (window.innerWidth < 768) onClose();
                            }}
                            className={`
                                w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative
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

                    {/* AI ASSISTANT SPECIAL BUTTON */}
                    <div className="pt-4 mt-4 border-t border-blue-800/50">
                        <button 
                            onClick={onShowLndAiAssistant}
                            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition-all group"
                        >
                            <span className="text-xl animate-pulse">🤖</span>
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
                        {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-tight">System Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};