import { describe, it, expect } from 'vitest';
import { cleanLearningDevelopmentTable } from './dataCleaning';

describe('dataCleaning', () => {
  describe('cleanLearningDevelopmentTable', () => {
    it('should skip repeated header rows', () => {
      const csvData = `Division,PositionNo,Grade,Designation,Occupant,Year
Division,PositionNo,Grade,Designation,Occupant,Year
HQ,1234,Grade 12,Manager,John Doe,2024`;

      const result = cleanLearningDevelopmentTable(csvData);
      
      expect(result).toHaveLength(1);
      expect(result[0].Division).toBe('HQ');
    });

    it('should standardize grade values', () => {
      const csvData = `Division,PositionNo,Grade,Designation,Occupant,Year
HQ,1234,Gr 12,Manager,John Doe,2024`;

      const result = cleanLearningDevelopmentTable(csvData);
      
      expect(result).toHaveLength(1);
      expect(result[0].Grade).toBe('Gr 12');
    });

    it('should assign FunctionalArea based on designation', () => {
      const csvData = `Division,PositionNo,Grade,Designation,Occupant,Year
HQ,1234,Grade 12,HR Manager,John Doe,2024
HQ,1235,Grade 10,Accounts Officer,Jane Smith,2024
HQ,1236,Grade 8,Field Officer,Bob Wilson,2024
HQ,1237,Grade 9,Research Officer,Alice Brown,2024`;

      const result = cleanLearningDevelopmentTable(csvData);
      
      expect(result).toHaveLength(4);
      expect(result[0].FunctionalArea).toBe('Admin');
      expect(result[1].FunctionalArea).toBe('Finance');
      expect(result[2].FunctionalArea).toBe('Field');
      expect(result[3].FunctionalArea).toBe('Research');
    });

    it('should assign SkillGapCategory based on designation and functional area', () => {
      const csvData = `Division,PositionNo,Grade,Designation,Occupant,Year
HQ,1234,Grade 14,Manager,John Doe,2024
HQ,1235,Grade 10,Accounts Officer,Jane Smith,2024`;

      const result = cleanLearningDevelopmentTable(csvData);
      
      expect(result[0].SkillGapCategory).toBe('Leadership');
      expect(result[1].SkillGapCategory).toBe('Technical');
    });

    it('should assign CriticalRole based on grade and designation', () => {
      const csvData = `Division,PositionNo,Grade,Designation,Occupant,Year
HQ,1234,Grade 11,Manager,John Doe,2024
HQ,1235,Grade 10,Officer,Jane Smith,2024`;

      const result = cleanLearningDevelopmentTable(csvData);
      
      expect(result[0].CriticalRole).toBe('Yes');
      expect(result[1].CriticalRole).toBe('No');
    });

    it('should assign RetirementRisk based on grade', () => {
      const csvData = `Division,PositionNo,Grade,Designation,Occupant,Year
HQ,1234,Grade 12,Manager,John Doe,2024
HQ,1235,Grade 9,Officer,Jane Smith,2024
HQ,1236,Grade 7,Officer,Bob Wilson,2024`;

      const result = cleanLearningDevelopmentTable(csvData);
      
      expect(result[0].RetirementRisk).toBe('High');
      expect(result[1].RetirementRisk).toBe('Medium');
      expect(result[2].RetirementRisk).toBe('Low');
    });

    it('should calculate PriorityLevel based on CriticalRole and RetirementRisk', () => {
      const csvData = `Division,PositionNo,Grade,Designation,Occupant,Year
HQ,1234,Grade 14,Manager,John Doe,2024
HQ,1235,Grade 11,Officer,Jane Smith,2024
HQ,1236,Grade 7,Officer,Bob Wilson,2024`;

      const result = cleanLearningDevelopmentTable(csvData);
      
      expect(result[0].PriorityLevel).toBe('High');
      expect(result[1].PriorityLevel).toBe('Medium');
      expect(result[2].PriorityLevel).toBe('Low');
    });

    it('should flag high priority officers with no training planned', () => {
      const csvData = `Division,PositionNo,Grade,Designation,Occupant,Year
HQ,1234,Grade 14,Manager,John Doe,
HQ,1235,Grade 14,Manager,Jane Smith,2024`;

      const result = cleanLearningDevelopmentTable(csvData);
      
      expect(result[0].Flag).toBe('Flag');
      expect(result[1].Flag).toBe('');
    });

    it('should handle empty input', () => {
      const csvData = '';
      const result = cleanLearningDevelopmentTable(csvData);
      expect(result).toHaveLength(0);
    });

    it('should skip rows with missing required fields', () => {
      const csvData = `Division,PositionNo,Grade,Designation,Occupant,Year
,1234,Grade 12,Manager,John Doe,2024
HQ,,Grade 12,Manager,Jane Smith,2024`;

      const result = cleanLearningDevelopmentTable(csvData);
      expect(result).toHaveLength(0);
    });
  });
});
