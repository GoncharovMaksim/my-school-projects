'use client';

import { usePushSubscription } from './usePushSubscription';
import DropdownMenu from '@/components/DropdownMenu';
import { UserSession } from '@/types/userSession';
import { useSession } from 'next-auth/react';

function PushNotificationManager() {
	const {
		state,
		setState,
		subscribeToPush,
		unsubscribeFromPush,
		sendTestNotification,
		users,
		loadingUsers,
	} = usePushSubscription();

	const { data: session } = useSession() as { data: UserSession | null };
	let isAdmin = false;
	if (session?.user?.isAdmin === true) {
		isAdmin = true;
	}
	console.log('state.subscription', state.subscription);

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
							onClick={() => {
								unsubscribeFromPush();
								localStorage.setItem('notificationsDisabled', 'true');
							}}
							disabled={state.loading}
							className='btn btn-outline w-full max-w-xs'
						>
							Отписаться
						</button>

						{isAdmin ? (
							<>
								{loadingUsers ? (
									<p>Загрузка списка пользователей...</p>
								) : (
									<DropdownMenu
										defaultLabel={`Выберите пользователя:`}
										options={[
											{
												label: 'Все пользователи',
												onClick: () => {
													setState(prev => ({
														...prev,
														selectedUserId: '',
													}));
												},
											},
											...users.map(user => ({
												label: ` ${user.name}`,
												onClick: () => {
													setState(prev => ({
														...prev,
														selectedUserId: user.userId,
													}));
												},
											})),
										]}
									/>
								)}

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
									// disabled={state.loading || !state.selectedUserId}
									className='btn btn-outline w-full max-w-xs'
								>
									Отправить
								</button>
							</>
						) : (
							<div>Для отправки уведомлений нужны права Администратора</div>
						)}
					</>
				) : (
					<>
						<p>Вы не подписаны на push-уведомления.</p>
						<button
							onClick={() => {
								subscribeToPush();
								localStorage.setItem('notificationsDisabled', 'false');
							}}
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
