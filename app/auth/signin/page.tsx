'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function SignInPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [nickName, setNickName] = useState('');
	const [error, setError] = useState('');

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const result = await signIn('credentials', {
				redirect: false, // Не перенаправлять сразу после входа
				email,
				password,
				nickName,
			});

			if (!result?.ok) {
				setError('Неверный email или пароль.');
			} else {
				setError('');
				<Link href='/'></Link>
				//window.location.href = '/'; // Перенаправление после успешного входа
			}
		} catch (err) {
			setError('Ошибка при входе. Попробуйте снова.');
			console.error(err);
		}
	};

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<h1 className='text-2xl font-bold'>Войти в систему</h1>

			<form onSubmit={handleSignIn} className='w-full max-w-md space-y-4'>
				{error && <div className='text-red-500 text-sm'>{error}</div>}
				<div className='flex flex-col'>
					<label htmlFor='email' className='mb-1 font-medium'>
						Email
					</label>
					<input
						type='email'
						id='email'
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
						className='border px-3 py-2 rounded w-full'
					/>
				</div>
				<div className='flex flex-col'>
					<label htmlFor='nickName' className='mb-1 font-medium'>
						Никнейм (опционально)
					</label>
					<input
						type='text'
						id='nickName'
						value={nickName}
						onChange={e => setNickName(e.target.value)}
						className='border px-3 py-2 rounded w-full'
					/>
				</div>
				<div className='flex flex-col'>
					<label htmlFor='password' className='mb-1 font-medium'>
						Пароль
					</label>
					<input
						type='password'
						id='password'
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
						className='border px-3 py-2 rounded w-full'
					/>
				</div>
				<button
					type='submit'
					className='btn btn-primary w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700'
				>
					Войти
				</button>
			</form>

			<div className='flex flex-col items-center space-y-4 mt-6'>
				<button
					className='btn btn-outline min-w-[200px]'
					onClick={() => signIn('google')}
				>
					Войти через Google
				</button>
			</div>
		</div>
	);
}
