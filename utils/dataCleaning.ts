export interface CleanedRecord {
    Division: string;
    PositionNo: string;
    Grade: string;
    Designation: string;
    Occupant: string;
    FunctionalArea: string;
    SkillGapCategory: string;
    CriticalRole: string;
    RetirementRisk: string;
    PriorityLevel: string;
    Flag: string;
}

export function cleanLearningDevelopmentTable(csvData: string): CleanedRecord[] {
    const lines = csvData.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const cleanedRecords: CleanedRecord[] = [];

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

        if (columns.length > 6) {
            // Combine extra columns into division if needed, but in this case, division might be multi-part
            // For simplicity, assume division is the first column, even if long
        }

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
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
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
