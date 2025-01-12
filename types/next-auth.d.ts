import 'next-auth';

declare module 'next-auth' {
	interface User {
		nickName?: string;
		isAdmin: boolean;
	}

	interface Session {
		user: {
			id: string;
			email: string;
			name: string;
			nickName?: string;
			image?: string;
			isAdmin: boolean;
		};
	}
}
