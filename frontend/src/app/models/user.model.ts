export type UserPost = {
	id: string;
	content: string;
	createdAt: string;
	files?: File[];
	user: User;
};

export type File = {
	id: string;
	filename: string;
	mimetype: string;
	url: string;
}

export type User = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
}