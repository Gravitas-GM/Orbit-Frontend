import { User as QuizUser } from '../Api/Quiz/Models/Users'
import { questionTagsMock } from './QuestionTags';
export const quizUsers: QuizUser[] = [
	{
		id: 1,
		name: "John Doe",
		nextQuizTimestamp: new Date(),
		assignedTags: questionTagsMock
	},
	{
		id: 2,
		name: "Jane Datsun",
		nextQuizTimestamp: new Date(),
		assignedTags: questionTagsMock
	},
];