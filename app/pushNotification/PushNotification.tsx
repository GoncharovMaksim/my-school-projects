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
		<div>
			<h3>Push-уведомления</h3>
			{state.loading && <p>Loading...</p>}
			{state.subscription ? (
				<>
					<p>Вы подписаны на push-уведомления.</p>
					<button onClick={unsubscribeFromPush} disabled={state.loading}>
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
					/>
					<button
						onClick={sendTestNotification}
						disabled={state.loading || !state.selectedUserId}
					>
						Отправить
					</button>
				</>
			) : (
				<>
					<p>Вы не подписаны на push-уведомления.</p>
					<button onClick={subscribeToPush} disabled={state.loading}>
						Подписаться
					</button>
				</>
			)}
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
