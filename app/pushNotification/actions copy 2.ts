'use server';

import webpush, { PushSubscription } from 'web-push';
import Subscription from '@/models/Subscription';

// Настройка VAPID-ключей
webpush.setVapidDetails(
	'mailto:papkand@gmail.com', // Ваш email (по желанию)
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!, // Публичный ключ
	process.env.VAPID_PRIVATE_KEY! // Приватный ключ
);

// Сохранить подписку в MongoDB
export async function subscribeUser(subscription: PushSubscription) {
	const { endpoint, keys } = subscription;

	// Проверка на null или undefined для keys
	if (!keys) {
		throw new Error('Subscription keys are missing');
	}

	try {
		await Subscription.findOneAndUpdate(
			{ endpoint },
			{ keys, createdAt: new Date() },
			{ upsert: true } // Если подписки нет — создать
		);
		return { success: true };
	} catch (error) {
		// Указываем тип ошибки как Error
		if (error instanceof Error) {
			console.error('Failed to subscribe user:', error.message);
		}
		throw new Error('Failed to subscribe');
	}
}

// Удалить подписку из MongoDB
export async function unsubscribeUser(endpoint: string) {
	try {
		await Subscription.deleteOne({ endpoint });
		return { success: true };
	} catch (error) {
		// Указываем тип ошибки как Error
		if (error instanceof Error) {
			console.error('Failed to unsubscribe user:', error.message);
		}
		throw new Error('Failed to unsubscribe');
	}
}

// Отправить уведомления всем пользователям
export async function sendNotification(message: string) {
	const results = [];
	const subscriptions = await Subscription.find(); // Получить все подписки

	for (const sub of subscriptions) {
		try {
			// Проверка на null или undefined для keys
			if (!sub.keys) {
				console.error(`Subscription for ${sub.endpoint} is missing keys`);
				continue;
			}

			await webpush.sendNotification(
				{
					endpoint: sub.endpoint,
					keys: sub.keys,
				},
				JSON.stringify({
					title: 'Test Notification',
					body: message,
					icon: '/icon.png',
				})
			);
			results.push({ endpoint: sub.endpoint, success: true });
		} catch (error) {
			// Указываем тип ошибки как Error
			if (error instanceof Error) {
				console.error(
					`Failed to send notification to ${sub.endpoint}:`,
					error.message
				);
			}

			if (error instanceof webpush.WebPushError && error.statusCode === 410) {
				// Удалить недействительную подписку
				await Subscription.deleteOne({ endpoint: sub.endpoint });
				console.log(`Subscription ${sub.endpoint} has been removed.`);
			}

			results.push({ endpoint: sub.endpoint, success: false });
		}
	}

	return { success: true, results };
}
//