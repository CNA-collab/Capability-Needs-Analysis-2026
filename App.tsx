/**
 * PNG National CNA Application - 2026
 * Integration: High-Contrast Auth & Survey Insights Reporting
 */

import React, { useState, useEffect } from 'react';

// --- REPORT & COMPONENT IMPORTS ---
import { AutomatedOrganisationalAnalysisReport } from './components/AiAnalysisReport';
import { FiveYearPlanReport } from './components/FiveYearPlanReport';
import { CompetencyDomainReport } from './components/CompetencyDomainReport';
import { CapabilityGapAnalysisReport } from './components/CapabilityGapAnalysisReport';
import { TalentSegmentationReport } from './components/TalentSegmentationReport';
import { StrategicRecommendationsReport } from './components/StrategicRecommendationsReport';
import { WorkforceSnapshotReport } from './components/WorkforceSnapshotReport';
import { DetailedCapabilityBreakdownReport } from './components/DetailedCapabilityBreakdownReport';
import { EligibleOfficersReport } from './components/EligibleOfficersReport';
import { AnnualTrainingPlanReport } from './components/AnnualTrainingPlanReport';
import { ConsolidatedStrategicPlanReport } from './components/ConsolidatedStrategicPlanReport';
import { SuccessionPlanReport } from './components/SuccessionPlanReport';
import { GesiAnalysisReport } from './components/GesiAnalysisReport';
import { TrainingPathwaysReport } from './components/TrainingPathwaysReport';
import { CnaEvidenceMasterTable } from './components/CnaEvidenceMasterTable';
import { ConsolidatedLifecyclePlanReport } from './components/ConsolidatedLifecyclePlanReport';

// --- UI COMPONENTS ---
import { Sidebar } from './components/Sidebar';
import { OrganisationalDashboard } from './components/OrganisationalDashboard';
import { DivisionGroup } from './components/DivisionGroup';
import { ImportModal } from './components/ImportModal';
import { UserGuideModal } from './components/UserGuideModal';
import { CnaPolicyToolkit } from './components/CnaPolicyToolkit';
import { LndAiAssistantModal } from './components/LndAiAssistantModal';
import { IndividualDevelopmentProfile } from './components/IndividualDevelopmentProfile';
import { GesiPolicyToolkit } from './components/GesiPolicyToolkit';
import { LoginPage } from './components/LoginPage'; // FIXED: Named import for the new high-glow login
import { PowerBiModal } from './components/PowerBiModal';
import { WelcomeModal } from './components/WelcomeModal';
import { TrainingPathwaysDashboard } from './components/TrainingPathwaysDashboard';
import { TrainingCategoryModal } from './components/TrainingCategoryModal';
import { CompetencyProjectionReport } from './components/CompetencyProjectionReport';
import { ItemLevelAnalysisReport } from './components/ItemLevelAnalysisReport';
import { CertificateOfCompliance } from './components/CertificateOfCompliance';
import { SystemSettings } from './components/SystemSettings';
import { SurveyInsights } from './components/SurveyInsights'; // New view for 2026 reporting

// --- TYPES & DATA ---
import { OfficerRecord, AgencyType, EstablishmentRecord, QUESTION_TEXT_MAPPING } from './types';
import { INITIAL_CNA_DATASET } from './constants';
import { ESTABLISHMENT_DATA } from './data/establishment';
import { exportToXlsx } from './utils/export';

const OFFICER_DATA_KEY = 'cna_officerData';
const RAW_RESPONSE_COUNT_KEY = 'cna_rawResponseCount';
const ESTABLISHMENT_DATA_KEY = 'cna_establishmentData';
const AGENCY_TYPE_KEY = 'cna_agencyType';
const AGENCY_NAME_KEY = 'cna_agencyName';
const CORP_PLAN_CONTEXT_KEY = 'cna_corpPlanContext';

type View = 'organisational' | 'individual' | 'pathways' | 'gesi' | 'cna' | 'settings' | 'survey-insights';
type OrgTab = 'diagnostic' | 'overview' | 'divisional';

const deDuplicateOfficers = (officers: OfficerRecord[]): OfficerRecord[] => {
    const uniqueMap = new Map<string, OfficerRecord>();
    const unidentified: OfficerRecord[] = [];
    officers.forEach(o => {
        const email = o.email?.trim().toLowerCase();
        const key = email || `${o.name}-${o.position}`.toLowerCase();
        if (key && key !== '-') uniqueMap.set(key, o);
        else unidentified.push(o);
    });
    return [...Array.from(uniqueMap.values()), ...unidentified];
};

const App: React.FC = () => {
    // --- AUTH & DEVICE STATE ---
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => 
        sessionStorage.getItem('isCnaAppLoggedIn') === 'true'
    );
    const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
    const [currentView, setCurrentView] = useState<View>('organisational');
    const [activeOrgTab, setActiveOrgTab] = useState<OrgTab>('diagnostic');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- REPORT MODAL STATES ---
    const [showWelcome, setShowWelcome] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showAiAnalysis, setShowAiAnalysis] = useState(false);
    const [showFiveYearPlan, setShowFiveYearPlan] = useState(false);
    const [showCompetencyReport, setShowCompetencyReport] = useState(false);
    const [showGapAnalysis, setShowGapAnalysis] = useState(false);
    const [showTalentSegmentation, setShowTalentSegmentation] = useState(false);
    const [showStrategicRecs, setShowStrategicRecs] = useState(false);
    const [showConsolidatedPlan, setShowConsolidatedPlan] = useState(false);
    const [showSuccessionPlan, setShowSuccessionPlan] = useState(false);
    const [showGesiAnalysis, setShowGesiAnalysis] = useState(false);
    const [showEvidenceMasterTable, setShowEvidenceMasterTable] = useState(false);
    const [showConsolidatedLifecycle, setShowConsolidatedLifecycle] = useState(false);

    // --- DATA LOADING & PERSISTENCE ---
    const getFromStorage = <T,>(key: string, def: T): T => {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : def;
    };

    const [officerData, setOfficerData] = useState<OfficerRecord[]>(() => 
        deDuplicateOfficers(getFromStorage(OFFICER_DATA_KEY, INITIAL_CNA_DATASET))
    );
    const [rawResponseCount, setRawResponseCount] = useState<number>(() => 
        getFromStorage(RAW_RESPONSE_COUNT_KEY, officerData.length)
    );
    const [establishmentData, setEstablishmentData] = useState<EstablishmentRecord[]>(() => 
        getFromStorage(ESTABLISHMENT_DATA_KEY, ESTABLISHMENT_DATA)
    );
    const [agencyType, setAgencyType] = useState<AgencyType>(() => 
        getFromStorage(AGENCY_TYPE_KEY, 'National Agency')
    );
    const [agencyName, setAgencyName] = useState<string>(() => 
        getFromStorage(AGENCY_NAME_KEY, 'Department of Personnel Management')
    );
    const [corporatePlanContext, setCorporatePlanContext] = useState<string>(() => 
        getFromStorage(CORP_PLAN_CONTEXT_KEY, '')
    );

    // --- EFFECTS ---
    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            setDeviceType(w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop');
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => { if (isLoggedIn) setShowWelcome(true); }, [isLoggedIn]);

    // --- EVENT HANDLERS ---
    const handleLoginSuccess = () => {
        sessionStorage.setItem('isCnaAppLoggedIn', 'true');
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isCnaAppLoggedIn');
        setIsLoggedIn(false);
    };

    const handleNavigate = (view: View, tab?: OrgTab) => {
        setCurrentView(view);
        if (tab) setActiveOrgTab(tab);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const handleImport = (newData: OfficerRecord[], type: AgencyType, name: string, est?: EstablishmentRecord[], cp?: string) => {
        const deduped = deDuplicateOfficers(newData);
        setOfficerData(deduped);
        setRawResponseCount(newData.length);
        setAgencyType(type);
        setAgencyName(name);
        if (est) setEstablishmentData(est);
        if (cp) setCorporatePlanContext(cp);
        
        localStorage.setItem(OFFICER_DATA_KEY, JSON.stringify(deduped));
        localStorage.setItem(AGENCY_NAME_KEY, JSON.stringify(name));
        setShowImportModal(false);
    };

    const renderCurrentView = () => {
        switch (currentView) {
            case 'organisational':
                return (
                    <OrganisationalDashboard 
                        data={officerData}
                        rawResponseCount={rawResponseCount}
                        establishmentData={establishmentData}
                        agencyType={agencyType}
                        agencyName={agencyName}
                        activeTab={activeOrgTab}
                        onSetActiveTab={setActiveOrgTab}
                        onShowAiAnalysis={() => setShowAiAnalysis(true)}
                        onShowFiveYearPlan={() => setShowFiveYearPlan(true)}
                        onShowCompetencyReport={() => setShowCompetencyReport(true)}
                        onShowGapAnalysis={() => setShowGapAnalysis(true)}
                        onShowTalentSegmentation={() => setShowTalentSegmentation(true)}
                        onShowStrategicRecs={() => setShowStrategicRecs(true)}
                        onShowConsolidatedPlan={() => setShowConsolidatedPlan(true)}
                        onShowSuccessionPlan={() => setShowSuccessionPlan(true)}
                        onShowGesiAnalysis={() => setShowGesiAnalysis(true)}
                        onShowEvidenceMasterTable={() => setShowEvidenceMasterTable(true)}
                        onShowWorkforceSnapshot={() => {}} 
                        onShowDetailedCapability={() => {}}
                        onShowEligibleOfficers={() => {}}
                        onShowAnnualPlan={() => {}}
                        onShowItemLevelAnalysis={() => {}}
                        onShowComplianceCertificate={() => {}}
                        onShowDevelopmentPathways={() => {}}
                    />
                );
            case 'individual':
                return (
                    <div className="flex-1 p-6">
                        <header className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-[#1A365D] uppercase">Individual Operations</h2>
                            <button 
                                onClick={() => setShowConsolidatedLifecycle(true)}
                                className="px-4 py-2 bg-[#2AAA52] text-white rounded-lg text-[10px] font-black uppercase shadow-lg shadow-green-900/20"
                            >
                                Lifecycle Master Plan
                            </button>
                        </header>
                        {/* Division Mapping Logic Here */}
                    </div>
                );
            case 'survey-insights': 
                return <SurveyInsights />; 
            case 'pathways': 
                return <TrainingPathwaysDashboard agencyType={agencyType} setAgencyType={setAgencyType} agencyName={agencyName} setAgencyName={setAgencyName} onSelectCategory={()=>{}} onGeneratePlan={()=>{}} onShowAutomatedLndReport={()=>{}} onShowProjectionReport={()=>{}} />;
            case 'gesi': 
                return <GesiPolicyToolkit onShowGesiAnalysis={() => setShowGesiAnalysis(true)} />;
            case 'cna': 
                return <CnaPolicyToolkit />;
            case 'settings': 
                return <SystemSettings />;
            default: 
                return null;
        }
    };

    if (!isLoggedIn) return <LoginPage onLoginSuccess={handleLoginSuccess} />;

    return (
        <div className="flex h-screen bg-[#F4F7F9] overflow-hidden">
            <Sidebar 
                currentView={currentView} 
                setCurrentView={handleNavigate} 
                onImportClick={() => setShowImportModal(true)} 
                onHelpClick={() => {}} 
                onShowLndAiAssistant={() => {}} 
                onLogout={handleLogout} 
                onShowPowerBi={() => {}} 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            
            <main className="flex-1 overflow-y-auto relative bg-transparent custom-scrollbar">
                {renderCurrentView()}
            </main>

            {/* MODALS */}
            {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} onViewPolicy={() => handleNavigate('cna')} />}
            {showImportModal && <ImportModal onImport={handleImport} onClose={() => setShowImportModal(false)} />}
            {showAiAnalysis && <AutomatedOrganisationalAnalysisReport data={officerData} establishmentData={establishmentData} agencyType={agencyType} agencyName={agencyName} corporatePlanContext={corporatePlanContext} onClose={() => setShowAiAnalysis(false)} />}
            {showFiveYearPlan && <FiveYearPlanReport data={officerData} establishmentData={establishmentData} agencyType={agencyType} agencyName={agencyName} onClose={() => setShowFiveYearPlan(false)} />}
            {showSuccessionPlan && <SuccessionPlanReport data={officerData} establishmentData={establishmentData} agencyName={agencyName} onClose={() => setShowSuccessionPlan(false)} />}
            {showConsolidatedLifecycle && <ConsolidatedLifecyclePlanReport data={officerData} agencyName={agencyName} onClose={() => setShowConsolidatedLifecycle(false)} />}
        </div>
    );
};

export default App;