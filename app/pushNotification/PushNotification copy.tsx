'use client';

import { useState, useEffect } from 'react';
import { subscribeUser, unsubscribeUser, sendNotification } from './actions';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

interface SubscriptionState {
	isSupported: boolean;
	subscription: PushSubscription | null;
	message: string;
	loading: boolean;
}

function PushNotificationManager() {
	const [state, setState] = useState<SubscriptionState>({
		isSupported: false,
		subscription: null,
		message: '',
		loading: false,
	});

	useEffect(() => {
		if ('serviceWorker' in navigator && 'PushManager' in window) {
			setState(prev => ({ ...prev, isSupported: true }));
			registerServiceWorker();
		}
	}, []);

	async function registerServiceWorker() {
		try {
			const registration = await navigator.serviceWorker.register('/sw.js', {
				scope: '/',
				updateViaCache: 'none',
			});
			const sub = await registration.pushManager.getSubscription();
			setState(prev => ({ ...prev, subscription: sub }));
		} catch (error) {
			console.error('Error during service worker registration:', error);
		}
	}

	async function subscribeToPush() {
		if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
			console.error(
				'VAPID public key is not set in the environment variables.'
			);
			return;
		}

		try {
			setState(prev => ({ ...prev, loading: true }));
			const registration = await navigator.serviceWorker.ready;
			const existingSubscription =
				await registration.pushManager.getSubscription();
			if (existingSubscription) {
				setState(prev => ({ ...prev, subscription: existingSubscription }));
				console.log('Already subscribed to push notifications.');
				return;
			}

			const sub = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(
					process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
				),
			});
			setState(prev => ({ ...prev, subscription: sub }));
			const serializedSub = JSON.parse(JSON.stringify(sub));
			await subscribeUser(serializedSub);
		} catch (error) {
			console.error('Error during subscription:', error);
		} finally {
			setState(prev => ({ ...prev, loading: false }));
		}
	}

	async function unsubscribeFromPush() {
		try {
			setState(prev => ({ ...prev, loading: true }));
			if (!state.subscription) return;

			const endpoint = state.subscription.endpoint;
			await state.subscription.unsubscribe();
			setState(prev => ({ ...prev, subscription: null }));
			await unsubscribeUser(endpoint);
		} catch (error) {
			console.error('Error during unsubscription:', error);
		} finally {
			setState(prev => ({ ...prev, loading: false }));
		}
	}

	async function sendTestNotification() {
		try {
			setState(prev => ({ ...prev, loading: true }));
			if (state.subscription) {
				await sendNotification(state.message);
				setState(prev => ({ ...prev, message: '' }));
			}
		} catch (error) {
			console.error('Error during sending notification:', error);
		} finally {
			setState(prev => ({ ...prev, loading: false }));
		}
	}

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
