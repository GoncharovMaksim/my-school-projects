export type UserSession = {
	user?: {
		id?: string;
		name?: string;
		nickName?: string;
		email?: string;
		image?: string;
		isAdmin?: boolean;
	};
};
