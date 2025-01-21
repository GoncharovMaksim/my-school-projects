'use server';



import webpush, { PushSubscription, WebPushError } from 'web-push';
import  connectDB from '@/configs/connectDB'
import Subscription from '@/models/Subscription';

// Настройка VAPID-ключей
webpush.setVapidDetails(
	'mailto:papkand@gmail.com', // Ваш email (по желанию)
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!, // Публичный ключ
	process.env.VAPID_PRIVATE_KEY! // Приватный ключ
);

// Логирование подключения к MongoDB
async function connectToDatabase() {
	console.log('Connecting to MongoDB...');
	try {
		await connectDB();
		console.log('Successfully connected to MongoDB');
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
		throw new Error('Database connection failed');
	}
}

// Типизация для результата работы функций
interface SubscribeResult {
	success: boolean;
}

interface SendNotificationResult {
	success: boolean;
	results: { endpoint: string; success: boolean }[];
}

// Сохранить подписку в MongoDB
export async function subscribeUser(
	subscription: PushSubscription,
	userId: string
): Promise<SubscribeResult> {
	const { endpoint, keys } = subscription;

	if (!keys) {
		throw new Error('Subscription keys are missing');
	}

	try {
		console.log('Saving subscription:', subscription);
		await Subscription.findOneAndUpdate(
			{ endpoint }, // Найти по endpoint
			{ keys, userId, createdAt: new Date() }, // Обновить или добавить userId
			{ upsert: true, new: true } // Если подписки нет — создать
		);
		console.log(
			`Subscription saved for user: ${userId}, endpoint: ${endpoint}`
		);
		return { success: true };
	} catch (error) {
		console.error('Failed to save subscription:', error);
		throw new Error('Failed to subscribe');
	}
}

// Удалить подписку из MongoDB
export async function unsubscribeUser(
	endpoint: string
): Promise<SubscribeResult> {
	try {
		console.log(`Removing subscription for endpoint: ${endpoint}`);
		await Subscription.deleteOne({ endpoint });
		console.log(`Subscription removed for endpoint: ${endpoint}`);
		return { success: true };
	} catch (error) {
		console.error('Failed to unsubscribe user:', error);
		throw new Error('Failed to unsubscribe');
	}
}

// Отправить уведомления всем пользователям
export async function sendNotification(
	message: string
): Promise<SendNotificationResult> {
	const results: { endpoint: string; success: boolean }[] = [];

	try {
		console.log('Fetching all subscriptions from database...');
		const subscriptions = await Subscription.find();
		console.log(`Found ${subscriptions.length} subscriptions.`);

		for (const sub of subscriptions) {
			try {
				if (!sub.keys) {
					console.error(`Subscription for ${sub.endpoint} is missing keys.`);
					continue;
				}

				console.log(`Sending notification to endpoint: ${sub.endpoint}`);
				await webpush.sendNotification(
					{
						endpoint: sub.endpoint,
						keys: sub.keys,
					},
					JSON.stringify({
						title: 'Школа112',
						body: message,
						icon: '/icon-192x192.png',
					})
				);
				console.log(`Notification sent to endpoint: ${sub.endpoint}`);
				results.push({ endpoint: sub.endpoint, success: true });
			} catch (error) {
				console.error(`Failed to send notification to ${sub.endpoint}:`, error);

				if (error instanceof WebPushError && error.statusCode === 410) {
					console.log(
						`Subscription ${sub.endpoint} is invalid and will be removed.`
					);
					await Subscription.deleteOne({ endpoint: sub.endpoint });
				}

				results.push({ endpoint: sub.endpoint, success: false });
			}
		}
	} catch (error) {
		console.error('Error while sending notifications:', error);
		throw new Error('Failed to send notifications');
	}

	return { success: true, results };
}

// Подключение к базе данных при запуске
connectToDatabase().catch(err => {
	console.error('Critical error during startup:', err);
});
