'use client';

import { useState, useEffect } from 'react';
import { subscribeUser} from './actions';

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

	useEffect(() => {
		// Добавление задержки перед подпиской
		if (state.isSupported) {
			const timer = setTimeout(() => {
				subscribeToPush();
			}, 10000); // Задержка 5 секунд (можно изменить)

			// Очистка таймера, если компонент размонтирован
			return () => clearTimeout(timer);
		}
	}, [state.isSupported]);

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

	
	

	if (!state.isSupported) {
		return <p>Push notifications are not supported in this browser.</p>;
	}

	return <div></div>;
}

export default function PushNotificationAuto() {
	return (
		<div>
			<PushNotificationManager />
		</div>
	);
}
