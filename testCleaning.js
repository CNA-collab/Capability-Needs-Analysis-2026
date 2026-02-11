import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Since dataCleaning.ts is TypeScript, I'll copy the logic here for testing
function cleanLearningDevelopmentTable(csvData) {
    const lines = csvData.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const cleanedRecords = [];

    for (const line of lines) {
        const columns = parseCSVLine(line);

        // Skip repeated headers: if first column is "Division"
        if (columns[0] === 'Division') {
            continue;
        }

        // Handle mixed division labels: if more than 5 columns, combine extra into Division
        let division = columns[0];
        let positionNo = columns[1];
        let grade = columns[2];
        let designation = columns[3];
        let occupant = columns[4];
        let year = columns[5] || '';

        // Standardize grade values
        grade = grade.replace(/Gr\s*;/g, 'Gr ').replace(/^G(\d+)/, 'Gr $1');

        // Ensure all required fields are present
        if (division && positionNo && grade && designation && occupant !== undefined) {
            // Parse grade to number
            const gradeMatch = grade.match(/(\d+)/);
            const gradeNum = gradeMatch ? parseInt(gradeMatch[1]) : 0;

            // Assign FunctionalArea
            let functionalArea = '';
            if (designation.includes('HR') || designation.includes('PA') || designation.includes('Secretary') || designation.includes('Reception') || designation.includes('Driver')) {
                functionalArea = 'Admin';
            } else if (designation.includes('Accounts') || designation.includes('Economist') || designation.includes('Payroll')) {
                functionalArea = 'Finance';
            } else if (designation.includes('Field Officer') || designation.includes('Regional Manager') || designation.includes('Coordinator')) {
                functionalArea = 'Field';
            } else if (designation.includes('Breeder') || designation.includes('Research Officer')) {
                functionalArea = 'Research';
            } else {
                functionalArea = 'Other';
            }

            // Assign SkillGapCategory
            let skillGapCategory = '';
            if (designation.includes('Manager') || designation.includes('Coordinator')) {
                skillGapCategory = 'Leadership';
            } else if (['Field', 'Finance', 'Research'].includes(functionalArea)) {
                skillGapCategory = 'Technical';
            } else if (functionalArea === 'Admin' || designation.includes('Audit') || designation.includes('QA')) {
                skillGapCategory = 'Compliance';
            } else {
                skillGapCategory = 'Other';
            }

            // Assign CriticalRole
            const criticalRole = (gradeNum >= 11 || designation.includes('Manager') || designation.includes('Coordinator') || designation.includes('Auditor')) ? 'Yes' : 'No';

            // Assign RetirementRisk
            let retirementRisk = '';
            if (gradeNum >= 12) {
                retirementRisk = 'High';
            } else if (gradeNum >= 9) {
                retirementRisk = 'Medium';
            } else {
                retirementRisk = 'Low';
            }

            // Calculate PriorityLevel
            let priorityLevel = '';
            if (criticalRole === 'Yes' && retirementRisk === 'High') {
                priorityLevel = 'High';
            } else if (criticalRole === 'Yes' || retirementRisk === 'Medium') {
                priorityLevel = 'Medium';
            } else {
                priorityLevel = 'Low';
            }

            // Flag high priority officers with no training planned
            const trainingPlanned = year.trim() !== '';
            const flag = (priorityLevel === 'High' && !trainingPlanned) ? 'Flag' : '';

            cleanedRecords.push({
                Division: division,
                PositionNo: positionNo,
                Grade: grade,
                Designation: designation,
                Occupant: occupant,
                FunctionalArea: functionalArea,
                SkillGapCategory: skillGapCategory,
                CriticalRole: criticalRole,
                RetirementRisk: retirementRisk,
                PriorityLevel: priorityLevel,
                Flag: flag
            });
        }
    }

    return cleanedRecords;
}

// Simple CSV parser for a line, handling quotes
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

// Read the raw CSV
const csvPath = path.join(__dirname, 'raw_lnd.csv');
const csvData = fs.readFileSync(csvPath, 'utf8');

const cleanedData = cleanLearningDevelopmentTable(csvData);

console.log('Cleaned Data:');
console.log(JSON.stringify(cleanedData, null, 2));

// Write to a cleaned CSV
const cleanedCSV = 'Division,PositionNo,Grade,Designation,Occupant,FunctionalArea,SkillGapCategory,CriticalRole,RetirementRisk,PriorityLevel,Flag\n' +
    cleanedData.map(row => `${row.Division},${row.PositionNo},${row.Grade},${row.Designation},${row.Occupant},${row.FunctionalArea},${row.SkillGapCategory},${row.CriticalRole},${row.RetirementRisk},${row.PriorityLevel},${row.Flag}`).join('\n');

fs.writeFileSync('cleaned_lnd.csv', cleanedCSV);
console.log('Cleaned CSV written to cleaned_lnd.csv');
