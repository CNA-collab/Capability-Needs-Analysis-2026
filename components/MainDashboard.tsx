import React, { useState, useMemo, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { StrategicAnalysisDashboard } from "./StrategicAnalysisDashboard";
import { IndividualTalentCardReport } from "./IndividualTalentCardReport";
import { useAppContext } from "./AppContext";

import {
  UsersIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
} from "./icons";

interface MainDashboardProps {
  onLogout: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ onLogout }) => {
  const { state, setCurrentView } = useAppContext();
  const [] = useState(false);
  const [] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const officers = state.officers.length > 0 ? state.officers : [];
  const establishmentData =
    state.establishmentData.length > 0 ? state.establishmentData : [];
  const corporatePlanData = state.corporatePlanData;
  const aggregatedData = state.aggregatedData;

  const hasImportedData =
    state.officers.length > 0 || state.establishmentData.length > 0;

  const effectiveData = useMemo(() => {
    if (hasImportedData) {
      return {
        agencyName:
          state.corporatePlanData?.strategic_goals?.vision?.substring(0, 30) ||
          "Imported Agency",
        totalStaff: establishmentData.length,
        activeSurveys: officers.length,
        completionRate:
          establishmentData.length > 0
            ? Math.round((officers.length / establishmentData.length) * 100)
            : 0,
        criticalGaps: aggregatedData?.skillGapsCount || 0,
        kpis: {
          establishmentGap: aggregatedData?.vacancyRate || 0,
          baselineScore: aggregatedData?.baselineScore || 0,
          criticalSkillGaps: aggregatedData?.skillGapsCount || 0,
          trainingCompletion: aggregatedData?.participationRate
            ? Math.round(aggregatedData.participationRate * 100)
            : 0,
        },
      };
    }
    return {
      agencyName: "Department of Personnel Management",
      totalStaff: 245,
      activeSurveys: 189,
      completionRate: 77,
      criticalGaps: 23,
      kpis: {
        establishmentGap: 18,
        baselineScore: 6.5,
        criticalSkillGaps: 12,
        trainingCompletion: 10,
      },
    };
  }, [
    hasImportedData,
    state.corporatePlanData,
    establishmentData.length,
    officers.length,
    aggregatedData,
  ]);

  useEffect(() => {
    if (state.error) {
      console.error("Application error:", state.error);
    }
  }, [state.error]);

  const renderView = () => {
    switch (state.currentView) {
      case "dashboard":
        return (
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Workforce Card */}
              <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden hover:shadow-card-hover transition-shadow duration-300">
                <div className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      +12%
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">
                    {effectiveData.totalStaff}
                  </p>
                  <p className="text-sm font-semibold text-slate-500 mt-1">
                    Total Workforce
                  </p>
                </div>
              </div>

              {/* Survey Responses Card */}
              <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden hover:shadow-card-hover transition-shadow duration-300">
                <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-emerald-50 rounded-xl">
                      <UsersIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      {effectiveData.completionRate}%
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">
                    {effectiveData.activeSurveys}
                  </p>
                  <p className="text-sm font-semibold text-slate-500 mt-1">
                    Survey Responses
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Recent Activity
                </h3>
              </div>
              <div className="divide-y divide-slate-50">
                <div className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors duration-200">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      CNA Survey Analysis Completed
                    </p>
                    <p className="text-xs text-slate-500">
                      {effectiveData.activeSurveys} responses processed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "organizational":
        return (
          <StrategicAnalysisDashboard
            agencyName={effectiveData.agencyName}
            cnaData={officers}
            establishmentData={establishmentData}
            corporatePlanData={corporatePlanData || undefined}
            onClose={() => setCurrentView("dashboard")}
          />
        );

      case "individual":
        return renderIndividualView();

      default:
        return <div>Select a view from the sidebar.</div>;
    }
  };

  const renderIndividualView = () => {
    if (selectedItem === "individual-talent-card") {
      return (
        <div className="p-8">
          <button
            onClick={() => setSelectedItem(null)}
            className="mb-6 text-slate-600 hover:text-slate-900"
          >
            ← Back to Individual Operations
          </button>
          <IndividualTalentCardReport
            officer={officers[0]}
            establishmentData={establishmentData}
            onClose={() => setSelectedItem(null)}
          />
        </div>
      );
    }

    return (
      <div className="p-8">
        <h2 className="text-2xl font-black text-slate-900 uppercase mb-4">
          Individual Operations
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-w-[300px]">
            <h3 className="text-lg font-black text-slate-900 uppercase mb-4">
              Reports
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setSelectedItem("individual-talent-card")}
                className="w-full text-left p-3 bg-slate-50 rounded-xl flex items-center gap-3"
              >
                <IdentificationIcon className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Individual Talent Card
                  </h4>
                  <p className="text-xs text-slate-600">
                    Individual talent assessment
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar onLogout={onLogout} currentView={"dashboard"} setView={function (): void {
              throw new Error("Function not implemented.");
          } } isOpen={false} onClose={function (): void {
              throw new Error("Function not implemented.");
          } } />
      <main className="flex-1 overflow-y-auto">{renderView()}</main>
    </div>
  );
};
