import React, { useMemo } from 'react';
import { EstablishmentMetrics } from '../types';

const AutomatedEstablishmentSummary = ({ data }: { data: EstablishmentMetrics }) => {
  // Logic to calculate percentages for the 10:20:70 breakdown
  const trainingRate = useMemo(() => 
    (data.cnaSubmitted / data.eligibleForTraining) * 100, 
    [data.cnaSubmitted, data.eligibleForTraining]
  );

  const confirmedPercentage = (data.confirmed / data.totalPositions) * 100;
  const vacantPercentage = (data.vacant / data.totalPositions) * 100;

  return (
    <div className="w-full shadow-lg rounded-lg border border-slate-200 bg-white">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">
          Summary of Establishment: {data.divisionName}
        </h2>
      </div>
      <div className="p-6">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-4 py-3 font-bold text-slate-700 border-b border-slate-200">Category</th>
                <th className="px-4 py-3 font-bold text-slate-700 text-right border-b border-slate-200">Count</th>
                <th className="px-4 py-3 font-bold text-slate-700 border-b border-slate-200">Status Indicator</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3 text-slate-700">Total Positions on Establishment</td>
                <td className="px-4 py-3 text-right font-medium text-slate-900">{data.totalPositions}</td>
                <td className="px-4 py-3">
                  <div className="h-2 w-full bg-slate-200 rounded-full" />
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3 text-slate-700">Confirmed (Occupied)</td>
                <td className="px-4 py-3 text-right font-medium text-green-600">{data.confirmed}</td>
                <td className="px-4 py-3">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: `${confirmedPercentage}%` }} 
                  />
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3 text-slate-700">Vacant Positions</td>
                <td className="px-4 py-3 text-right font-medium text-red-600">{data.vacant}</td>
                <td className="px-4 py-3">
                  <div 
                    className="h-2 bg-red-500 rounded-full" 
                    style={{ width: `${vacantPercentage}%` }} 
                  />
                </td>
              </tr>
              <tr className="bg-blue-50/50 border-b border-slate-100">
                <td className="px-4 py-3 font-semibold text-blue-700">Officers Eligible for Training</td>
                <td className="px-4 py-3 text-right font-bold text-blue-700">{data.eligibleForTraining}</td>
                <td className="px-4 py-3 text-sm text-slate-500">Baseline for 10:20:70 Model</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">CNA Questionnaires Submitted</td>
                <td className="px-4 py-3 text-right font-medium text-slate-900">{data.cnaSubmitted}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    trainingRate > 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {trainingRate.toFixed(1)}% Participation
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legend for 10:20:70 Model */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
          <div className="p-3 border rounded bg-green-50">
            <p className="text-gray-500">CNA Submitted</p>
            <div className="h-4 w-4 bg-green-500 mx-auto rounded-sm mt-1" />
          </div>
          <div className="p-3 border rounded bg-yellow-50">
            <p className="text-gray-500">Not Yet Submitted</p>
            <div className="h-4 w-4 bg-yellow-400 mx-auto rounded-sm mt-1" />
          </div>
          <div className="p-3 border rounded bg-red-50">
            <p className="text-gray-500">Ineligible (Vacant/STC)</p>
            <div className="h-4 w-4 bg-red-600 mx-auto rounded-sm mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedEstablishmentSummary;
