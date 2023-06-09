import { QuestionTag } from "../Api/Quiz/Models/QuestionTags";

export const questionTagsMock: QuestionTag[] = [
	{
		accountId: 1,
		id: 1,
		label: "General",
		members: [
			{
				assignedTags: [],
				id: 1,
				name: "John Doe",
				nextQuizTimestamp: new Date(),
			},
			{
				assignedTags: [],
				id: 2,
				name: "Jane Datsun",
				nextQuizTimestamp: new Date()
			},
			{
				assignedTags: [],
				id: 3,
				name: "Rupert Holmes",
				nextQuizTimestamp: new Date()
			}
		],
	},
	{
		accountId: 1,
		id: 2,
		label: "Design",
		members: [
			{
				assignedTags: [],
				id: 1,
				name: "John Doe",
				nextQuizTimestamp: new Date(),
			},
		],
	},
];