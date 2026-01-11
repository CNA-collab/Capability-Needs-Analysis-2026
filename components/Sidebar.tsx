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
    onLogout, 
    isOpen, 
    onClose 
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { id: 'organisational', label: 'Dashboard', icon: '📊' },
        { id: 'individual', label: 'Operations', icon: '👥' },
        { id: 'pathways', label: 'Pathways', icon: '🛤️' },
        { id: 'gesi', label: 'GESI Toolkit', icon: '⚖️' },
        { id: 'survey-insights', label: 'Survey Insights', icon: '📈' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <>
            {/* MOBILE OVERLAY */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-400/20 z-40 md:hidden backdrop-blur-sm" 
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed md:relative z-50 h-screen transition-all duration-300 ease-in-out
                bg-[#F8FAFC] border-r border-slate-200 flex flex-col
                ${isCollapsed ? 'w-20' : 'w-64'} 
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                
                {/* TOP SECTION: LOGO & PROFILE */}
                <div className="p-6 flex flex-col items-center">
                    {/* PNG CREST - REDUCED BY 50% (Approx 35px-40px) */}
                    <div className="mb-6 flex justify-center w-full">
                        <img 
                            src="/Logo/PNG Crest.png" 
                            alt="PNG Crest" 
                            className="transition-all duration-300 object-contain drop-shadow-sm"
                            style={{ width: isCollapsed ? '28px' : '38px' }} 
                        />
                    </div>

                    {!isCollapsed && (
                        <div className="text-center mb-4">
                            <p className="text-slate-900 font-black text-[11px] uppercase tracking-tighter">CNA Admin</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">DPM Officer</p>
                        </div>
                    )}
                </div>

                {/* COLLAPSE TOGGLE */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3 top-20 bg-white text-slate-400 rounded-full w-6 h-6 items-center justify-center shadow-sm z-[60] border border-slate-200 hover:text-red-600 transition-colors"
                >
                    <span className="text-[10px]">{isCollapsed ? '▶' : '◀'}</span>
                </button>

                {/* NAVIGATION */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
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
                                    ? 'bg-white text-red-700 shadow-md border border-slate-100' 
                                    : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'}
                            `}
                        >
                            <span className="text-xl">{item.icon}</span>
                            
                            {!isCollapsed && (
                                <span className="text-[11px] font-black uppercase tracking-tight">
                                    {item.label}
                                </span>
                            )}

                            {isCollapsed && (
                                <div className="absolute left-16 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-50 shadow-xl">
                                    {item.label}
                                </div>
                            )}
                        </button>
                    ))}
                </nav>

                {/* BOTTOM ACTIONS */}
                <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/50">
                    <button 
                        onClick={onImportClick}
                        className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-slate-400 hover:text-emerald-600 transition-all mb-1"
                    >
                        <span className="text-xl">📥</span>
                        {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-tight">Import</span>}
                    </button>
                    
                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-slate-400 hover:text-red-600 transition-all"
                    >
                        <span className="text-xl">🚪</span>
                        {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-tight">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};