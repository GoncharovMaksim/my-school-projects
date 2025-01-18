'use server';

import webpush, { PushSubscription } from 'web-push';

webpush.setVapidDetails(
	'mailto:papkand@gmail.com',
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
	process.env.VAPID_PRIVATE_KEY!
);

let subscription: PushSubscription | null = null;

export async function subscribeUser(sub: PushSubscription) {
	subscription = sub;
	// В продакшн-версии вы должны хранить подписку в базе данных
	return { success: true };
}

export async function unsubscribeUser() {
	subscription = null;
	// В продакшн-версии вы должны удалить подписку из базы данных
	return { success: true };
}

export async function sendNotification(message: string) {
	if (!subscription) {
		throw new Error('No subscription available');
	}

	try {
		await webpush.sendNotification(
			subscription,
			JSON.stringify({
				title: 'Test Notification',
				body: message,
				icon: '/icon.png',
			})
		);
		return { success: true };
	} catch (error) {
		console.error('Error sending push notification:', error);
		return { success: false, error: 'Failed to send notification' };
	}
}
//