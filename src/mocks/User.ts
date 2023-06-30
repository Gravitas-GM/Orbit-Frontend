import { User } from "../Api/Hub/Models/Users";

export const userMock: User = {
	id: 0,
	account: { id: 0 },
	emailAddress: "test@example.com",
	permissions: [],
	firstName: "John",
	lastName: "Doe",
};

export const usersMock: User[] = [
	{
		id: 0,
		account: { id: 0 },
		emailAddress: "test@example.com",
		permissions: [],
		firstName: "John",
		lastName: "Doe",
	},
	{
		id: 1,
		account: { id: 0 },
		emailAddress: "test@test.com",
		permissions: [],
		firstName: "Jane",
		lastName: "Doe",
	},
	{
		id: 2,
		account: { id: 0 },
		emailAddress: "link@zelda.com",
		permissions: [],
		firstName: "Link",
		lastName: "Zelda",
	},
];
