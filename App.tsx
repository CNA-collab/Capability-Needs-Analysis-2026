import React, { useState } from 'react';
import { View, OfficerRecord } from './types';

// Component Imports
import { CnaHome } from './components/CnaHome';
import { SurveyInsights } from './components/SurveyInsights';
import { Sidebar } from './components/Sidebar';
import { StrategicAnalysisDashboard } from './components/StrategicAnalysisDashboard';

const App: React.FC = () => {
  // 1. STATE MANAGEMENT
  const [currentView, setCurrentView] = useState<View>('cna');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 2. DATA (Imported baseline data for Survey Insights)
  const [agencyData] = useState({
    agencyName: "Department of National Planning & Monitoring",
    kpis: {
      establishmentGap: 18,
      baselineScore: 6.5,
      criticalSkillGaps: 12,
      trainingCompletion: 10 
    }
  });

  // Sample data to satisfy SurveyInsights and Dashboard requirements
  const [officers] = useState<OfficerRecord[]>([]);

  // 3. HANDLERS
  const handleRunAiDiagnostic = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setCurrentView('survey-insights');
    }, 2500);
  };

  // 4. VIEW DRAWER
  const renderView = () => {
    switch (currentView) {
      case 'cna':
        return (
          <CnaHome 
            agencyName={agencyData.agencyName}
            kpis={agencyData.kpis}
            onRunAI={handleRunAiDiagnostic}
          />
        );
      case 'survey-insights':
        return (
          <SurveyInsights 
            officers={officers} 
            baselineData={agencyData} 
          />
        );
      case 'organisational':
        return (
          <StrategicAnalysisDashboard 
            agencyName={agencyData.agencyName}
            cnaData={officers}
            establishmentData={[]} 
            onClose={() => setCurrentView('cna')}
          />
        );
      default:
        return (
          <div className="p-20 text-center">
            <h2 className="text-2xl font-bold text-slate-300 uppercase tracking-widest">Section Under Development</h2>
            <p className="text-slate-400 mt-2">Integrating 10:20:70 Framework...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar 
        currentView={currentView}
        setView={setCurrentView} 
        isOpen={false} 
        onClose={() => {}} 
      />

      <main className="flex-1 overflow-y-auto">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-center">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Scanning Organisational DNA</h2>
              <p className="text-slate-500 text-sm font-medium">Aligning 10:20:70 Learning Framework...</p>
            </div>
          </div>
        ) : (
          renderView()
        )}
      </main>
    </div>
  );
};

export default App;