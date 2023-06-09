import { User } from '../Api/Hub/Models/Users';

export const userMock: User = {
	id: 0,
	account: { id: 0 },
	emailAddress: 'test@example.com',
	permissions: [],
	firstName: 'John',
	lastName: 'Doe',
};

export const usersMock: User[] = [
	userMock,
	{
		id: 1,
		account: { id: 0 },
		emailAddress: 'test@test.com',
		permissions: [],
		firstName: 'Jane',
		lastName: 'Doe',
	},
];