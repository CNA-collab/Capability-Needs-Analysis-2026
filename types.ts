// src/types.tsx

// 1. Navigation and Agency Types
export type View = 'dashboard' | 'organizational' | 'individual' | 'pathways' | 'gesi' | 'cna' | 'settings' | 'survey-insights' | 'expenditure-review' | 'all-components';

export type WorkforceLifecycleStage = 'Recruitment/Entry' | 'Early Career' | 'Career Progression' | 'Leadership Track' | 'Exit/Retirement Prep';
export type AgencyType = 'National Department' | 'Provincial Administration' | 'District Municipality' | 'Statutory Agency' | 'All Agencies' | 'National Agency' | 'Provincial Health Authority' | 'Local Level Government' | 'Other';

export enum UrgencyLevel {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}

export type PerformanceRatingLevel = 'Well Above Required' | 'Above Required' | 'At Required Level' | 'Below Required Level' | 'Well Below Required Level' | 'Not Rated';

export type GradingGroup = 'Junior Officer' | 'Senior Officer' | 'Manager' | 'Senior Management' | 'Other';

export type GapTag = '[ALIGNED]' | '[SKILL_GAP]' | '[QUAL_GAP]' | '[CRITICAL_GAP]';

export type CurrentScoreCategory = 'High' | 'Moderate' | 'Low';

export interface TrainingRecord {
    courseName: string;
    completionDate: string;
}

export interface CapabilityRating {
    questionCode: string;
    currentScore: number;
    realisticScore: number;
    gapScore: number;
    gapCategory: 'No Gap' | 'Minor Gap' | 'Moderate Gap' | 'Critical Gap';
    currentScoreCategory: CurrentScoreCategory;
}

export type JobGroupType = '1️⃣ Senior Executive Managers' | '2️⃣ Middle Managers' | '3️⃣ All Line Staff';

export type JobGroup = 'Senior Executive Managers' | 'Supervisors' | 'Administration' | 'Finance' | 'Economics' | 'ICT Officers' | 'Field Officers' | 'Executive Secretaries' | 'Support Staff';

export type FundingSourceType = 'TBD' | 'Internal Budget' | 'External' | 'Donor' | 'Other';

export type FundingSource = 'Internal Budget' | 'Donor Funded' | 'GoPNG' | 'Other (Specify)';

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
export type Officer = OfficerRecord;

export interface OfficerRecord {
    employmentStatus: string;
    lifecycleStage: string;
    urgency: UrgencyLevel;
    jobQualification: string;
    technicalCapabilityGaps: string[];
    yearsOfExperience: number;
    gradingGroup: GradingGroup;
    gender: string;
    spaRating: string;
    age: number;
    email: string;
    name: string;
    position: string;
    positionNumber: string;
    dateOfBirth: string;
    commencementDate: string;
    division: string;
    grade: string;
    performanceRatingLevel: PerformanceRatingLevel;
    capabilityRatings: CapabilityRating[];
    gapTag: GapTag;
    gapTagReason: string;
    trainingHistory: TrainingRecord[];
    trainingPreferences: string[];
    ictSkills: string[];
    leadershipCapabilityGaps: string[];
    misalignmentFlag?: string;
    promotionEligibilityStatus?: string;
    retirementEligibilityDate?: string;
    tnaProcessExists?: boolean;
    tnaAssessmentMethods?: string[];
    tnaProcessDocumented?: boolean;
    tnaDesiredCourses?: string;
    tnaInterestedTopics?: string[];
    tnaPriorities?: string;
    fileNumber?: string;
    nextTrainingDueDate?: string;
}

export interface EstablishmentRecord {
    positionNumber: string;
    division: string;
    grade: string;
    designation: string;
    occupant: string;
    status: string;
    gen: string;
}

export const QUESTION_TEXT_MAPPING: Record<string, string> = {
    'A1': "Rate out of 10 – The organisation has a documented strategic corporate plan linked to PNG Vision 2050 and other macro policies.",
    'A2': "Rate out of 10 – The organisation’s current corporate plan is clear and understood by me.",
    'A3': "Rate out of 10 – I have a clear understanding of the organisation’s priority outcomes and outputs.",
    'B1': "The organization has effective legislation, acts, policies, and regulations (General Order, GESI, PSMA etc).",
    'B2': "The organization regularly reviews systems and processes to improve efficiency and effectiveness.",
    'B3': "I know how my work contributes to the organization achieving its corporate goals.",
    'B4': "I know the internal processes and procedures of the organization.",
    'C1': "The organization fosters effective stakeholder engagement.",
    'C2': "There are opportunities for career advancement within the organization.",
    'C3': "The department promotes change and innovation.",
    'D1': "My performance is measured by what gets done, not how busy I am.",
    'D2': "I participate in performance and development reviews bi-annually.",
    'D3': "The organization assesses staff performance to evaluate efficiency and service delivery.",
    'E1': "The organization has a strategic approach to workforce planning.",
    'E2': "The organization has a systematic approach to recording, retaining, and transferring corporate knowledge.",
    'E3': "The organization identifies and develops talent at senior and middle levels.",
    'F1': "The organization has a strategic approach to employee training and development.",
    'F2': "Employee learning aligns with corporate goals and strategies.",
    'F3': "The organization promotes continuous learning and development among employees.",
    'F4': "The organization assists managers in promoting and facilitating employee learning.",
    'F5': "The organization has a comprehensive orientation program for new employees.",
    'F6': "The organization defines goals to measure outcomes of training programs.",
    'F7': "The organization measures the impact of training programs on performance.",
    'G1': "There is support and cooperation across the organization.",
    'G2': "The organisation is committed to employee learning and development.",
    'G3': "The organization is committed to continuous improvement.",
    'G4': "The organization is committed to employee learning and development.",
    'G5': "I am proud to work for the organization based on its professionalism and integrity.",
    'G6': "The organization has ethical workplace values, cultures, systems, and practices.",
    'H1': "Does a process for identifying future training/professional needs exist in your organization? (Yes/No)",
    'H2': "In the last 12–18 months, how well were your identified training needs met? (1–10 scale)",
    'H3': "How are your future training/professional needs assessed? (Tick all that apply)",
    'H4': "Is this process documented or recorded? (Yes/No)",
    'H5': "Rate the effectiveness of the process for identifying training needs. (1–10 scale)",
    'H6': "How confident are you that the current process meets your future training needs and career aspirations? (1–10 scale)",
    'H7': "List any long-term or short-term training/courses you wish to undertake. (Open text)",
    'H8': "Choose cross-cutting topics you are interested in. (Multi-select)",
    'H9': "Expand on your top 3 training priorities. (Open text)"
};

export interface AiOrganisationalEstablishmentReport {
    executiveSummary: string;
    establishmentByDivision: Array<{
        divisionName: string;
        positions: Array<{
            division: string;
            clevel: string;
            positionNumber: string;
            positionTitle: string;
            frz: string;
            reference: string;
            funding: string;
            accountNumber: string;
            award: string;
            class: string;
            step: string;
            occupantName: string;
            gen: string;
            dob: string;
            age: number;
            firstCommence: string;
        }>;
    }>;
    summaryStats: {
        totalPositions: number;
        frozenPositions: number;
        filledPositions: number;
        vacantPositions: number;
        averageAge: number;
        averageYearsOfService: number;
    };
    observationsAndRecommendations: string;
}

export interface HierarchyNode {
    name: string;
    level: string;
    manager: string;
    staffCount: number;
    cnaParticipationRate: number;
    notes?: string;
    children?: HierarchyNode[];
}

export interface AiOrganisationalStructureReport {
    executiveSummary: string;
    adaptedHierarchy: HierarchyNode[];
    functionalDuplications: Array<{
        area: string;
        unitsInvolved: string[];
        observation: string;
        recommendation: string;
    }>;
    structuralGaps: Array<{
        gapType: string;
        description: string;
        implication: string;
        recommendation: string;
    }>;
    recommendations: string[];
}

export interface AiLearningSolution {
    experiential70: string;
    social20: string;
    formal10: string;
}

export interface LearningRecommendation {
    skillArea: string;
    questionCode: string;
    rating: number;
    category: 'Low' | 'Fair' | 'High';
    recommendation: AiLearningSolution;
}

export interface OfficerAutomatedLndPlan {
    officerName: string;
    officerPosition: string;
    learningRecommendations: LearningRecommendation[];
}

export interface AiAutomatedLndReport {
    executiveSummary: string;
    officerPlans: OfficerAutomatedLndPlan[];
}

export interface CorporatePlanAnalysis {
    averageScore: number;
    classification: 'Low' | 'Average' | 'High';
    topParticipants: Array<{ name: string; score: number; division: string }>;
    totalRespondents: number;
    highCount: number;
    averageCount: number;
    lowCount: number;
    lowUnderstandingOfficers: Array<{ name: string; score: number; division: string }>;
}

export interface AiReportSummary {
    totalGapsDetected: number;
    criticalGapsCount: number;
    staffCategoryDistribution: Array<{
        category: string;
        count: number;
    }>;
    topImprovementAreas: Array<{
        area: string;
        reason: string;
    }>;
    concludingIntervention: string;
}

export interface CapabilityItemAnalysis {
    gapScore: number;
    currentScore: number;
    questionCode: string;
    questionText: string;
    capabilityCategory: string;
    averageCurrentRating: number;
    realisticRating: number;
    averageGapScore: number;
    gapCategory: 'No Gap' | 'Minor Gap' | 'Moderate Gap' | 'Critical Gap';
    suggestedLearningMethod: string;
    responseCount: number;
    totalOfficers: number;
}

export interface SuccessionCandidate {
    roleOrPosition: string;
    potentialSuccessors: string[];
    readinessLevel: 'Ready Now' | '1-2 Years' | '3-5 Years' | 'Long-term';
    developmentNeeds: string;
    estimatedTimeline: string;
}

export interface AiDetailedCapabilityReport {
    executiveSummary: string;
    capabilityBreakdown: CapabilityItemAnalysis[];
    summary: AiReportSummary;
    successionPlan: SuccessionCandidate[];
}

export type EligibleOfficerStatus = 'Confirmed' | 'Vacant' | 'Displaced' | 'Acting' | 'Unattached' | 'Probation' | 'Other';

export type OfficerStatusType = 'Confirmed' | 'Acting' | 'Contract' | 'Probation' | 'Other';

export type AgeGroupType = '<30' | '30–40' | '41–50' | '>50';

export type PerfLevelType = 'Excellent (86–100%)' | 'Satisfactory (70–85%)' | 'Marginal (50–69%)' | 'Unsatisfactory (0–49%)';

export type PromotionPotentialType = 'Overdue for Promotion' | 'Promotion Now' | 'Needs Development' | 'Not Promotable';

export interface EligibleOfficer {
    id: string;
    branch: string;
    positionNumber: string;
    grade: string;
    designation: string;
    occupant: string;
    status: EligibleOfficerStatus;
    cnaSubmission: 'Yes' | 'No';
    beenSentForStudies: 'Yes' | 'No';
    studiedWhere: string;
    courseDetails: string;
    notes: string;
    trainingQuarters: string;
    trainingYear: number[];
    attendedFurtherTraining: 'Yes' | 'No';
}

export interface AiSuccessionPlanReport {
    executiveSummary: string;
    successionPlan: SuccessionCandidate[];
}

export interface SpaSummary {
    performanceRating: string;
    performanceCategory: string;
    explanation: string;
}

export interface CapabilityAnalysisItem {
    domain: string;
    currentScore: number;
    gapScore: number;
    learningSolution: AiLearningSolution;
    sdgAlignment: Array<{
        sdgNumber: number;
        sdgName: string;
    }>;
}

export interface AiProgressionAnalysis {
    currentPositionSkills: string[];
    missingCurrentSkills: string[];
    nextPositionSkills: string[];
    progressionSummary: string;
}

export interface AiTalentCardReport {
    introduction: string;
    employeeId: string;
    division: string;
    spaSummary: SpaSummary;
    capabilityAnalysis: CapabilityAnalysisItem[];
    progressionAnalysis: AiProgressionAnalysis;
    summary: AiReportSummary;
}

export interface AnnualTrainingPlanItem {
    division: string;
    fundingSource: 'Internal Budget' | 'Donor Funded' | 'GoPNG' | 'Other (Specify)';
    trainingArea: string;
    targetAudience: string;
    deliveryMethod: 'Workshop' | 'Mentoring' | 'On-the-Job' | 'E-Learning' | 'Secondment';
    priority: 'High' | 'Medium' | 'Low';
    quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    estimatedCost: string;
    rationale: string;
}

export interface AiFiveYearPlan {
    executiveSummary: string;
    trainingPlan: Array<{
        division: string;
        positionNumber: string;
        grade: string;
        designation: string;
        occupant: string;
        proposedCourse: string;
        institution: string;
        fundingSource: string;
        trainingYear: number;
        rationale: string;
    }>;
    summary: AiReportSummary;
}

export interface TrainingPlanItem {
    trainingArea: string;
    targetAudience: string;
    deliveryMethod: string;
    priority: string;
    quarter: string;
    year: number;
    estimatedCost: string;
    rationale: string;
}

export interface AiTrainingPlan {
    executiveSummary: string;
    trainingPlan: TrainingPlanItem[];
}

export interface AiAnnualTrainingPlan {
    executiveSummary: string;
    year: number;
    trainingPlan: AnnualTrainingPlanItem[];
    summary: AiReportSummary;
    successionPlan: SuccessionCandidate[];
}

export interface DesiredExperienceRecord {
    id: string;
    jobGroup: string;
    desiredWorkExperience: string;
    institution: string;
    location: string;
    duration: string;
    fundingSource: string;
    years: number[];
}

export type DurationType = 'Less than 6 months' | '6 to 12 months' | '1 to 2 years' | 'More than 2 years';

export type FundingSourceKnowledgeType = 'Department' | 'GoPNG' | 'Donor Agency' | 'Self-funded' | 'Other';

export type JobGroupKnowledgeType = 'Senior Executive Managers' | 'Senior/Middle Managers' | 'Supervisors' | 'All Line Staff' | 'Executive Secretaries';

export interface JobGroupKnowledgeRecord {
    id: string;
    jobGroup: JobGroupKnowledgeType;
    educationalProgramme: string;
    institution: string;
    location: string;
    duration: DurationType;
    fundingSource: FundingSourceKnowledgeType;
    years: number[];
}

// L&D Form Types
export type LndFormFundingSource = 'Department' | 'GoPNG' | 'Donor' | 'Self-funded';

export type TrainingNeedStatus = 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';

export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface LndTrainingNeed {
    id: string;
    perceivedArea: string;
    jobRequirement: string;
    proposedCourse: string;
    institution: string;
    fundingSource: LndFormFundingSource;
    yearOfCommencement: number;
    remarks: string;
    status: TrainingNeedStatus;
    priority: TaskPriority;
}

export interface IndividualLndPlanRecord {
    id: string;
    organizationName: string;
    division: string;
    officerName: string;
    positionNumber: string;
    designation: string;
    dateOfBirth: string;
    officerStatus: string;
    highestQualification: string;
    commencementDate: string;
    gradeLevel: string;
    trainingNeeds: {
        longTerm: LndTrainingNeed[];
        shortTerm: LndTrainingNeed[];
    };
    knowledgeChecklist: Record<string, boolean>;
    otherKnowledge: string[];
    ageGroup: string;
    performanceLevel: string;
    promotionPotential: string;
}

export interface AiWorkforceSnapshotReport {
    executiveSummary: string;
    strategicAlignmentInsights: {
        summary: string;
        gesiFocus: string;
        shrmFocus: string;
    };
}

export interface DevelopmentPathwaysReportData {
    pathwayAnalysis: string;
    individualAssignments: Array<{
        officerName: string;
        grade: string;
        formalProgram: string;
        staggeredYear: number;
        successionRationale: string;
    }>;
}

export interface StructuredCorporatePlan {
    strategic_goals: {
        vision: string;
        mission: string;
        objectives: string[];
    };
    financial_context: string;
    risk_assessment: string;
    personnel_establishment: string;
    training_needs: string;
}

export interface CompetencyDomain {
    domainName: string;
    description: string;
    currentProficiency: number;
    desiredProficiency: number;
    skillGaps: string[];
    qualificationGaps: string[];
    projectedIntervention: string;
}

export interface AiCompetencyDomainReport {
    executiveSummary: string;
    domains: CompetencyDomain[];
    successionPlan: SuccessionCandidate[];
}

export interface AiConsolidatedLifecyclePlanReport {
    executiveSummary: string;
    lifecycleDistribution: {
        recruitment: number;
        earlyCareer: number;
        careerProgression: number;
        leadershipTrack: number;
        exitPrep: number;
    };
    strategicInsights: string;
    individualPaths: Array<{
        officerName: string;
        assignedStage: string;
        primaryObjective: string;
        suggestedIntervention: string;
        staggeredTimeline: string;
    }>;
}

export interface PrescriptiveAction {
    officerName: string;
    segment: string;
    primaryAction: string;
    successionTarget?: string;
    rationale: string;
}

export interface AiTalentSegmentationReport {
    executiveSummary: string;
    strategicInsight: string;
    prescriptiveActions: PrescriptiveAction[];
}

export interface AiGesiAnalysisReport {
    executiveSummary: string;
    equityStats: {
        femaleSeniorityRate: string;
        disabilityInclusionLevel: string;
        overallGesiAwareness: string;
    };
    identifiedGapsAndRisks: Array<{
        description: string;
        type: string;
        riskImplication: string;
        learningSolution: {
            experiential70: string;
            social20: string;
            formal10: string;
        };
    }>;
    successfulBenchmarks: string[];
}

export interface TrainingPathway {
    grade: GradingGroup;
    description: string;
    recommendedCourses: Array<{
        title: string;
        rationale: string;
        deliveryMethod: string;
    }>;
}

export interface AiTrainingPathwayReport {
    executiveSummary: string;
    pathwaysByGrade: TrainingPathway[];
}

export interface AiIndividualTrainingPathwayReport {
    officerName: string;
    officerId: string;
    executiveRationale: string;
    pathwayTimeline: Array<{
        year: number;
        competencyHeading: string;
        learningObjectives: string[];
        recommendedModule: string;
        evidenceTag: string;
        verificationStatus: 'Strategically Aligned' | 'Priority Gap' | 'Succession Critical';
    }>;
    evidenceRegistry: Array<{
        tag: string;
        sourceDescription: string;
        metricValue: string;
    }>;
}

export interface CompetencyProjection {
    totalRatings: number;
    lowCount: number;
    fairCount: number;
    highCount: number;
    perQuestionAnalysis: Array<{
        questionCode: string;
        questionText: string;
        averageRating: number;
        lowCount: number;
        fairCount: number;
        highCount: number;
        totalResponses: number;
        learningInterventions: LearningInterventions;
    }>;
}

export interface LearningInterventions {
    formal10: string;
    social20: string;
    experiential70: string;
}

export interface TrainingFeedback {
    usefulness: 'Very Useful' | 'Useful' | 'Not Useful' | '';
    suggestions: string;
    postTrainingSkillScore: string | number;
    additionalSkillsIdentified: string;
}

export interface TrainingNeedItem {
    proposedCourse: string;
    feedback?: TrainingFeedback;
}

export interface AiEligibleOfficersReport {
    executiveSummary: string;
    eligibleOfficers: Array<{
        branch: string;
        positionNumber: string;
        grade: string;
        designation: string;
        occupant: string;
        status: string;
        cnaSubmission: string;
        beenSentForStudies: string;
        studiedWhere: string;
        courseDetails: string;
        trainingYear: number[];
    }>;
    summary: AiReportSummary;
}

export interface AiJobGroupTrainingNeedsReport {
    executiveSummary: string;
    jobGroupNeeds: Array<{
        jobGroup: JobGroup;
        description: string;
        identifiedNeeds: Array<{
            skill: string;
            rationale: string;
            recommendedYear: number;
        }>;
    }>;
    summary: AiReportSummary;
    successionPlan: SuccessionCandidate[];
}

export interface KraPlanningRecord {
    id: string;
    kraName: string;
    division: string;
    jobGroup: JobGroupType;
    positionTitle: string;
    location: string;
    year: number;
    remarks: string;
}

export interface AiBudgetForecastByYearReport {
    executiveSummary: string;
    budgetForecasts: Array<{
        year: number;
        totalBudget: string;
        trainingBudget: string;
        developmentBudget: string;
        fundingSources: Array<{
            source: string;
            amount: string;
            allocation: string;
        }>;
        projectedCosts: Array<{
            category: string;
            amount: string;
            justification: string;
        }>;
    }>;
    budgetSummary: string;
}
