/**
 * PNG National CNA Application - 2026
 * Fixed Type Scoping & Device Detection
 */

import React, { useState, useEffect } from 'react';
import type { JSX } from 'react'; 

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
import { LoginPage } from './components/LoginPage'; // Corrected Named Import
import { PowerBiModal } from './components/PowerBiModal';
import { WelcomeModal } from './components/WelcomeModal';
import { TrainingPathwaysDashboard } from './components/TrainingPathwaysDashboard';
import { TrainingCategoryModal } from './components/TrainingCategoryModal';
import { CompetencyProjectionReport } from './components/CompetencyProjectionReport';
import { ItemLevelAnalysisReport } from './components/ItemLevelAnalysisReport';
import { CertificateOfCompliance } from './components/CertificateOfCompliance';
import { SystemSettings } from './components/SystemSettings';
import { SurveyInsights } from './components/SurveyInsights';

// --- TYPES & DATA ---
import { OfficerRecord, AgencyType, EstablishmentRecord, GradingGroup, UrgencyLevel, QUESTION_TEXT_MAPPING } from './types';
import { INITIAL_CNA_DATASET } from './constants';
import { ESTABLISHMENT_DATA } from './data/establishment';
import { exportToXlsx } from './utils/export';
import { DevelopmentPathwaysReport } from './components/DevelopmentPathwaysReport';

// --- CONSTANTS & TYPES ---
const OFFICER_DATA_KEY = 'cna_officerData';
const RAW_RESPONSE_COUNT_KEY = 'cna_rawResponseCount';
const ESTABLISHMENT_DATA_KEY = 'cna_establishmentData';
const AGENCY_TYPE_KEY = 'cna_agencyType';
const AGENCY_NAME_KEY = 'cna_agencyName';
const CORP_PLAN_CONTEXT_KEY = 'cna_corpPlanContext';

type View = 'organisational' | 'individual' | 'pathways' | 'gesi' | 'cna' | 'settings' | 'survey-insights';
type OrgTab = 'diagnostic' | 'overview' | 'divisional';

const deDuplicateOfficers = (officers: OfficerRecord[]): OfficerRecord[] => {
    const uniqueOfficersMap = new Map<string, OfficerRecord>();
    const unidentifiedResponses: OfficerRecord[] = [];
    officers.forEach(officer => {
        const email = (officer.email || '').trim().toLowerCase();
        const name = (officer.name || '').trim().toLowerCase();
        const pos = (officer.position || '').trim().toLowerCase();
        const key = email || (name && pos ? `${name}-${pos}` : null);
        if (key && key !== '-') uniqueOfficersMap.set(key, officer);
        else unidentifiedResponses.push(officer);
    });
    return [...Array.from(uniqueOfficersMap.values()), ...unidentifiedResponses];
};

const App: React.FC = () => {
    // --- DEVICE DETECTION ---
    const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

    // --- AUTHENTICATION ---
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => 
        sessionStorage.getItem('isCnaAppLoggedIn') === 'true'
    );

    // --- NAVIGATION & MODALS ---
    const [showWelcome, setShowWelcome] = useState<boolean>(false);
    const [currentView, setCurrentView] = useState<View>('organisational');
    const [activeOrgTab, setActiveOrgTab] = useState<OrgTab>('diagnostic');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Modal Visibility
    const [showImportModal, setShowImportModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showLndAiAssistant, setShowLndAiAssistant] = useState(false);
    const [showPowerBiModal, setShowPowerBiModal] = useState(false);
    const [showAiAnalysis, setShowAiAnalysis] = useState(false);
    const [showFiveYearPlan, setShowFiveYearPlan] = useState(false);
    const [showCompetencyReport, setShowCompetencyReport] = useState(false);
    const [showGapAnalysis, setShowGapAnalysis] = useState(false);
    const [showTalentSegmentation, setShowTalentSegmentation] = useState(false);
    const [showStrategicRecs, setShowStrategicRecs] = useState(false);
    const [showWorkforceSnapshot, setShowWorkforceSnapshot] = useState(false);
    const [showDetailedCapability, setShowDetailedCapability] = useState(false);
    const [showEligibleOfficers, setShowEligibleOfficers] = useState(false);
    const [showAnnualPlan, setShowAnnualPlan] = useState(false);
    const [showConsolidatedPlan, setShowConsolidatedPlan] = useState(false);
    const [showSuccessionPlan, setShowSuccessionPlan] = useState(false);
    const [showGesiAnalysis, setShowGesiAnalysis] = useState(false);
    const [showItemLevelAnalysis, setShowItemLevelAnalysis] = useState(false);
    const [showComplianceCertificate, setShowComplianceCertificate] = useState(false);
    const [showDevelopmentPathways, setShowDevelopmentPathways] = useState(false);
    const [showEvidenceMasterTable, setShowEvidenceMasterTable] = useState(false);
    const [showConsolidatedLifecycle, setShowConsolidatedLifecycle] = useState(false);
    const [showTrainingCategory, setShowTrainingCategory] = useState<string | null>(null);
    const [showProjectionReport, setShowProjectionReport] = useState(false);
    const [selectedOfficerForLndPlan, setSelectedOfficerForLndPlan] = useState<OfficerRecord | null>(null);
    const [selectedOfficerForPathway, setSelectedOfficerForPathway] = useState<OfficerRecord | null>(null);

    // --- DATA HANDLING ---
    const getFromStorage = <T,>(key: string, defaultValue: T): T => {
        try {
            const saved = localStorage.getItem(key);
            if (saved) return JSON.parse(saved);
        } catch (error) { console.error(`Storage Error:`, error); }
        return defaultValue;
    };

    const [officerData, setOfficerData] = useState<OfficerRecord[]>(() => deDuplicateOfficers(getFromStorage(OFFICER_DATA_KEY, INITIAL_CNA_DATASET)));
    const [rawResponseCount, setRawResponseCount] = useState<number>(() => getFromStorage(RAW_RESPONSE_COUNT_KEY, officerData.length));
    const [establishmentData, setEstablishmentData] = useState<EstablishmentRecord[]>(() => getFromStorage(ESTABLISHMENT_DATA_KEY, ESTABLISHMENT_DATA));
    const [agencyType, setAgencyType] = useState<AgencyType>(() => getFromStorage(AGENCY_TYPE_KEY, 'National Agency'));
    const [agencyName, setAgencyName] = useState<string>(() => getFromStorage(AGENCY_NAME_KEY, 'Department of Personnel Management'));
    const [corporatePlanContext, setCorporatePlanContext] = useState<string>(() => getFromStorage(CORP_PLAN_CONTEXT_KEY, ''));

    // --- EFFECTS ---
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) setDeviceType('mobile');
            else if (width < 1024) setDeviceType('tablet');
            else setDeviceType('desktop');
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => { if (isLoggedIn) setShowWelcome(true); }, [isLoggedIn]);

    // --- HANDLERS ---
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

    const updateAndStore = <T,>(setter: any, key: string) => (newValue: T | ((prevState: T) => T)) => {
        setter((prev: T) => {
            const val = newValue instanceof Function ? newValue(prev) : newValue;
            localStorage.setItem(key, JSON.stringify(val));
            return val;
        });
    };
    
    const handleSetOfficerData = updateAndStore(setOfficerData, OFFICER_DATA_KEY);
    const handleSetRawCount = updateAndStore(setRawResponseCount, RAW_RESPONSE_COUNT_KEY);
    const handleSetAgencyType = updateAndStore(setAgencyType, AGENCY_TYPE_KEY);
    const handleSetAgencyName = updateAndStore(setAgencyName, AGENCY_NAME_KEY);
    const handleSetEstablishmentData = updateAndStore(setEstablishmentData, ESTABLISHMENT_DATA_KEY);
    const handleSetCorpPlanContext = updateAndStore(setCorporatePlanContext, CORP_PLAN_CONTEXT_KEY);
    
    const handleImport = (newData: OfficerRecord[], newType: AgencyType, newName: string, newEst?: EstablishmentRecord[], cp?: string) => {
        handleSetRawCount(newData.length);
        handleSetOfficerData(deDuplicateOfficers(newData));
        handleSetAgencyType(newType);
        handleSetAgencyName(newName);
        if (newEst) handleSetEstablishmentData(newEst);
        if (cp) handleSetCorpPlanContext(cp);
        setShowImportModal(false);
    };

    const handleExportAllParticipants = () => {
        const kpiCodes = Object.keys(QUESTION_TEXT_MAPPING);
        const headers = ['Source ID', 'Name', 'Division', 'Position', 'Grade', 'SPA Rating', ...kpiCodes];
        const rows = officerData.map(o => [o.email || '-', o.name, o.division, o.position, o.grade, o.spaRating, ...kpiCodes.map(c => o.capabilityRatings.find(r => r.questionCode === c)?.currentScore || '')]);
        exportToXlsx({ title: 'Consolidated Report', sections: [{ title: 'Dataset', content: [{ type: 'table', headers, rows }], orientation: 'landscape' }] });
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
                        onShowWorkforceSnapshot={() => setShowWorkforceSnapshot(true)}
                        onShowDetailedCapability={() => setShowDetailedCapability(true)}
                        onShowEligibleOfficers={() => setShowEligibleOfficers(true)}
                        onShowAnnualPlan={() => setShowAnnualPlan(true)}
                        onShowConsolidatedPlan={() => setShowConsolidatedPlan(true)}
                        onShowSuccessionPlan={() => setShowSuccessionPlan(true)}
                        onShowGesiAnalysis={() => setShowGesiAnalysis(true)}
                        onShowItemLevelAnalysis={() => setShowItemLevelAnalysis(true)}
                        onShowComplianceCertificate={() => setShowComplianceCertificate(true)}
                        onShowDevelopmentPathways={() => setShowDevelopmentPathways(true)}
                        onShowEvidenceMasterTable={() => setShowEvidenceMasterTable(true)}
                    />
                );
            case 'individual':
                const grouped = officerData.reduce((acc, o) => { 
                    const d = o.division || 'Unassigned'; 
                    if (!acc[d]) acc[d] = []; 
                    acc[d].push(o); 
                    return acc; 
                }, {} as Record<string, OfficerRecord[]>);
                return (
                    <div className="flex-1 flex flex-col bg-transparent">
                        <header className="p-4 md:p-6 bg-white/80 backdrop-blur-sm border-b border-[#E0E4E8] shadow-sm z-10 no-print">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h1 className="text-xl font-black text-[#2C3E50] uppercase">Individual Operations</h1>
                                    <p className="text-[10px] font-bold text-[#1A365D]/60 uppercase tracking-widest">Monitoring & Development</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setShowConsolidatedLifecycle(true)} className="h-9 px-4 bg-[#2AAA52] text-white rounded-lg text-[10px] font-black uppercase">Consolidated Plan</button>
                                    <button onClick={handleExportAllParticipants} className="h-9 px-4 bg-[#1A365D] text-white rounded-lg text-[10px] font-bold uppercase">Export Report</button>
                                </div>
                            </div>
                        </header>
                        <div className="p-6 space-y-6">
                            {Object.entries(grouped).map(([name, officers]) => (
                                <DivisionGroup 
                                    key={name} 
                                    divisionName={name} 
                                    officers={officers} 
                                    onViewSummary={setSelectedOfficerForLndPlan} 
                                    onSuggestTraining={setSelectedOfficerForPathway} 
                                    loadingSuggestionsFor={null} 
                                />
                            ))}
                        </div>
                    </div>
                );
            case 'pathways': return <TrainingPathwaysDashboard agencyType={agencyType} setAgencyType={handleSetAgencyType} agencyName={agencyName} setAgencyName={handleSetAgencyName} onSelectCategory={setShowTrainingCategory} onGeneratePlan={() => setShowAnnualPlan(true)} onShowAutomatedLndReport={() => {}} onShowProjectionReport={() => setShowProjectionReport(true)} />;
            case 'survey-insights': return <SurveyInsights />;
            case 'gesi': return <GesiPolicyToolkit onShowGesiAnalysis={() => setShowGesiAnalysis(true)} />;
            case 'cna': return <CnaPolicyToolkit />;
            case 'settings': return <SystemSettings />;
            default: return null;
        }
    };
    
    // --- FINAL RENDER ---
    if (!isLoggedIn) return <LoginPage onLoginSuccess={handleLoginSuccess} />;

    return (
        <div className={`flex h-screen bg-[#F4F7F9] overflow-hidden relative ${deviceType}`}>
            
            {/* SIDEBAR NAVIGATION */}
            <Sidebar 
                currentView={currentView} 
                setCurrentView={handleNavigate} 
                onImportClick={() => setShowImportModal(true)} 
                onHelpClick={() => setShowHelpModal(true)} 
                onShowLndAiAssistant={() => setShowLndAiAssistant(true)} 
                onLogout={handleLogout} 
                onShowPowerBi={() => setShowPowerBiModal(true)} 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            
            <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10 bg-transparent">
                {deviceType === 'mobile' && (
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="fixed top-4 left-4 z-[60] p-2 bg-white rounded-lg shadow-lg border border-slate-200"
                    >
                        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    </button>
                )}

                <main className={`flex-1 overflow-y-auto relative bg-transparent custom-scrollbar ${deviceType === 'mobile' ? 'pt-16' : ''}`}>
                    <div className="relative z-20 min-h-full">
                        {renderCurrentView()}
                    </div>
                </main>
            </div>

            {/* MODALS */}
            {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} onViewPolicy={() => { setShowWelcome(false); handleNavigate('cna'); }} />}
            {showImportModal && <ImportModal onImport={handleImport} onClose={() => setShowImportModal(false)} />}
            {showHelpModal && <UserGuideModal onClose={() => setShowHelpModal(false)} />}
            {showAiAnalysis && <AutomatedOrganisationalAnalysisReport data={officerData} establishmentData={establishmentData} agencyType={agencyType} agencyName={agencyName} corporatePlanContext={corporatePlanContext} onClose={() => setShowAiAnalysis(false)} />}
            {selectedOfficerForLndPlan && <IndividualDevelopmentProfile officer={selectedOfficerForLndPlan} agencyName={agencyName} onClose={() => setSelectedOfficerForLndPlan(null)} />}
            {selectedOfficerForPathway && <TrainingPathwaysReport officer={selectedOfficerForPathway} agencyName={agencyName} onClose={() => setSelectedOfficerForPathway(null)} />}
            {showFiveYearPlan && <FiveYearPlanReport data={officerData} establishmentData={establishmentData} agencyType={agencyType} agencyName={agencyName} onClose={() => setShowFiveYearPlan(false)} />}
            {showCompetencyReport && <CompetencyDomainReport data={officerData} establishmentData={establishmentData} agencyType={agencyType} agencyName={agencyName} onClose={() => setShowCompetencyReport(false)} />}
            {showGapAnalysis && <CapabilityGapAnalysisReport data={officerData} agencyType={agencyType} agencyName={agencyName} onClose={() => setShowGapAnalysis(false)} />}
            {showTalentSegmentation && <TalentSegmentationReport data={officerData} agencyType={agencyType} agencyName={agencyName} onClose={() => setShowTalentSegmentation(false)} />}
            {showStrategicRecs && <StrategicRecommendationsReport data={officerData} establishmentData={establishmentData} agencyType={agencyType} agencyName={agencyName} onClose={() => setShowStrategicRecs(false)} />}
            {showConsolidatedPlan && <ConsolidatedStrategicPlanReport data={officerData} establishmentData={establishmentData} agencyType={agencyType} agencyName={agencyName} onClose={() => setShowConsolidatedPlan(false)} />}
            {showWorkforceSnapshot && <WorkforceSnapshotReport data={officerData} establishmentData={establishmentData} agencyType={agencyType} agencyName={agencyName} onClose={() => setShowWorkforceSnapshot(false)} />}
            {showDetailedCapability && <DetailedCapabilityBreakdownReport data={officerData} agencyType={agencyType} agencyName={agencyName} onClose={() => setShowDetailedCapability(false)} />}
            {showEligibleOfficers && <EligibleOfficersReport data={officerData} establishmentData={establishmentData} agencyType={agencyType} agencyName={agencyName} corporatePlanContext={corporatePlanContext} onClose={() => setShowEligibleOfficers(false)} />}
            {showAnnualPlan && <AnnualTrainingPlanReport data={officerData} agencyType={agencyType} agencyName={agencyName} onClose={() => setShowAnnualPlan(false)} />}
            {showLndAiAssistant && <LndAiAssistantModal onClose={() => setShowLndAiAssistant(false)} />}
            {showSuccessionPlan && <SuccessionPlanReport data={officerData} establishmentData={establishmentData} agencyName={agencyName} onClose={() => setShowSuccessionPlan(false)} />}
            {showGesiAnalysis && <GesiAnalysisReport data={officerData} establishmentData={establishmentData} agencyName={agencyName} onClose={() => setShowGesiAnalysis(false)} />}
            {showPowerBiModal && <PowerBiModal data={officerData} onClose={() => setShowPowerBiModal(false)} />}
            {showTrainingCategory && <TrainingCategoryModal data={officerData} categoryName={showTrainingCategory} agencyType={agencyType} agencyName={agencyName} onClose={() => setShowTrainingCategory(null)} />}
            {showProjectionReport && <CompetencyProjectionReport data={officerData} onClose={() => setShowProjectionReport(false)} />}
            {showItemLevelAnalysis && <ItemLevelAnalysisReport data={officerData} agencyType={agencyType} agencyName={agencyName} onClose={() => setShowItemLevelAnalysis(false)} />}
            {showComplianceCertificate && <CertificateOfCompliance data={officerData} agencyName={agencyName} onClose={() => setShowComplianceCertificate(false)} />}
            {showDevelopmentPathways && <DevelopmentPathwaysReport data={officerData} agencyName={agencyName} onClose={() => setShowDevelopmentPathways(false)} />}
            {showEvidenceMasterTable && <CnaEvidenceMasterTable data={officerData} establishmentData={establishmentData} agencyName={agencyName} onClose={() => setShowEvidenceMasterTable(false)} />}
            {showConsolidatedLifecycle && <ConsolidatedLifecyclePlanReport data={officerData} agencyName={agencyName} onClose={() => setShowConsolidatedLifecycle(false)} />}
        </div>
    );
};

export default App;