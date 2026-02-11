import { scheduleTraining, getPlannedYearsForPriority, isPlannedForYear, type TrainingItem } from './trainingScheduler';

// Example usage and test
const sampleTrainingItems: TrainingItem[] = [
    {
        priority: 'High',
        trainingArea: 'Leadership Development',
        targetAudience: 'Senior Managers'
    },
    {
        priority: 'Medium',
        trainingArea: 'Digital Skills',
        targetAudience: 'All Staff'
    },
    {
        priority: 'Low',
        trainingArea: 'Basic Computer Skills',
        targetAudience: 'Entry Level Staff'
    }
];

// Test the scheduler
const scheduledItems = scheduleTraining(sampleTrainingItems);

console.log('Scheduled Training Items:');
scheduledItems.forEach(item => {
    console.log(`${item.trainingArea} (${item.priority}):`, {
        2023: item.year2023,
        2024: item.year2024,
        2025: item.year2025,
        2026: item.year2026
    });
});

// Test helper functions
console.log('\nPlanned years for High priority:', getPlannedYearsForPriority('High'));
console.log('Planned years for Medium priority:', getPlannedYearsForPriority('Medium'));
console.log('Planned years for Low priority:', getPlannedYearsForPriority('Low'));

// Test if specific item is planned for a year
const highPriorityItem = scheduledItems[0];
console.log(`\nIs "${highPriorityItem.trainingArea}" planned for 2023?`, isPlannedForYear(highPriorityItem, 2023));
console.log(`Is "${highPriorityItem.trainingArea}" planned for 2025?`, isPlannedForYear(highPriorityItem, 2025));
