'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignInPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl') || '/'; // Получаем изначальную страницу или используем `/`

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [nickName, setNickName] = useState('');
	const [error, setError] = useState('');

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const result = await signIn('credentials', {
				redirect: false,
				email,
				password,
				nickName,
			});

			if (!result?.ok) {
				setError('Неверный email или пароль.');
			} else {
				setError('');

				router.refresh();
				router.push(callbackUrl); // Перенаправляем на изначальную страницу
			}
		} catch (err) {
			setError('Ошибка при входе. Попробуйте снова.');
			console.error(err);
		}
	};

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
			<div className='p-8 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4'>Вход</h1>
				{/* <div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<h1 className='text-2xl font-bold'>Войти в систему</h1> */}

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
							className='input input-bordered w-full max-w-xs'
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
							className='input input-bordered w-full max-w-xs'
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
							className='input input-bordered w-full max-w-xs'
						/>
					</div>
					<button type='submit' className='btn btn-outline w-full'>
						Войти
					</button>
				</form>

				<button
					className='btn btn-outline w-full'
					onClick={() => signIn('google', { callbackUrl })}
				>
					Войти через Google
				</button>
			</div>
		</div>
	);
}
//1
