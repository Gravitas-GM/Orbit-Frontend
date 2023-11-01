import { User } from "../Api/Hub/Models/Users";
import { Permission } from "../Permission";

export const userMock: User = {
	id: 0,
	account: { id: 0 },
	emailAddress: "test@example.com",
	permissions: [Permission.ADMIN],
	firstName: "John",
	lastName: "Doe",
};

export const regularUserMock: User = {
	id: 22,
	account: { id: 22 },
	emailAddress: "another@example.com",
	permissions: [],
	firstName: 'Jane',
	lastName: 'Doe',
};

export const usersMock: User[] = [
	userMock,
	regularUserMock,
];
