import { describe, it, expect } from 'vitest';
import { 
  scheduleTraining, 
  getPlannedYearsForPriority, 
  isPlannedForYear, 
  type TrainingItem,
  type ScheduledTrainingItem
} from './trainingScheduler';

describe('trainingScheduler', () => {
  describe('scheduleTraining', () => {
    it('should schedule high priority training for 2023 and 2024', () => {
      const items: TrainingItem[] = [
        { priority: 'High', trainingArea: 'Leadership Development' }
      ];
      
      const result = scheduleTraining(items);
      
      expect(result).toHaveLength(1);
      expect(result[0].year2023).toBe('Planned');
      expect(result[0].year2024).toBe('Planned');
      expect(result[0].year2025).toBe('N/A');
      expect(result[0].year2026).toBe('N/A');
    });

    it('should schedule medium priority training for 2024 and 2025', () => {
      const items: TrainingItem[] = [
        { priority: 'Medium', trainingArea: 'Digital Skills' }
      ];
      
      const result = scheduleTraining(items);
      
      expect(result).toHaveLength(1);
      expect(result[0].year2023).toBe('N/A');
      expect(result[0].year2024).toBe('Planned');
      expect(result[0].year2025).toBe('Planned');
      expect(result[0].year2026).toBe('N/A');
    });

    it('should schedule low priority training for 2025 and 2026', () => {
      const items: TrainingItem[] = [
        { priority: 'Low', trainingArea: 'Basic Computer Skills' }
      ];
      
      const result = scheduleTraining(items);
      
      expect(result).toHaveLength(1);
      expect(result[0].year2023).toBe('N/A');
      expect(result[0].year2024).toBe('N/A');
      expect(result[0].year2025).toBe('Planned');
      expect(result[0].year2026).toBe('Planned');
    });

    it('should handle multiple items with different priorities', () => {
      const items: TrainingItem[] = [
        { priority: 'High', trainingArea: 'Leadership' },
        { priority: 'Medium', trainingArea: 'Digital Skills' },
        { priority: 'Low', trainingArea: 'Basic Skills' }
      ];
      
      const result = scheduleTraining(items);
      
      expect(result).toHaveLength(3);
      
      // High priority
      expect(result[0].year2023).toBe('Planned');
      expect(result[0].year2024).toBe('Planned');
      
      // Medium priority
      expect(result[1].year2024).toBe('Planned');
      expect(result[1].year2025).toBe('Planned');
      
      // Low priority
      expect(result[2].year2025).toBe('Planned');
      expect(result[2].year2026).toBe('Planned');
    });

    it('should preserve additional properties on training items', () => {
      const items: TrainingItem[] = [
        { priority: 'High', trainingArea: 'Leadership', targetAudience: 'Senior Managers' }
      ];
      
      const result = scheduleTraining(items);
      
      expect(result[0].priority).toBe('High');
      expect(result[0].trainingArea).toBe('Leadership');
      expect(result[0].targetAudience).toBe('Senior Managers');
    });

    it('should handle unknown priority by setting all years to N/A', () => {
      const items = [
        { priority: 'Unknown' as unknown, trainingArea: 'Test' }
      ];
      
      const result = scheduleTraining(items);
      
      expect(result[0].year2023).toBe('N/A');
      expect(result[0].year2024).toBe('N/A');
      expect(result[0].year2025).toBe('N/A');
      expect(result[0].year2026).toBe('N/A');
    });
  });

  describe('getPlannedYearsForPriority', () => {
    it('should return [2023, 2024] for High priority', () => {
      expect(getPlannedYearsForPriority('High')).toEqual([2023, 2024]);
    });

    it('should return [2024, 2025] for Medium priority', () => {
      expect(getPlannedYearsForPriority('Medium')).toEqual([2024, 2025]);
    });

    it('should return [2025, 2026] for Low priority', () => {
      expect(getPlannedYearsForPriority('Low')).toEqual([2025, 2026]);
    });

    it('should return empty array for unknown priority', () => expect(getPlannedYearsForPriority('Unknown')).toEqual([]));
  });

  describe('isPlannedForYear', () => {
    it('should return true if year is Planned', () => {
      const item: ScheduledTrainingItem = {
        priority: 'High',
        year2023: 'Planned',
        year2024: 'Planned',
        year2025: 'N/A',
        year2026: 'N/A'
      };
      
      expect(isPlannedForYear(item, 2023)).toBe(true);
      expect(isPlannedForYear(item, 2024)).toBe(true);
    });

    it('should return false if year is N/A', () => {
      const item: ScheduledTrainingItem = {
        priority: 'High',
        year2023: 'Planned',
        year2024: 'Planned',
        year2025: 'N/A',
        year2026: 'N/A'
      };
      
      expect(isPlannedForYear(item, 2025)).toBe(false);
      expect(isPlannedForYear(item, 2026)).toBe(false);
    });

    it('should return false for undefined year properties', () => {
      const item: ScheduledTrainingItem = {
        priority: 'High'
      };
      
      expect(isPlannedForYear(item, 2023)).toBe(false);
      expect(isPlannedForYear(item, 2024)).toBe(false);
    });
  });
});
