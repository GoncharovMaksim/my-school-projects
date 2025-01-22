'use client';

import { useEffect, useState } from 'react';
import { usePushSubscription } from './usePushSubscription';

function PushNotificationManager() {
	const {
		state,
		setState,
		subscribeToPush,
		unsubscribeFromPush,
		sendTestNotification,
	} = usePushSubscription();

	const [users, setUsers] = useState<{ userId: string; name: string }[]>([]);
	const [loadingUsers, setLoadingUsers] = useState(false);

	// Загрузка списка пользователей
	useEffect(() => {
		async function fetchUsers() {
			setLoadingUsers(true);
			try {
				const response = await fetch('/api/subscriptions');
				const data = await response.json();
				setUsers(data);
			} catch (error) {
				console.error('Failed to fetch users:', error);
			} finally {
				setLoadingUsers(false);
			}
		}

		fetchUsers();
	}, []);

	if (!state.isSupported) {
		return <p>Push notifications are not supported in this browser.</p>;
	}

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
			<div className='my-8 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4'>
					Push-уведомления
				</h1>
				{state.loading && <p>Loading...</p>}
				{state.subscription ? (
					<>
						<p>Вы подписаны на push-уведомления.</p>
						<button
							onClick={unsubscribeFromPush}
							disabled={state.loading}
							className='btn btn-outline w-full max-w-xs'
						>
							Отписаться
						</button>

						<div style={{ margin: '10px 0' }}>
							<label htmlFor='userSelect'>Выберите пользователя: </label>
							{loadingUsers ? (
								<p>Загрузка списка пользователей...</p>
							) : (
								<select
									id='userSelect'
									value={state.selectedUserId}
									onChange={e =>
										setState(prev => ({
											...prev,
											selectedUserId: e.target.value,
										}))
									}
									disabled={state.loading}
								>
									<option value=''>Выберите пользователя</option>
									{users.map((user, index) => (
										<option key={`${user.userId}-${index}`} value={user.userId}>
											{user.name}
										</option>
									))}
								</select>
							)}
						</div>

						<input
							type='text'
							placeholder='Введите сообщение'
							value={state.message}
							onChange={e =>
								setState(prev => ({ ...prev, message: e.target.value }))
							}
							disabled={state.loading}
							className='input input-bordered w-full max-w-xs text-3xl'
						/>
						<button
							onClick={sendTestNotification}
							disabled={state.loading || !state.selectedUserId}
							className='btn btn-outline w-full max-w-xs'
						>
							Отправить
						</button>
					</>
				) : (
					<>
						<p>Вы не подписаны на push-уведомления.</p>
						<button
							onClick={subscribeToPush}
							disabled={state.loading}
							className='btn btn-outline w-full max-w-xs'
						>
							Подписаться
						</button>
					</>
				)}
			</div>
		</div>
	);
}

export default function PushNotification() {
	return (
		<div>
			<PushNotificationManager />
		</div>
	);
}
