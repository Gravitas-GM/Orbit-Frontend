import { QuestionTag } from "../Api/Quiz/Models/QuestionTags";

export const questionTagsMock: QuestionTag[] = [
	{
		id: 1,
		label: "General",
		accountId: 1,
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
		id: 2,
		label: "Design",
		accountId: 1,
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