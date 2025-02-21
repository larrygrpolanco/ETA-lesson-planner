// src/lib/types.ts

// Defines the structure of our form data
export interface LessonPlanFormData {
	topic: string;
	grade: number;
	classDuration: string;
	coTeachingModel: CoTeachingModel;
	classroomSetting: string;
	objectives: string;
	classSize: number;
	proficiencyLevels: ProficiencyLevel[];
	assessmentTypes: AssessmentType[];
	materials: string;
	keyVocabulary: string;
	extraConsiderations: string;
}

// Defines the available co-teaching models
export type CoTeachingModel =
	| 'One teach, one observe'
	| 'One teach, one assist'
	| 'Team teaching'
	| 'Station teaching'
	| 'Parallel teaching'
	| 'Alternative teaching';

// Defines the available proficiency levels
export type ProficiencyLevel = 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced';

// Defines the available assessment types
export type AssessmentType =
	| 'Watch & Note: observing student work and behavior'
	| 'Speaking Check: asking questions and listening to responses'
	| 'Quick Poll: understanding checks via thumbs up/down or voting'
	| 'Practice Task: students applying what they learned'
	| 'Group Work: collaborative demonstration of learning'
	| 'Written Check: quick writing tasks like worksheets or questions';

// Defines the structure of our API response
export interface ApiResponse {
	lessonPlan?: string;
	error?: string;
}

// Defines the options available for dropdowns
export const OPTIONS = {
	coTeaching: [
		'One teach, one observe',
		'One teach, one assist',
		'Team teaching',
		'Station teaching',
		'Parallel teaching',
		'Alternative teaching'
	] as CoTeachingModel[],

	assessment: [
		'Watch & Note: observing student work and behavior',
		'Speaking Check: asking questions and listening to responses',
		'Quick Poll: understanding checks via thumbs up/down or voting',
		'Practice Task: students applying what they learned',
		'Group Work: collaborative demonstration of learning',
		'Written Check: quick writing tasks like worksheets or questions'
	] as AssessmentType[],

	proficiency: ['Beginner', 'Elementary', 'Intermediate', 'Advanced'] as ProficiencyLevel[]
};
