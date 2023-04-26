import {QuestionTag} from './Questions';

export interface UserEndpoints {
	// TODO: Add endpoints
}

export interface User {
	id: number,
	name: string,
	nextQuizTimestamp: Date,
	assignedTags: QuestionTag[],
}
