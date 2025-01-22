// hooks/usePushSubscription.ts

import { useState, useEffect } from 'react';
import { subscribeUser, unsubscribeUser, sendNotification } from './actions';
import { useSession } from 'next-auth/react';

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
	selectedUserId: string;
}
type UserSession = {
	user?: {
		id?: string;
		name?: string;
		nickName?: string;
		email?: string;
		image?: string;
	};
};

export function usePushSubscription() {
	const [state, setState] = useState<SubscriptionState>({
		isSupported: false,
		subscription: null,
		message: '',
		loading: false,
		selectedUserId: '',
	});

	const { data: session } = useSession() as { data: UserSession | null };

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

			// Получение готового service worker
			const registration = await navigator.serviceWorker.ready;

			// Проверка на существующую подписку
			const existingSubscription =
				await registration.pushManager.getSubscription();
			if (existingSubscription) {
				setState(prev => ({ ...prev, subscription: existingSubscription }));
				console.log('Already subscribed to push notifications.');
				return;
			}

			// Запрос новой подписки
			const sub = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(
					process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
				),
			});

			setState(prev => ({ ...prev, subscription: sub }));

			// Получение `userId` (например, из cookies, sessionStorage или API)

			const userId = session?.user?.id;
			const name = session?.user?.name;
			if (!userId) {
				throw new Error('User ID is not available in the session.');
			}
			if (!name) {
				throw new Error('name is not available in the session.');
			}

			// Сериализация подписки
			// const serializedSub = JSON.parse(JSON.stringify(sub));
			// await subscribeUser({ ...serializedSub, userId });
			const serializedSub = JSON.parse(JSON.stringify(sub));
			await subscribeUser(serializedSub, userId,name);
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

			if (!state.subscription) {
				console.error('No subscription found.');
				return;
			}

			if (!state.selectedUserId) {
				console.error('No user selected.');
				return;
			}

			// Отправляем уведомление с сообщением и идентификатором пользователя
			await sendNotification(state.message, state.selectedUserId);

			// После успешной отправки очищаем сообщение
			setState(prev => ({ ...prev, message: '' }));
		} catch (error) {
			console.error('Error during sending notification:', error);
			alert('Ошибка отправки уведомления. Попробуйте еще раз.');
		} finally {
			setState(prev => ({ ...prev, loading: false }));
		}
	}

	return {
		state,
		setState,
		subscribeToPush,
		unsubscribeFromPush,
		sendTestNotification,
	};
}
