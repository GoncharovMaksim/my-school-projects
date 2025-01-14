'use client';

import Loading from '@/app/loading';
import { signIn, useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Импортируем иконки глаз

export default function SignInPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl') || '/'; // Получаем изначальную страницу или используем `/`
	const { data: session, status } = useSession(); // добавлен статус сессии
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [nickName, setNickName] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setisLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false); // Новое состояние для управления видимостью пароля

	useEffect(() => {
		if (status === 'authenticated') {
			console.log('sessionUseEf:', session);
			// Если пользователь уже аутентифицирован, сразу перенаправляем
			router.push(callbackUrl);
		}
	}, [status, router, callbackUrl, session]);

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setisLoading(true);
		try {
			const result = await signIn('credentials', {
				redirect: false,
				email,
				password,
				nickName,
				callbackUrl: callbackUrl,
			});

			if (!result?.ok) {
				setError('Неверный email или пароль.');
			} else {
				setError('');
				window.location.href = callbackUrl;
			}
		} catch (err) {
			setError('Ошибка при входе. Попробуйте снова.');
			console.error(err);
		}
	};

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<div className='p-8 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4'>Вход</h1>

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
						<div className='relative w-full max-w-xs'>
							<input
								type={showPassword ? 'text' : 'password'}
								id='password'
								value={password}
								onChange={e => setPassword(e.target.value)}
								required
								className='input input-bordered w-full pr-10'
							/>

							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='absolute inset-y-0 right-0 w-16 mr-2'
							>
								{showPassword ? (
									<EyeSlashIcon className='h-6 w-6 text-gray-600' />
								) : (
									<EyeIcon className='h-6 w-6 text-gray-600' />
								)}
							</button>
						</div>
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
