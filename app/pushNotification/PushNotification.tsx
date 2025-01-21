'use client';

import { usePushSubscription } from './usePushSubscription';

function PushNotificationManager() {
	const {
		state,
		setState,
		subscribeToPush,
		unsubscribeFromPush,
		sendTestNotification,
	} = usePushSubscription();

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
						Unsubscribe
					</button>
					<input
						type='text'
						placeholder='Введите сообщение'
						value={state.message}
						onChange={e =>
							setState(prev => ({ ...prev, message: e.target.value }))
						}
						disabled={state.loading}
					/>
					<button onClick={sendTestNotification} disabled={state.loading}>
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
