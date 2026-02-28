import React, { useState } from "react";
import { IndividualLndPlanRecord, LndTrainingNeed } from "../types";
import {
  XIcon,
  DocumentArrowUpIcon,
  DocumentIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "./icons";
import { exportToPdf, exportToDocx, ReportData } from "../utils/export";

interface IndividualLndPlanGovernmentReportProps {
  records: IndividualLndPlanRecord[];
  agencyName: string;
  onClose: () => void;
}

// Helper to calculate age from DOB
const calculateAge = (dateOfBirth: string): string => {
  if (!dateOfBirth) return "";
  const dob = new Date(dateOfBirth);
  const today = new Date();
  const age = Math.floor(
    (today.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
  );
  return age.toString();
};

// Format date for display
const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Current date for the report
const getCurrentDate = (): string => {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Helper components for rendering table rows
const LongTermRows: React.FC<{ trainingNeeds: LndTrainingNeed[] }> = ({
  trainingNeeds,
}) => {
  if (trainingNeeds.length === 0) {
    return (
      <tr>
        <td
          className="border border-slate-800 p-2 font-semibold bg-slate-100"
          rowSpan={1}
        >
          A: Long Term
          <br />
          <span className="text-xs font-normal">
            {"[Insert competency gap]"}
          </span>
        </td>
        <td className="border border-slate-800 p-2" rowSpan={1}>
          Essential: {"[Insert required qualification/experience]"}
          <br />
          <span className="text-xs">{"[Insert preferred qualification]"}</span>
        </td>
        <td className="border border-slate-800 p-2"></td>
        <td className="border border-slate-800 p-2"></td>
        <td className="border border-slate-800 p-2"></td>
        <td className="border border-slate-800 p-2 text-center"></td>
        <td className="border border-slate-800 p-2 text-center"></td>
        <td className="border border-slate-800 p-2 text-center"></td>
        <td className="border border-slate-800 p-2 text-center"></td>
        <td className="border border-slate-800 p-2 text-center"></td>
        <td className="border border-slate-800 p-2"></td>
      </tr>
    );
  }

  return (
    <>
      {trainingNeeds.map((need, idx) => (
        <tr key={idx}>
          {idx === 0 && (
            <>
              <td
                className="border border-slate-800 p-2 font-semibold bg-slate-100"
                rowSpan={trainingNeeds.length}
              >
                A: Long Term
                <br />
                <span className="text-xs font-normal">
                  {need.perceivedArea || "[Insert competency gap]"}
                </span>
              </td>
              <td
                className="border border-slate-800 p-2"
                rowSpan={trainingNeeds.length}
              >
                Essential:{" "}
                {need.jobRequirement ||
                  "[Insert required qualification/experience]"}
                <br />
                <span className="text-xs">
                  Desirable: [Insert preferred qualification]
                </span>
              </td>
            </>
          )}
          <td className="border border-slate-800 p-2">{need.proposedCourse}</td>
          <td className="border border-slate-800 p-2">{need.institution}</td>
          <td className="border border-slate-800 p-2">{need.fundingSource}</td>
          {["2026", "2027", "2028", "2029", "2030"].map((year) => (
            <td key={year} className="border border-slate-800 p-2 text-center">
              {need.yearOfCommencement?.toString() === year ? "✓" : ""}
            </td>
          ))}
          <td className="border border-slate-800 p-2">{need.remarks}</td>
        </tr>
      ))}
    </>
  );
};

const ShortTermRows: React.FC<{ trainingNeeds: LndTrainingNeed[] }> = ({
  trainingNeeds,
}) => {
  if (trainingNeeds.length === 0) {
    return (
      <>
        <tr>
          <td
            className="border border-slate-800 p-2 font-semibold bg-slate-100"
            rowSpan={4}
          >
            B: Short Term
          </td>
          <td className="border border-slate-800 p-2" rowSpan={4}>
            Ability to work independently
          </td>
          <td className="border border-slate-800 p-2">
            {"[Insert Skill Gap]"}
          </td>
          <td className="border border-slate-800 p-2"></td>
          <td className="border border-slate-800 p-2"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2"></td>
        </tr>
        <tr>
          <td className="border border-slate-800 p-2">
            {"[Insert Skill Gap]"}
          </td>
          <td className="border border-slate-800 p-2">
            Must be well organised and methodical
          </td>
          <td className="border border-slate-800 p-2"></td>
          <td className="border border-slate-800 p-2"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2"></td>
        </tr>
        <tr>
          <td className="border border-slate-800 p-2">
            {"[Insert Knowledge Gap]"}
          </td>
          <td className="border border-slate-800 p-2">
            Relevant statutory or technical knowledge
          </td>
          <td className="border border-slate-800 p-2"></td>
          <td className="border border-slate-800 p-2"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2"></td>
        </tr>
        <tr>
          <td className="border border-slate-800 p-2">
            {"[Insert Knowledge Gap]"}
          </td>
          <td className="border border-slate-800 p-2">
            Workplace Health & Safety requirements
          </td>
          <td className="border border-slate-800 p-2"></td>
          <td className="border border-slate-800 p-2"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2 text-center"></td>
          <td className="border border-slate-800 p-2"></td>
        </tr>
      </>
    );
  }

  return (
    <>
      {trainingNeeds.map((need, idx) => (
        <tr key={idx}>
          {idx === 0 && (
            <>
              <td
                className="border border-slate-800 p-2 font-semibold bg-slate-100"
                rowSpan={trainingNeeds.length}
              >
                B: Short Term
              </td>
              <td
                className="border border-slate-800 p-2"
                rowSpan={trainingNeeds.length}
              >
                Ability to work independently
              </td>
            </>
          )}
          <td className="border border-slate-800 p-2">{need.proposedCourse}</td>
          <td className="border border-slate-800 p-2">{need.institution}</td>
          <td className="border border-slate-800 p-2">{need.fundingSource}</td>
          {["2026", "2027", "2028", "2029", "2030"].map((year) => (
            <td key={year} className="border border-slate-800 p-2 text-center">
              {need.yearOfCommencement?.toString() === year ? "✓" : ""}
            </td>
          ))}
          <td className="border border-slate-800 p-2">{need.remarks}</td>
        </tr>
      ))}
    </>
  );
};

export const IndividualLndPlanGovernmentReport: React.FC<
  IndividualLndPlanGovernmentReportProps
> = ({ records, agencyName, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentRecord = records[currentIndex];

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(records.length - 1, prev + 1));

  // Generate the government template report data
  const getGovernmentTemplateData = (
    record: IndividualLndPlanRecord,
  ): ReportData => {
    // Create table rows for training needs - grouped by year
    const yearColumns = ["2026", "2027", "2028", "2029", "2030"];

    // Long term needs (Qualifications & Experience)
    const longTermRows = (record.trainingNeeds?.longTerm || []).map((need) => {
      const row: (string | number)[] = [
        need.perceivedArea || "",
        need.jobRequirement || "",
        need.proposedCourse || "",
        need.institution || "",
        need.fundingSource || "",
      ];
      // Add year columns
      yearColumns.forEach((year) => {
        row.push(need.yearOfCommencement?.toString() === year ? "✓" : "");
      });
      row.push(need.remarks || "");
      return row;
    });

    // Short term needs (Skills & Knowledge)
    const shortTermRows = (record.trainingNeeds?.shortTerm || []).map(
      (need) => {
        const row: (string | number)[] = [
          need.perceivedArea || "",
          need.jobRequirement || "",
          need.proposedCourse || "",
          need.institution || "",
          need.fundingSource || "",
        ];
        // Add year columns
        yearColumns.forEach((year) => {
          row.push(need.yearOfCommencement?.toString() === year ? "✓" : "");
        });
        row.push(need.remarks || "");
        return row;
      },
    );

    // Combine all rows
    const tableHeaders = [
      "Perceived Areas of Training",
      "Job Requirements",
      "Proposed Training Courses",
      "Institution",
      "Funding Source",
      "2026",
      "2027",
      "2028",
      "2029",
      "2030",
      "Remarks",
    ];

    return {
      title: `Individual Learning & Development Plan - ${record.officerName}`,
      sections: [
        {
          title: "OFFICER DETAILS",
          content: [
            {
              type: "table",
              headers: ["Field", "Value"],
              rows: [
                [
                  "DEPARTMENT / AGENCY / ORGANISATION NAME",
                  record.organizationName ||
                    agencyName ||
                    "[DEPARTMENT / AGENCY / ORGANISATION NAME]",
                ],
                ["DIVISION", record.division || "[Insert Division]"],
                ["NAME", record.officerName || "[Officer Full Name]"],
                ["POSITION NUMBER", record.positionNumber || "[Position Code]"],
                ["DESIGNATION", record.designation || "[Job Title]"],
                [
                  "DATE OF BIRTH",
                  record.dateOfBirth
                    ? formatDate(record.dateOfBirth)
                    : "[Insert DOB]",
                ],
                [
                  "COMMENCEMENT DATE",
                  record.commencementDate
                    ? formatDate(record.commencementDate)
                    : "[Insert Date]",
                ],
                [
                  "HIGHEST QUALIFICATION",
                  record.highestQualification || "[Insert Qualification]",
                ],
                [
                  "OFFICER STATUS",
                  record.officerStatus
                    ? `${record.officerStatus} | ${record.gradeLevel || ""} | ${record.positionNumber || ""}`
                    : "[Confirmed / Acting / Probation | Grade | Position Code]",
                ],
              ],
            },
          ],
        },
        {
          title: "TRAINING NEEDS ANALYSIS",
          content: [
            {
              type: "table",
              headers: tableHeaders,
              rows: [
                // Section A: Long Term (Qualifications & Experience)
                ...(longTermRows.length > 0
                  ? longTermRows
                  : [
                      [
                        "[Insert competency gap]",
                        "Essential: [Insert required qualification/experience]",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                      ],
                    ]),
                // Section B: Short Term (Skills)
                ...(shortTermRows.length > 0
                  ? shortTermRows
                  : [
                      [
                        "[Insert Skill Gap]",
                        "Ability to work independently",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                      ],
                      [
                        "[Insert Skill Gap]",
                        "Must be well organised and methodical",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                      ],
                      [
                        "[Insert Knowledge Gap]",
                        "Relevant statutory or technical knowledge",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                      ],
                      [
                        "[Insert Knowledge Gap]",
                        "Workplace Health & Safety requirements",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                      ],
                    ]),
              ],
            },
          ],
        },
        {
          title: "PERFORMANCE & SUCCESSION ASSESSMENT",
          content: [
            {
              type: "table",
              headers: ["Assessment Area", "Value"],
              rows: [
                [
                  "Age",
                  record.ageGroup ||
                    calculateAge(record.dateOfBirth) ||
                    "[Insert Age]",
                ],
                [
                  "Current Performance Rating",
                  record.performanceLevel ||
                    "E – Excellent (86–100%) | S – Satisfactory (50–85%) | U – Unsatisfactory (0–49%)",
                ],
                [
                  "Promotion Potential",
                  record.promotionPotential ||
                    "OP – Overdue for Promotion | PN – Promotion Now | ND – Needs Development | NP – Not Promotable",
                ],
              ],
            },
          ],
        },
      ],
    };
  };

  const handleExportPdf = () => {
    if (!currentRecord) return;
    const reportData = getGovernmentTemplateData(currentRecord);
    exportToPdf(reportData);
  };

  const handleExportDocx = () => {
    if (!currentRecord) return;
    const reportData = getGovernmentTemplateData(currentRecord);
    exportToDocx(reportData);
  };

  // Render the government template in the UI
  const renderGovernmentTemplate = (record: IndividualLndPlanRecord) => {
    const age = record.ageGroup || calculateAge(record.dateOfBirth);

    return (
      <div className="bg-white p-8 max-w-4xl mx-auto text-sm">
        {/* Header */}
        <div className="text-center mb-6 border-b-2 border-slate-800 pb-4">
          <h1 className="text-lg font-bold uppercase">
            {record.organizationName ||
              agencyName ||
              "[DEPARTMENT / AGENCY / ORGANISATION NAME]"}
          </h1>
          <h2 className="text-md font-bold uppercase mt-1">
            INDIVIDUAL LEARNING & DEVELOPMENT PLAN
          </h2>
          <p className="text-sm">2026 – 2030</p>
          <p className="text-xs text-slate-600">As at {getCurrentDate()}</p>
        </div>

        {/* Officer Details Table */}
        <table className="w-full mb-6 border-collapse text-sm">
          <tbody>
            <tr>
              <td className="py-1 font-semibold w-1/3">DIVISION:</td>
              <td className="py-1">{record.division || "[Insert Division]"}</td>
            </tr>
            <tr>
              <td className="py-1 font-semibold">NAME:</td>
              <td className="py-1">
                {record.officerName || "[Officer Full Name]"}
              </td>
            </tr>
            <tr>
              <td className="py-1 font-semibold">POSITION NUMBER:</td>
              <td className="py-1">
                {record.positionNumber || "[Position Code]"}
              </td>
            </tr>
            <tr>
              <td className="py-1 font-semibold">DESIGNATION:</td>
              <td className="py-1">{record.designation || "[Job Title]"}</td>
            </tr>
            <tr>
              <td className="py-1 font-semibold">DATE OF BIRTH:</td>
              <td className="py-1">
                {record.dateOfBirth
                  ? formatDate(record.dateOfBirth)
                  : "[Insert DOB]"}
              </td>
            </tr>
            <tr>
              <td className="py-1 font-semibold">COMMENCEMENT DATE:</td>
              <td className="py-1">
                {record.commencementDate
                  ? formatDate(record.commencementDate)
                  : "[Insert Date]"}
              </td>
            </tr>
            <tr>
              <td className="py-1 font-semibold">HIGHEST QUALIFICATION:</td>
              <td className="py-1">
                {record.highestQualification || "[Insert Qualification]"}
              </td>
            </tr>
            <tr>
              <td className="py-1 font-semibold">OFFICER STATUS:</td>
              <td className="py-1">
                {record.officerStatus
                  ? `${record.officerStatus} | ${record.gradeLevel || ""} | ${record.positionNumber || ""}`
                  : "[Confirmed / Acting / Probation | Grade | Position Code]"}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Training Needs Section */}
        <div className="mb-6">
          <h3 className="font-bold text-center mb-2">
            TRAINING NEEDS ANALYSIS
          </h3>
          <table className="w-full border-collapse border border-slate-800 text-xs">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-slate-800 p-2 text-left">
                  Perceived Areas of Training
                </th>
                <th className="border border-slate-800 p-2 text-left">
                  Job Requirements
                </th>
                <th className="border border-slate-800 p-2 text-left">
                  Proposed Training Courses
                </th>
                <th className="border border-slate-800 p-2 text-left">
                  Institution
                </th>
                <th className="border border-slate-800 p-2 text-left">
                  Funding Source
                </th>
                <th className="border border-slate-800 p-2 text-center w-12">
                  2026
                </th>
                <th className="border border-slate-800 p-2 text-center w-12">
                  2027
                </th>
                <th className="border border-slate-800 p-2 text-center w-12">
                  2028
                </th>
                <th className="border border-slate-800 p-2 text-center w-12">
                  2029
                </th>
                <th className="border border-slate-800 p-2 text-center w-12">
                  2030
                </th>
                <th className="border border-slate-800 p-2 text-left">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Section A: Long Term */}
              <LongTermRows
                trainingNeeds={record.trainingNeeds?.longTerm || []}
              />

              {/* Section B: Short Term */}
              <ShortTermRows
                trainingNeeds={record.trainingNeeds?.shortTerm || []}
              />
            </tbody>
          </table>
        </div>

        {/* Performance & Succession Assessment */}
        <div className="mb-6">
          <h3 className="font-bold text-center mb-2">
            PERFORMANCE & SUCCESSION ASSESSMENT (Based on SPA)
          </h3>
          <table className="w-full border-collapse border border-slate-800 text-sm">
            <tbody>
              <tr>
                <td className="border border-slate-800 p-2 font-semibold w-1/3">
                  Age:
                </td>
                <td className="border border-slate-800 p-2">
                  {age || "[Insert Age]"}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-800 p-2 font-semibold">
                  Current Performance Rating:
                </td>
                <td className="border border-slate-800 p-2">
                  {record.performanceLevel ||
                    "E – Excellent (86–100%) | S – Satisfactory (50–85%) | U – Unsatisfactory (0–49%)"}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-800 p-2 font-semibold">
                  Promotion Potential:
                </td>
                <td className="border border-slate-800 p-2">
                  {record.promotionPotential ||
                    "OP – Overdue for Promotion | PN – Promotion Now | ND – Needs Development | NP – Not Promotable"}
                </td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-600 mt-1">
            Note: Assessment Based on Staff Performance Appraisal (SPA)
          </p>
        </div>
      </div>
    );
  };

  if (records.length === 0) {
    return (
      <div
        className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start p-4 pt-12 animate-fade-in"
        aria-modal="true"
        role="dialog"
      >
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Individual L&D Plan - Government Template
            </h1>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <XIcon className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </button>
          </header>
          <main className="p-8 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              No individual L&D plans available. Please create plans in the
              Individual L&D Plan form first.
            </p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start p-4 pt-12 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-slate-100 dark:bg-slate-900 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <DocumentArrowUpIcon className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Individual L&D Plan - Government Template
            </h1>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              ({currentIndex + 1} of {records.length})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPdf}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              title="Export to PDF"
            >
              <DocumentIcon className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={handleExportDocx}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              title="Export to Word"
            >
              <DocumentArrowUpIcon className="w-4 h-4" />
              DOCX
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 ml-2"
            >
              <XIcon className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 bg-slate-200 dark:bg-slate-800">
          {currentRecord && renderGovernmentTemplate(currentRecord)}
        </main>

        {/* Navigation Footer */}
        <footer className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center flex-shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md"
          >
            <XIcon className="w-4 h-4" />
            Close
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Previous
            </button>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Record {currentIndex + 1} of {records.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === records.length - 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default IndividualLndPlanGovernmentReport;
