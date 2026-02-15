import React, { useState } from 'react';
import { DocumentIcon, ArrowRightIcon, ArrowDownTrayIcon, XIcon } from './icons';
import { parsePDF } from '../utils/pdfParser';
import { extractExecutiveStatement, extractCorporateObjectives, extractNationalPolicyAlignment } from '../utils/corporatePlanAnalyzer';

interface CorporatePlanAnalysis {
  agencyName: string;
  leadershipVision: string;
  coreObjectives: Array<{ title: string; description: string }>;
  frameworkAlignment: string[];
}

export const UniversalCorporatePlanAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<CorporatePlanAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setError(null);
    setLoading(true);

    try {
      const text = await parsePDF(uploadedFile);
      const analysisResult = analyzeCorporatePlan(text);
      setAnalysis(analysisResult);
    } catch (err) {
      setError('Failed to process the document. Please ensure it is a valid PDF.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeCorporatePlan = (text: string): CorporatePlanAnalysis => {
    const agencyName = extractAgencyName(text);
    const leadershipVision = extractExecutiveStatement(text);
    const coreObjectives = extractCorporateObjectives(text);
    const frameworkAlignment = extractNationalPolicyAlignment(text);

    return {
      agencyName,
      leadershipVision,
      coreObjectives,
      frameworkAlignment,
    };
  };

  const extractAgencyName = (text: string): string => {
    const match = text.match(/Agency Name:|Corporate Plan|Annual Report|Title Page/i);
    return match ? match[0].replace(/Agency Name:|Corporate Plan|Annual Report|Title Page/i, '').trim() : 'Unknown Agency';
  };

  const renderAnalysis = () => {
    if (!analysis) return null;

    return (
      <div className="bg-white dark:bg-blue-900/50 rounded-lg shadow-sm border border-gray-200 dark:border-blue-800 p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Analysis Results</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Agency Name:</h3>
            <p className="text-gray-900 dark:text-gray-100">{analysis.agencyName}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Leadership Vision:</h3>
            <p className="text-gray-900 dark:text-gray-100">{analysis.leadershipVision || 'Not found'}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Core Objectives:</h3>
            <ul className="text-gray-900 dark:text-gray-100 space-y-1">
              {analysis.coreObjectives.map((obj, index) => (
                <li key={index}>
                  <strong>{obj.title}:</strong> {obj.description}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Framework Alignment:</h3>
            <p className="text-gray-900 dark:text-gray-100">
              {analysis.frameworkAlignment.length > 0 ? analysis.frameworkAlignment.join(', ') : 'Not found'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
<DocumentIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Universal Corporate Plan Analyzer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload any agency's corporate plan PDF to extract key information
          </p>
        </div>

        <div className="bg-white dark:bg-blue-900/50 rounded-lg shadow-sm border border-gray-200 dark:border-blue-800 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
<label htmlFor="file-upload" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
              <DocumentIcon className="w-5 h-5" />
              {file ? 'File Selected' : 'Select PDF File'}
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            {file && (
              <button
                onClick={() => setFile(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <XIcon className="w-4 h-4" /> Remove File
              </button>
            )}
          </div>

          {loading && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2">
                <ArrowRightIcon className="w-5 h-5 animate-bounce" />
                <span className="text-gray-600">Processing document...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 text-red-600">
<ArrowDownTrayIcon className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {analysis && renderAnalysis()}
        </div>
      </div>
    </div>
  );
};