export { default } from 'next-auth/middleware';

export const config = {
	matcher: ['/profile', '/math', '/english', '/statistics'],
	headers: {
		'Cache-Control': 'no-store',
	},
};
