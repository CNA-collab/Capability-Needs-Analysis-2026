import React, { useState, useEffect, useMemo } from 'react';

// --- STRATEGIC COMPONENTS ---
import { CnaHome } from './components/CnaHome'; 
import { FrameworkGraphic } from './components/FrameworkGraphic';

// --- UI COMPONENTS ---
import { AutomatedOrganisationalAnalysisReport } from './components/AiAnalysisReport';
import { Sidebar } from './components/Sidebar';
import { OrganisationalDashboard } from './components/OrganisationalDashboard';
import { LoginPage } from './components/LoginPage'; 
import { WelcomeModal } from './components/WelcomeModal';
import { ImportModal } from './components/ImportModal';
import { SurveyInsights } from './components/SurveyInsights';
import { SystemSettings } from './components/SystemSettings';
import { GesiPolicyToolkit } from './components/GesiPolicyToolkit';
import { CnaPolicyToolkit } from './components/CnaPolicyToolkit';
import { TrainingPathwaysDashboard } from './components/TrainingPathwaysDashboard';

// --- TYPES & DATA ---
import { 
    OfficerRecord, 
    AgencyType, 
    EstablishmentRecord, 
    View, 
    Tab 
} from './types';
import { INITIAL_CNA_DATASET } from './constants';
import { ESTABLISHMENT_DATA } from './data/establishment';

const deDuplicateOfficers = (officers: OfficerRecord[]): OfficerRecord[] => {
    const uniqueMap = new Map<string, OfficerRecord>();
    officers.forEach(o => {
        const key = o.email?.trim().toLowerCase() || `${o.name}-${o.position}`.toLowerCase();
        if (key && key !== '-') uniqueMap.set(key, o);
    });
    return Array.from(uniqueMap.values());
};

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => sessionStorage.getItem('isCnaAppLoggedIn') === 'true');
    const [currentView, setCurrentView] = useState<View>('organisational');
    const [activeOrgTab, setActiveOrgTab] = useState<Tab>('diagnostic');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [officerData, setOfficerData] = useState<OfficerRecord[]>(() => 
        deDuplicateOfficers(JSON.parse(localStorage.getItem('cna_officerData') || JSON.stringify(INITIAL_CNA_DATASET)))
    );
    const [establishmentData, setEstablishmentData] = useState<EstablishmentRecord[]>(() => 
        JSON.parse(localStorage.getItem('cna_establishmentData') || JSON.stringify(ESTABLISHMENT_DATA))
    );
    const [agencyName, setAgencyName] = useState<string>("Department of Personnel Management");
    const [agencyType, setAgencyType] = useState<AgencyType>('National Agency');

    const [showAiAnalysis, setShowAiAnalysis] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    const kpis = useMemo(() => {
        const total = establishmentData.length;
        const filled = officerData.length;
        return {
            establishmentGap: total > 0 ? Math.round(((total - filled) / total) * 100) : 0,
            baselineScore: 6.8,
            criticalSkillGaps: 12,
            trainingCompletion: 45
        };
    }, [officerData, establishmentData]);

    useEffect(() => { if (isLoggedIn) setShowWelcome(true); }, [isLoggedIn]);

    const handleNavigate = (view: View, tab?: Tab) => {
        setCurrentView(view);
        if (tab) setActiveOrgTab(tab);
    };

    const renderView = () => {
        switch (currentView) {
            case 'organisational':
                if (activeOrgTab === 'diagnostic') {
                    return <CnaHome agencyName={agencyName} kpis={kpis} onRunAI={() => setShowAiAnalysis(true)} />;
                }
                return (
                    <OrganisationalDashboard 
                        data={officerData}
                        establishmentData={establishmentData}
                        agencyType={agencyType}
                        agencyName={agencyName}
                        activeTab={activeOrgTab}
                        onSetActiveTab={(tab: Tab) => setActiveOrgTab(tab)}
                        onShowAiAnalysis={() => setShowAiAnalysis(true)}
                        rawResponseCount={officerData.length}
                        onShowFiveYearPlan={() => {}}
                        onShowCompetencyReport={() => {}}
                        onShowGapAnalysis={() => {}}
                        onShowTalentSegmentation={() => {}}
                        onShowStrategicRecs={() => {}}
                        onShowWorkforceSnapshot={() => {}}
                        onShowDetailedCapability={() => {}}
                        onShowEligibleOfficers={() => {}}
                        onShowAnnualPlan={() => {}}
                        onShowConsolidatedPlan={() => {}}
                        onShowSuccessionPlan={() => {}}
                        onShowGesiAnalysis={() => {}}
                        onShowItemLevelAnalysis={() => {}}
                        onShowComplianceCertificate={() => {}}
                        onShowDevelopmentPathways={() => {}}
                        onShowEvidenceMasterTable={() => {}}
                    />
                );
            case 'survey-insights': return <SurveyInsights />;
            case 'pathways': 
                return (
                    <TrainingPathwaysDashboard 
                        agencyType={agencyType} setAgencyType={setAgencyType}
                        agencyName={agencyName} setAgencyName={setAgencyName}
                        onSelectCategory={() => {}} onGeneratePlan={() => {}}
                        onShowAutomatedLndReport={() => {}} onShowProjectionReport={() => {}}
                    />
                );
            case 'gesi': return <GesiPolicyToolkit onShowGesiAnalysis={() => {}} />;
            case 'settings': return <SystemSettings />;
            default: return null;
        }
    };

    if (!isLoggedIn) return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
            <Sidebar 
                currentView={currentView} 
                setCurrentView={handleNavigate} 
                onImportClick={() => setShowImportModal(true)} 
                onLogout={() => setIsLoggedIn(false)}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onHelpClick={() => {}}
                onShowLndAiAssistant={() => {}}
                onShowPowerBi={() => {}}
            />
            <main className="flex-1 overflow-y-auto relative">
                {renderView()}
            </main>
            {showAiAnalysis && (
                <AutomatedOrganisationalAnalysisReport 
                    data={officerData} 
                    establishmentData={establishmentData}
                    agencyType={agencyType}
                    agencyName={agencyName} 
                    corporatePlanContext=""
                    onClose={() => setShowAiAnalysis(false)} 
                />
            )}
            {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} onViewPolicy={() => {}} />}
            {showImportModal && <ImportModal onImport={() => {}} onClose={() => setShowImportModal(false)} />}
        </div>
    );
};

export default App;