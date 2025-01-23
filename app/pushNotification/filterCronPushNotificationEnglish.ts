'use server';

import { sendNotification } from './actions';
import EnglishStatistics from '@/models/EnglishStatistics'; // Модель статистики
import Subscription from '@/models/Subscription'; // Модель подписок
import connectDB from '@/configs/connectDB';

export default async function filterCronPushNotificationEnglish() {
	// Минимальное количество записей в статистике за день
	const MIN_LIMIT = 1;

	async function connectToDatabase() {
		console.log('[INFO] Connecting to MongoDB...');
		try {
			await connectDB();
			console.log('[INFO] Successfully connected to MongoDB');
		} catch (error) {
			console.error('[ERROR] Error connecting to MongoDB:', error);
			throw new Error('Database connection failed');
		}
	}

	await connectToDatabase();

	try {
		// Получение текущей даты (с 00:00:00 текущего дня)
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		console.log('[INFO] Filter date set to:', today);

		// Получаем всех пользователей из подписок
		const subscriptions = await Subscription.find();
		const userIdsFromSubscriptions = subscriptions.map(sub =>
			sub.userId.toString()
		);

		console.log('[INFO] Found subscriptions:', userIdsFromSubscriptions);

		// Поиск пользователей с достаточным количеством записей в статистике
		const usersWithSufficientStats = await EnglishStatistics.aggregate([
			{
				$match: {
					// Фильтр: только записи за сегодня
					createdAt: { $gte: today },
				},
			},
			{
				$group: {
					_id: '$userId', // Группировка по ID пользователя
					count: { $sum: 1 }, // Подсчет записей
				},
			},
			{
				$match: {
					count: { $gte: MIN_LIMIT }, // Условие: больше или равно минимальному лимиту
				},
			},
		]);

		console.log(
			'[INFO] Found users with sufficient stats:',
			usersWithSufficientStats.map(user => ({
				userId: user._id,
				count: user.count,
			}))
		);

		// Получаем список пользователей с достаточной статистикой
		const userIdsWithSufficientStats = usersWithSufficientStats.map(stat =>
			stat._id.toString()
		);

		// Убираем из списка пользователей из подписок тех, у кого есть достаточная статистика
		const usersToNotify = userIdsFromSubscriptions.filter(
			userId => !userIdsWithSufficientStats.includes(userId)
		);

		if (usersToNotify.length === 0) {
			console.log('[INFO] No users to notify.');
			return { success: true, message: 'Нет пользователей для уведомлений.' };
		}

		console.log('[INFO] Users to notify:', usersToNotify);

		// Отправка уведомлений оставшимся пользователям
		const message = 'Английский не сделан!';
		for (const userId of usersToNotify) {
			console.log(`[INFO] Sending notification to userId: ${userId}`);
			try {
				await sendNotification(message, userId);
				console.log(
					`[INFO] Notification successfully sent to userId: ${userId}`
				);
			} catch (sendError) {
				console.error(
					`[ERROR] Failed to send notification to userId: ${userId}`,
					sendError
				);
			}
		}

		console.log('[INFO] Notifications sent successfully.');
		return { success: true, message: 'Уведомления отправлены успешно!' };
	} catch (error) {
		console.error('[ERROR] Error during notification process:', error);
		return {
			success: false,
			message: 'Ошибка при отправке уведомлений.',
			error,
		};
	}
}
