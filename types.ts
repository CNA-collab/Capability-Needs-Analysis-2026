// src/types.tsx

// 1. Navigation and Agency Types
export type View = 'organizational' | 'individual' | 'pathways' | 'gesi' | 'cna' | 'settings' | 'survey-insights';
export type AgencyType = 'National Department' | 'Provincial Administration' | 'District Municipality' | 'Statutory Agency';

// 2. The 10:20:70 Individual Plan Structure
export interface IndividualLndPlan {
    id: string;
    officer: {
        positionNumber: string;
        division: string;
        grade: string;
        designation: string;
        occupant: string;
        status: string;
    };
    age: number;
    performanceCategory: string;
    promotionPotential: string;
    trainingNeeds: {
        formal: string[];       // 10% - Department Spend
        social: string[];       // 20% - Coaching/Mentoring
        experiential: string[]; // 70% - On-the-job/Assignments
    };
    coreCompetencies: Array<{ 
        skill: string; 
        year: number; 
    }>;
}

// 3. Core Records
export interface OfficerRecord {
    lifecycleStage: string;
    urgency: unknown;
    jobQualification: string;
    technicalCapabilityGaps: any;
    yearsOfExperience: number;
    gradingGroup: string;
    gender: string;
    spaRating: string;
    age: number;
    email: string;
    name: string;
    position: string;
    division: string;
    grade: string;
    performanceRatingLevel: string;
    capabilityRatings: any[];
}

export interface EstablishmentRecord {
    positionCode: string;
    title: string;
    status: 'Filled' | 'Vacant';
}