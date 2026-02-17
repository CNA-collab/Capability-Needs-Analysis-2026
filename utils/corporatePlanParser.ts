import { StructuredCorporatePlan } from '../types';
import { parsePDF } from './pdfParser';
import { parseCorporatePlanExcel } from './excelParser';

/**
 * Custom error class for unsupported file formats
 */
export class UnsupportedFileFormatError extends Error {
  constructor(format: string) {
    super(`Unsupported file format: ${format}. Only .pdf and .xlsx files are supported.`);
    this.name = 'UnsupportedFileFormatError';
  }
}

/**
 * Extracts text from a PDF file
 * This is an alias for parsePDF to match the required function name
 * @param file - The PDF file to extract text from
 * @returns Promise<string> - The extracted text content
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  return parsePDF(file);
};

/**
 * Parses text content from a corporate plan document and extracts structured data
 * @param text - The raw text content from the corporate plan document
 * @returns StructuredCorporatePlan - The parsed corporate plan data
 */
const parseCorporatePlanText = (text: string): StructuredCorporatePlan => {
  // Clean and normalize the text
  const cleanText = text.replace(/\s+/g, ' ').trim();

  // Extract sections using improved regex patterns
  const extractSection = (patterns: RegExp[]): string => {
    for (const pattern of patterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return '';
  };

  // Common patterns for corporate plan sections with multiple variations
  const visionPatterns = [
    /(?:vision|mission statement)[^:]*:?\s*([^.!?\n]+[.!?\n])/i,
    /vision[^:]*:?\s*([^.!?\n]+[.!?\n])/i,
    /(?:our vision|organizational vision)[^:]*:?\s*([^.!?\n]+[.!?\n])/i
  ];
  const vision = extractSection(visionPatterns) || 'Vision extracted from PDF';

  const missionPatterns = [
    /mission[^:]*:?\s*([^.!?\n]+[.!?\n])/i,
    /(?:mission|mission statement)[^:]*:?\s*([^.!?\n]+[.!?\n])/i,
    /(?:our mission|organizational mission)[^:]*:?\s*([^.!?\n]+[.!?\n])/i
  ];
  const mission = extractSection(missionPatterns) || 'Mission extracted from PDF';

  // Extract objectives (may be multiple)
  const objectivesPatterns = [
    /(?:objectives|goals|strategic objectives|key objectives)[^:]*:?\s*([^.!?\n]+(?:[.!?\n][^.!?\n]*)*)/i,
    /(?:strategic objectives|organizational objectives)[^:]*:?\s*([^.!?\n]+(?:[.!?\n][^.!?\n]*)*)/i
  ];
  const objectivesText = extractSection(objectivesPatterns);
  const objectives = objectivesText
    ? objectivesText.split(/[.!?\n]/).map(obj => obj.trim()).filter(obj => obj.length > 10)
    : ['Objectives extracted from PDF'];

  const trainingPatterns = [
    /(?:training needs|learning needs|capacity building|human capacity)[^:]*:?\s*([^.!?\n]+[.!?\n])/i,
    /(?:training|development|capacity)[^:]*:?\s*([^.!?\n]+[.!?\n])/i
  ];
  const trainingNeeds = extractSection(trainingPatterns) || 'Training needs extracted from PDF';

  const financialPatterns = [
    /(?:financial context|budget|funding|resources|financial plan)[^:]*:?\s*([^.!?\n]+[.!?\n])/i,
    /(?:budget|funding|financial)[^:]*:?\s*([^.!?\n]+[.!?\n])/i
  ];
  const financialContext = extractSection(financialPatterns) || 'Financial context extracted from PDF';

  const riskPatterns = [
    /(?:risk assessment|risks|challenges|risk management)[^:]*:?\s*([^.!?\n]+[.!?\n])/i,
    /(?:risks|challenges)[^:]*:?\s*([^.!?\n]+[.!?\n])/i
  ];
  const riskAssessment = extractSection(riskPatterns) || 'Risk assessment extracted from PDF';

  const personnelPatterns = [
    /(?:personnel establishment|staffing|workforce|human resources)[^:]*:?\s*([^.!?\n]+[.!?\n])/i,
    /(?:staffing|workforce|personnel)[^:]*:?\s*([^.!?\n]+[.!?\n])/i
  ];
  const personnelEstablishment = extractSection(personnelPatterns) || 'Personnel establishment extracted from PDF';

  return {
    strategic_goals: {
      vision,
      mission,
      objectives
    },
    training_needs: trainingNeeds,
    financial_context: financialContext,
    risk_assessment: riskAssessment,
    personnel_establishment: personnelEstablishment
  };
};

/**
 * Parses a corporate plan file (PDF or Excel) and extracts structured data.
 * 
 * @param file - The corporate plan file to parse (must be .pdf or .xlsx)
 * @returns Promise<{ data: StructuredCorporatePlan }> - The parsed corporate plan data
 * 
 * @throws {UnsupportedFileFormatError} - If the file format is not supported
 * 
 * Supported formats:
 * - .pdf: Uses extractTextFromPDF() to extract text, then parseCorporatePlanText()
 * - .xlsx: Uses parseCorporatePlanExcel() directly
 */
export const parseCorporatePlanFile = async (file: File): Promise<{ data: StructuredCorporatePlan }> => {
  // Get the file extension
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));

  // Handle based on file format
  if (fileExtension === '.pdf') {
    // For PDF files: extract text using extractTextFromPDF() and parse with parseCorporatePlanText()
    const text = await extractTextFromPDF(file);
    
    if (!text || text.trim().length === 0) {
      throw new Error('The PDF file appears to be empty or contains no extractable text.');
    }
    
    const corporatePlanData = parseCorporatePlanText(text);
    return { data: corporatePlanData };
  } 
  else if (fileExtension === '.xlsx') {
    // For Excel files: use parseCorporatePlanExcel() directly
    const corporatePlanData = await parseCorporatePlanExcel(file);
    return { data: corporatePlanData };
  } 
  else {
    // For any other format: throw an error
    throw new UnsupportedFileFormatError(fileExtension);
  }
};

export default parseCorporatePlanFile;
