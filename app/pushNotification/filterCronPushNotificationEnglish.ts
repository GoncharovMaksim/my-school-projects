'use server';

import { sendNotification } from './actions';
import EnglishStatistics from '@/models/EnglishStatistics'; // Модель статистики
import Subscription from '@/models/Subscription'; // Модель подписок
import connectDB from '@/configs/connectDB';
import { NOTIFICATION_CRITERIA } from '@/configs/notificationCriteria';

export default async function filterCronPushNotificationEnglish() {
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
    // Учитываем любые записи за сегодня (оценка >= 1)
    const usersWithSufficientStats = await EnglishStatistics.aggregate([
      {
        $match: {
          // Фильтр: только записи за сегодня с любой оценкой
          createdAt: { $gte: today },
          grade: { $gte: NOTIFICATION_CRITERIA.english.minGrade }, // Оценка >= 1
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
          count: { $gte: NOTIFICATION_CRITERIA.english.minRecords }, // Условие: минимум 1 запись
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

    // Уведомления отправляем только тем, кто НЕ выполнил критерии
    // Это включает пользователей без записей за сегодня и тех, кто не выполнил требования
    const usersToNotify = userIdsFromSubscriptions.filter(userId => {
      // Если у пользователя нет записей за сегодня, он должен получить уведомление
      const userHasRecords = usersWithSufficientStats.some(
        stat => stat._id.toString() === userId
      );

      if (!userHasRecords) {
        console.log(
          `[DEBUG] User ${userId} has no records today - will notify`
        );
      } else {
        console.log(`[DEBUG] User ${userId} has records - will NOT notify`);
      }

      return !userHasRecords;
    });

    if (usersToNotify.length === 0) {
      console.log('[INFO] No users to notify.');
      return { success: true, message: 'Нет пользователей для уведомлений.' };
    }

    console.log('[INFO] Users to notify:', usersToNotify);

    // Отправка уведомлений пользователям, которые не выполнили критерии
    const message =
      'Английский не сделан! Выполните хотя бы одно задание по английскому языку.';
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
