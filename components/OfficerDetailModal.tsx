import React, { useState } from 'react';
import { OfficerRecord } from '../types';

interface OfficerDetailModalProps {
  officer: OfficerRecord;
  isOpen: boolean;
  onClose: () => void;
}

export const OfficerDetailModal: React.FC<OfficerDetailModalProps> = ({ 
  officer, 
  isOpen, 
  onClose 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchData = async () => {
    setIsLoading(true);
    try {
      // Simulate data fetching - in a real implementation, this would fetch from Baseline_Staff_Data table
      // For now, we'll use the existing officer data
      console.log('Fetching data for officer:', officer.name);
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error fetching officer data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start p-4 pt-12 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-slate-100 dark:bg-slate-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h3 className="text-xl font-black text-[#1A1A40] uppercase tracking-tight">
            Officer Details - {officer.name}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-black uppercase text-slate-400 mb-3">Basic Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Name:</span>
                  <span className="font-medium text-slate-900">{officer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Position:</span>
                  <span className="font-medium text-slate-900">{officer.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Grade:</span>
                  <span className="font-medium text-slate-900">{officer.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Division:</span>
                  <span className="font-medium text-slate-900">{officer.division}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">SPA Rating:</span>
                  <span className="font-medium text-slate-900">{officer.spaRating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Employment Status:</span>
                  <span className="font-medium text-slate-900">{officer.employmentStatus}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black uppercase text-slate-400 mb-3">Performance & Eligibility</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Performance Level:</span>
                  <span className="font-medium text-slate-900">{officer.performanceRatingLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Grading Group:</span>
                  <span className="font-medium text-slate-900">{officer.gradingGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Age:</span>
                  <span className="font-medium text-slate-900">{officer.age || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Years of Experience:</span>
                  <span className="font-medium text-slate-900">{officer.yearsOfExperience || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Lifecycle Stage:</span>
                  <span className="font-medium text-slate-900">{officer.lifecycleStage || 'Assessment Track'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-black uppercase text-slate-400 mb-3">Training & Development</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Technical Capability Gaps:</span>
                <span className="font-medium text-slate-900">
                  {officer.technicalCapabilityGaps && officer.technicalCapabilityGaps.length > 0 
                    ? officer.technicalCapabilityGaps.join(', ') 
                    : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Training History:</span>
                <span className="font-medium text-slate-900">
                  {officer.trainingHistory && officer.trainingHistory.length > 0 
                    ? officer.trainingHistory.length 
                    : 'None'}
                </span>
              </div>
            </div>
          </div>

          {officer.employmentStatus === 'Permanent' && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="text-sm font-black uppercase text-emerald-700 mb-3">
                Eligibility Status
              </h4>
              <p className="text-sm text-emerald-800">
                This officer is <strong>Permanent</strong> and is eligible for training programs.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-200">
                  ✓ Eligible for Training
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-4 border-t border-slate-200">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};