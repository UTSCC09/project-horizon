export type UserPost = {
	id: string;
	content: string;
	createdAt: string;
	files?: File[];
};

export type File = {
	id: string;
	filename: string;
	mimetype: string;
}

export type User = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
}