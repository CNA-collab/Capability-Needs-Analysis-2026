import React from 'react';
import { 
    UsersIcon, ChartPieIcon, DocumentArrowUpIcon, QuestionMarkCircleIcon, 
    SparklesIcon, ScaleIcon, BookOpenIcon, ArrowLeftOnRectangleIcon, 
    AcademicCapIcon, PresentationChartLineIcon, XIcon, Cog6ToothIcon, GlobeAltIcon 
} from './icons';

type View = 'organisational' | 'individual' | 'pathways' | 'gesi' | 'cna' | 'settings' | 'survey-insights';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  onImportClick: () => void;
  onHelpClick: () => void;
  onShowLndAiAssistant: () => void;
  onLogout: () => void;
  onShowPowerBi: () => void;
  isOpen: boolean;
  onClose: () => void;
}

// --- SUB-COMPONENTS ---

const PNGNationalEmblem = () => (
    <div className="flex items-center justify-center w-full h-full p-1">
        <img 
            src="/Logo/PNG Crest.png" 
            alt="PNG National Crest" 
            // Changed from w-[85%] to w-full to fill the 80% container scale
            className="w-full h-full object-contain drop-shadow-xl animate-in fade-in zoom-in duration-700"
        />
    </div>
);

const NavItemGroup: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-4 last:mb-0">
        {title && <h3 className="px-3 text-[9px] font-black uppercase text-white/40 tracking-[0.2em] mb-2 mt-2">{title}</h3>}
        <div className="space-y-1">
            {children}
        </div>
    </div>
);

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isNew?: boolean;
}> = ({ icon: Icon, label, isActive, onClick, isNew }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 rounded-lg min-h-[38px] group relative ${
        isActive
            ? 'bg-[#2AAA52] text-white shadow-lg'
            : 'text-white/60 hover:bg-white/5 hover:text-white'
        }`}
    >
        <Icon className={`w-4 h-4 mr-3 flex-shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
        <span className="truncate">{label}</span>
        {isNew && !isActive && (
            <span className="absolute right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
        )}
    </button>
);

// --- MAIN SIDEBAR COMPONENT ---

export const Sidebar: React.FC<SidebarProps> = ({ 
    currentView, setCurrentView, onImportClick, onHelpClick, 
    onShowLndAiAssistant, onLogout, onShowPowerBi, isOpen, onClose 
}) => {
  return (
    <>
        {isOpen && (
            <div 
                className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity duration-500"
                onClick={onClose}
            />
        )}
        
        <aside className={`fixed top-0 left-0 h-screen w-60 z-50 transition-transform duration-300 transform md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)] border-r border-white/5 bg-[#0F172A]`}>
            
            {/* Header / Logo Section (Updated for 80% scaling) */}
            <div className="flex flex-col items-center px-5 py-10 shrink-0 border-b border-white/5">
                <div className="w-[80%] aspect-square bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden mb-5 relative shadow-2xl">
                    <PNGNationalEmblem />
                    <button onClick={onClose} className="md:hidden absolute top-2 right-2 p-1.5 bg-black/40 hover:bg-red-500 rounded-full text-white transition-colors">
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-center">
                    <h1 className="text-[13px] font-black text-white leading-none uppercase tracking-[0.25em]">CNAS Portal</h1>
                    <p className="text-[9px] font-bold text-[#2AAA52] uppercase tracking-[0.2em] mt-2">DPM National Matrix</p>
                </div>
            </div>
            
            <nav className="flex-grow overflow-y-auto px-3 py-6 custom-scrollbar">
                <NavItemGroup title="Operational Desk">
                    <NavItem icon={ChartPieIcon} label="Organisational" isActive={currentView === 'organisational'} onClick={() => { setCurrentView('organisational'); onClose(); }} />
                    <NavItem icon={UsersIcon} label="Individual" isActive={currentView === 'individual'} onClick={() => { setCurrentView('individual'); onClose(); }} />
                    <NavItem icon={AcademicCapIcon} label="Training Pathways" isActive={currentView === 'pathways'} onClick={() => { setCurrentView('pathways'); onClose(); }} isNew />
                </NavItemGroup>

                <NavItemGroup title="Digital Insights">
                     <NavItem icon={GlobeAltIcon} label="Cloud Analytics" isActive={currentView === 'survey-insights'} onClick={() => { setCurrentView('survey-insights'); onClose(); }} isNew />
                     <NavItem icon={PresentationChartLineIcon} label="Power BI Analytics" isActive={false} onClick={() => { onShowPowerBi(); onClose(); }} />
                </NavItemGroup>

                <NavItemGroup title="Policy Governance">
                    <NavItem icon={ScaleIcon} label="GESI Framework" isActive={currentView === 'gesi'} onClick={() => { setCurrentView('gesi'); onClose(); }} />
                    <NavItem icon={BookOpenIcon} label="CNA Guidelines" isActive={currentView === 'cna'} onClick={() => { setCurrentView('cna'); onClose(); }} />
                </NavItemGroup>

                <NavItemGroup title="Intelligence">
                    <NavItem icon={DocumentArrowUpIcon} label="Data Management" isActive={false} onClick={() => { onImportClick(); onClose(); }} />
                    <NavItem icon={SparklesIcon} label="L&D AI Assistant" isActive={false} onClick={() => { onShowLndAiAssistant(); onClose(); }} />
                    <NavItem icon={Cog6ToothIcon} label="Portal Settings" isActive={currentView === 'settings'} onClick={() => { setCurrentView('settings'); onClose(); }} />
                </NavItemGroup>
                
                <NavItemGroup title="Support & Security">
                    <NavItem icon={QuestionMarkCircleIcon} label="Help Desk" isActive={false} onClick={() => { onHelpClick(); onClose(); }} />
                    <NavItem icon={ArrowLeftOnRectangleIcon} label="Secure Logout" isActive={false} onClick={() => { onLogout(); onClose(); }} />
                </NavItemGroup>
            </nav>

            <div className="shrink-0 p-6 border-t border-white/5 bg-black/20 text-center">
                <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] leading-relaxed">
                    DPM PNG &copy; 2026 <br/>
                    <span className="text-[#2AAA52]">Authenticated Access</span>
                </p>
            </div>
        </aside>

        <style dangerouslySetInnerHTML={{ __html: `
            .custom-scrollbar::-webkit-scrollbar { width: 3px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        `}} />
    </>
  );
};