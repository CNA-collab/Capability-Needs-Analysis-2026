export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface TrainingItem {
    priority: TaskPriority;
    [key: string]: unknown; // Allow additional properties
}

export interface ScheduledTrainingItem extends TrainingItem {
    year2023?: 'Planned' | 'N/A';
    year2024?: 'Planned' | 'N/A';
    year2025?: 'Planned' | 'N/A';
    year2026?: 'Planned' | 'N/A';
}

/**
 * Training Scheduler Rules:
 * - High priority → Year 2023 or 2024 = Planned
 * - Medium → 2024 or 2025 = Planned
 * - Low → 2025 or 2026 = Planned
 * - Set remaining years as N/A
 */
export function scheduleTraining(trainingItems: TrainingItem[]): ScheduledTrainingItem[] {
    return trainingItems.map(item => {
        const scheduledItem: ScheduledTrainingItem = { ...item };

        switch (item.priority) {
            case 'High':
                scheduledItem.year2023 = 'Planned';
                scheduledItem.year2024 = 'Planned';
                scheduledItem.year2025 = 'N/A';
                scheduledItem.year2026 = 'N/A';
                break;
            case 'Medium':
                scheduledItem.year2023 = 'N/A';
                scheduledItem.year2024 = 'Planned';
                scheduledItem.year2025 = 'Planned';
                scheduledItem.year2026 = 'N/A';
                break;
            case 'Low':
                scheduledItem.year2023 = 'N/A';
                scheduledItem.year2024 = 'N/A';
                scheduledItem.year2025 = 'Planned';
                scheduledItem.year2026 = 'Planned';
                break;
            default:
                // If priority is not recognized, set all to N/A
                scheduledItem.year2023 = 'N/A';
                scheduledItem.year2024 = 'N/A';
                scheduledItem.year2025 = 'N/A';
                scheduledItem.year2026 = 'N/A';
        }

        return scheduledItem;
    });
}

/**
 * Get the planned years for a given priority level
 */
export function getPlannedYearsForPriority(priority: TaskPriority): number[] {
    switch (priority) {
        case 'High':
            return [2023, 2024];
        case 'Medium':
            return [2024, 2025];
        case 'Low':
            return [2025, 2026];
        default:
            return [];
    }
}

/**
 * Check if a training item is planned for a specific year
 */
export function isPlannedForYear(item: ScheduledTrainingItem, year: number): boolean {
    const yearKey = `year${year}` as keyof ScheduledTrainingItem;
    return item[yearKey] === 'Planned';
}
