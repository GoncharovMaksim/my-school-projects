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

    // Получаем все записи за сегодня с оценкой 4 или 5
    const todayStats = await EnglishStatistics.find({
      createdAt: { $gte: today },
      grade: { $gte: NOTIFICATION_CRITERIA.english.minGrade },
    });

    console.log(
      '[INFO] Found records for today with grade >= 4:',
      todayStats.length
    );

    // Группируем записи по пользователям и анализируем выполнение
    const userStats = new Map();

    todayStats.forEach(stat => {
      const userId = stat.userId.toString();

      if (!userStats.has(userId)) {
        userStats.set(userId, {
          userId,
          totalRecords: 0,
          totalTimeSpent: 0,
          totalPercentCorrect: 0,
          records: [],
        });
      }

      const userData = userStats.get(userId);
      userData.totalRecords++;
      userData.totalTimeSpent += stat.timeSpent;
      userData.totalPercentCorrect += stat.percentCorrectAnswer;
      userData.records.push(stat);
    });

    // Проверяем выполнение критериев для каждого пользователя
    const usersWithSufficientStats = [];

    for (const [userId, userData] of userStats) {
      // Вычисляем средние значения
      const avgPercentCorrect =
        userData.totalPercentCorrect / userData.totalRecords;
      const avgTimeSpent = userData.totalTimeSpent / userData.totalRecords;

      // Проверяем выполнение всех критериев
      const hasMinRecords =
        userData.totalRecords >= NOTIFICATION_CRITERIA.english.minRecords;
      const hasMinPercentCorrect =
        avgPercentCorrect >= NOTIFICATION_CRITERIA.english.minPercentCorrect;
      const hasMinTimeSpent =
        avgTimeSpent >= NOTIFICATION_CRITERIA.english.minTimeSpent;

      // Пользователь выполнил требования, если все критерии выполнены
      if (hasMinRecords && hasMinPercentCorrect && hasMinTimeSpent) {
        usersWithSufficientStats.push({
          userId,
          totalRecords: userData.totalRecords,
          avgPercentCorrect,
          avgTimeSpent,
          hasMinRecords,
          hasMinPercentCorrect,
          hasMinTimeSpent,
        });
      }
    }

    console.log(
      '[INFO] Found users with sufficient stats:',
      usersWithSufficientStats.map(user => ({
        userId: user.userId,
        totalRecords: user.totalRecords,
        avgPercentCorrect: user.avgPercentCorrect,
        avgTimeSpent: user.avgTimeSpent,
        hasMinRecords: user.hasMinRecords,
        hasMinPercentCorrect: user.hasMinPercentCorrect,
        hasMinTimeSpent: user.hasMinTimeSpent,
      }))
    );

    // Получаем список пользователей с достаточной статистикой
    const userIdsWithSufficientStats = usersWithSufficientStats.map(
      stat => stat.userId
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
    const message =
      'Английский не сделан! Выполните задания по английскому языку.';
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
