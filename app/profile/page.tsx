'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

type UserSession = {
	user?: {
		id?: string;
		name?: string;
		nickName?: string;
		email?: string;
		image?: string;
	};
};

export default function Profile() {
	const { data: session } = useSession() as { data: UserSession | null };
	const userImage = session?.user?.image || '/default-avatar.png';
	const [inputValue, setInputValue] = useState<string>('');
	const urlFetchSetPassword = '/api/userParametrs';

	const saveNewPassword = async (userId: string, newPassword: string) => {
		try {
			const response = await fetch(urlFetchSetPassword, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userId, newPassword }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Не удалось обновить пароль.');
			}

			console.log('Пароль успешно обновлен:', data.message);
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error('Ошибка при обновлении пароля:', error.message);
			} else {
				console.error('Произошла неизвестная ошибка.');
			}
		}
	};

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<div className='p-8 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4'>Профиль</h1>
				<div>
					{session?.user?.image && (
						<Image
							src={userImage}
							alt='User Avatar'
							width={500}
							height={500}
							className='inline-block size-24 rounded-full ring-2 ring-white'
						/>
					)}
				</div>

				<div>
					<p>Имя: {session?.user?.name}</p>
					<p>Никнейм: {session?.user?.nickName}</p>
					<p>Почта: {session?.user?.email}</p>
				</div>
				<div className='flex flex-col space-y-4'>
					<label>Изменить пароль:</label>
					<input
						type='text'
						value={inputValue}
						className='input input-bordered w-full max-w-xs'
						placeholder='новый пароль'
						onChange={e => setInputValue(e.target.value)}
					/>
					<button
						className='btn btn-outline'
						onClick={() => {
							if (!inputValue) {
								console.error('Пароль не может быть пустым.');
								return;
							}
							if (!session?.user?.id) {
								console.error(
									'Не удалось получить идентификатор пользователя.'
								);
								return;
							}
							saveNewPassword(session.user.id, inputValue);
						}}
					>
						Сохранить
					</button>
				</div>
			</div>
		</div>
	);
}
