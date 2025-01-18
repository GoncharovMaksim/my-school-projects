'use client';

import { useState, useEffect } from 'react';
import { subscribeUser, unsubscribeUser, sendNotification } from './actions';

function urlBase64ToUint8Array(base64String: string) {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

function PushNotificationManager() {
	const [isSupported, setIsSupported] = useState(false);
	const [subscription, setSubscription] = useState<PushSubscription | null>(
		null
	);
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if ('serviceWorker' in navigator && 'PushManager' in window) {
			setIsSupported(true);
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
			setSubscription(sub);
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
			setLoading(true);
			const registration = await navigator.serviceWorker.ready;
			const existingSubscription =
				await registration.pushManager.getSubscription();
			if (existingSubscription) {
				setSubscription(existingSubscription);
				console.log('Already subscribed to push notifications.');
				return;
			}

			const sub = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(
					process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
				),
			});
			setSubscription(sub);
			const serializedSub = JSON.parse(JSON.stringify(sub));
			await subscribeUser(serializedSub);
		} catch (error) {
			console.error('Error during subscription:', error);
		} finally {
			setLoading(false);
		}
	}

	async function unsubscribeFromPush() {
		try {
			setLoading(true);
			if (!subscription) return;

			const endpoint = subscription.endpoint;
			await subscription.unsubscribe();
			setSubscription(null);
			await unsubscribeUser(endpoint);
		} catch (error) {
			console.error('Error during unsubscription:', error);
		} finally {
			setLoading(false);
		}
	}

	async function sendTestNotification() {
		try {
			setLoading(true);
			if (subscription) {
				await sendNotification(message);
				setMessage('');
			}
		} catch (error) {
			console.error('Error during sending notification:', error);
		} finally {
			setLoading(false);
		}
	}

	if (!isSupported) {
		return <p>Push notifications are not supported in this browser.</p>;
	}

	return (
		<div>
			<h3>Push Notifications</h3>
			{loading && <p>Loading...</p>}
			{subscription ? (
				<>
					<p>You are subscribed to push notifications.</p>
					<button onClick={unsubscribeFromPush} disabled={loading}>
						Unsubscribe
					</button>
					<input
						type='text'
						placeholder='Enter notification message'
						value={message}
						onChange={e => setMessage(e.target.value)}
						disabled={loading}
					/>
					<button onClick={sendTestNotification} disabled={loading}>
						Send Test
					</button>
				</>
			) : (
				<>
					<p>You are not subscribed to push notifications.</p>
					<button onClick={subscribeToPush} disabled={loading}>
						Subscribe
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
