import * as XLSX from 'xlsx';
import { StructuredCorporatePlan } from '../types';

/**
 * Parses an Excel (.xlsx) Corporate Plan file and extracts structured data.
 * Reads the first sheet and maps the first row to the StructuredCorporatePlan interface.
 * 
 * Expected column headers in the first row:
 * - Vision
 * - Mission
 * - Objectives (comma-separated or newline-separated)
 * - Training Needs
 * - Financial Context
 * - Risk Assessment
 * - Personnel Establishment
 * 
 * @param file - The Excel file to parse
 * @returns Promise<StructuredCorporatePlan> - The parsed corporate plan data
 */
export const parseCorporatePlanExcel = async (file: File): Promise<StructuredCorporatePlan> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          throw new Error('Failed to read file');
        }

        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1
        }) as (string | number | boolean | null | undefined)[][];

        if (jsonData.length === 0) {
          throw new Error('Excel file is empty');
        }

        // Get the first row as headers
        const headers = jsonData[0].map(h => String(h).trim().toLowerCase());
        
        // Get the second row as values (if exists)
        const values = jsonData[1] || [];

        // Create a mapping of header to value
        const rowData: Record<string, string> = {};
        headers.forEach((header, index) => {
          rowData[header] = values[index] ? String(values[index]) : '';
        });

        // Get values with fallbacks - use 'Not found' for required strategic fields
        const vision = rowData['vision'] || rowData['vission'] || '';
        const mission = rowData['mission'] || '';
        const objectivesRaw = rowData['objectives'] || rowData['objective'] || '';
        
        // Get optional fields - default to empty string if not found
        const trainingNeeds = rowData['training needs'] || rowData['training'] || '';
        const financialContext = rowData['financial context'] || rowData['financial'] || rowData['financial_context'] || '';
        const riskAssessment = rowData['risk assessment'] || rowData['risk'] || rowData['risk_assessment'] || '';
        const personnelEstablishment = rowData['personnel establishment'] || rowData['personnel'] || rowData['personnel_establishment'] || '';

        // Map to StructuredCorporatePlan interface
        const structuredPlan: StructuredCorporatePlan = {
          strategic_goals: {
            vision: vision || 'Not found',
            mission: mission || 'Not found',
            objectives: parseObjectives(objectivesRaw).length > 0 ? parseObjectives(objectivesRaw) : ['Not found']
          },
          training_needs: trainingNeeds,
          financial_context: financialContext,
          risk_assessment: riskAssessment,
          personnel_establishment: personnelEstablishment
        };

        resolve(structuredPlan);
      } catch (error: any) {
        reject(new Error('Failed to parse Excel file: ' + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Parses objectives from a string that may be comma-separated, newline-separated,
 * or semicolon-separated into an array of strings.
 */
const parseObjectives = (objectivesString: string): string[] => {
  if (!objectivesString) {
    return [];
  }

  // Split by common delimiters: comma, newline, semicolon
  const objectives = objectivesString
    .split(/[,;\n]+/)
    .map(obj => obj.trim())
    .filter(obj => obj.length > 0);

  return objectives;
};

export default parseCorporatePlanExcel;
