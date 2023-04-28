import {User} from './Users';

export interface QuestionTagEndpoints {
	// TODO: Add endpoints
}

export interface QuestionTag {
	accountId: number,
	label: string,
	members: User[],
}
