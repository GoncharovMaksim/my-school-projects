'use client';

import { signIn } from 'next-auth/react';

export default function SignInPage() {
	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
			<h1>Войти в систему</h1>
			<button className='btn btn-outline min-w-[200px]'
				onClick={() => signIn('google')}
				
			>
				Войти через Google
			</button>
		</div>
	);
}
