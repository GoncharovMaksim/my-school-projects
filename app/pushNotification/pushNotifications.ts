// pushNotifications.ts

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
	try {
		return await navigator.serviceWorker.register('/sw.js', {
			scope: '/',
			updateViaCache: 'none',
		});
	} catch (error) {
		console.error('Error registering service worker:', error);
		return null;
	}
}

// Конкретизация типов для subscribeUser и unsubscribeUser
type SubscribeUser = (subscription: PushSubscription) => Promise<void>;
type UnsubscribeUser = (endpoint: string) => Promise<void>;

export async function subscribeToPush(
	vapidKey: string,
	subscribeUser: SubscribeUser
): Promise<PushSubscription | null> {
	try {
		const registration = await navigator.serviceWorker.ready;
		const existingSubscription =
			await registration.pushManager.getSubscription();
		if (existingSubscription) {
			console.log('Already subscribed to push notifications.');
			return existingSubscription;
		}

		const sub = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(vapidKey),
		});
		const serializedSub = JSON.parse(JSON.stringify(sub));
		await subscribeUser(serializedSub); // передаем подписку

		return sub;
	} catch (error) {
		console.error('Error during subscription:', error);
		return null;
	}
}

export async function unsubscribeFromPush(
	subscription: PushSubscription | null,
	unsubscribeUser: UnsubscribeUser
): Promise<void> {
	if (!subscription) return;

	try {
		const endpoint = subscription.endpoint;
		await subscription.unsubscribe();
		await unsubscribeUser(endpoint); // передаем endpoint
	} catch (error) {
		console.error('Error during unsubscription:', error);
	}
}
