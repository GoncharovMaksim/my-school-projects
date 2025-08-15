'use server';

import { sendNotification } from './actions';
import MathStatistics from '@/models/MathStatistics'; // Модель статистики
import Subscription from '@/models/Subscription'; // Модель подписок
import connectDB from '@/configs/connectDB';
import { NOTIFICATION_CRITERIA } from '@/configs/notificationCriteria';

export default async function filterCronPushNotificationMath() {
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
    const todayStats = await MathStatistics.find({
      createdAt: { $gte: today },
      grade: { $gte: NOTIFICATION_CRITERIA.math.minGrade },
    });

    console.log(
      '[INFO] Found records for today with grade >= 4:',
      todayStats.length
    );

    // Логируем детали найденных записей
    console.log(
      '[DEBUG] Today stats details:',
      todayStats.map(stat => ({
        userId: stat.userId.toString(),
        difficultyLevel: stat.difficultyLevel,
        operator: stat.operator,
        grade: stat.grade,
        createdAt: stat.createdAt,
      }))
    );

    // Группируем записи по пользователям и анализируем выполнение
    const userStats = new Map();

    todayStats.forEach(stat => {
      const userId = stat.userId.toString();
      const difficultyLevel = stat.difficultyLevel;
      const operator = stat.operator;

      if (!userStats.has(userId)) {
        userStats.set(userId, {
          userId,
          totalRecords: 0,
          byDifficulty: {
            1: { '+': 0, '-': 0, '*': 0, '/': 0 },
            2: { '+': 0, '-': 0, '*': 0, '/': 0 },
            3: { '+': 0, '-': 0, '*': 0, '/': 0 },
          },
        });
      }

      const userData = userStats.get(userId);
      userData.totalRecords++;

      // Преобразуем русские названия операторов в английские
      const operatorMap: { [key: string]: string } = {
        Сложение: '+',
        Вычитание: '-',
        Умножение: '*',
        Деление: '/',
      };

      const mappedOperator = operatorMap[operator] || operator;
      console.log(
        `[DEBUG] Mapping operator: "${operator}" -> "${mappedOperator}" for user ${userId}, level ${difficultyLevel}`
      );
      userData.byDifficulty[difficultyLevel][mappedOperator]++;
    });

    console.log(
      '[DEBUG] Grouped user stats:',
      Array.from(userStats.entries()).map(([userId, data]) => ({
        userId,
        totalRecords: data.totalRecords,
        byDifficulty: data.byDifficulty,
      }))
    );

    // Проверяем выполнение критериев для каждого пользователя
    const usersWithSufficientStats = [];

    for (const [userId, userData] of userStats) {
      console.log(`[DEBUG] Analyzing user ${userId}:`, {
        totalRecords: userData.totalRecords,
        byDifficulty: userData.byDifficulty,
      });

      // Проверяем выполнение для каждого уровня сложности
      const level1Complete =
        NOTIFICATION_CRITERIA.math.difficultyLevels[1].operators.every(
          op =>
            userData.byDifficulty[1][op] >=
            NOTIFICATION_CRITERIA.math.difficultyLevels[1].requiredRecords
        );

      const level2Complete =
        NOTIFICATION_CRITERIA.math.difficultyLevels[2].operators.every(
          op =>
            userData.byDifficulty[2][op] >=
            NOTIFICATION_CRITERIA.math.difficultyLevels[2].requiredRecords
        );

      const level3Complete =
        NOTIFICATION_CRITERIA.math.difficultyLevels[3].operators.every(
          op =>
            userData.byDifficulty[3][op] >=
            NOTIFICATION_CRITERIA.math.difficultyLevels[3].requiredRecords
        );

      console.log(`[DEBUG] User ${userId} completion status:`, {
        level1Complete,
        level2Complete,
        level3Complete,
        level1Details:
          NOTIFICATION_CRITERIA.math.difficultyLevels[1].operators.map(op => ({
            operator: op,
            required:
              NOTIFICATION_CRITERIA.math.difficultyLevels[1].requiredRecords,
            actual: userData.byDifficulty[1][op],
          })),
        level2Details:
          NOTIFICATION_CRITERIA.math.difficultyLevels[2].operators.map(op => ({
            operator: op,
            required:
              NOTIFICATION_CRITERIA.math.difficultyLevels[2].requiredRecords,
            actual: userData.byDifficulty[2][op],
          })),
        level3Details:
          NOTIFICATION_CRITERIA.math.difficultyLevels[3].operators.map(op => ({
            operator: op,
            required:
              NOTIFICATION_CRITERIA.math.difficultyLevels[3].requiredRecords,
            actual: userData.byDifficulty[3][op],
          })),
      });

      // Пользователь выполнил требования, если завершил хотя бы один уровень
      if (level1Complete || level2Complete || level3Complete) {
        usersWithSufficientStats.push({
          userId,
          totalRecords: userData.totalRecords,
          level1Complete,
          level2Complete,
          level3Complete,
          byDifficulty: userData.byDifficulty,
        });
        console.log(
          `[DEBUG] User ${userId} meets criteria - added to sufficient stats`
        );
      } else {
        // Альтернативная проверка: пользователь выполнил хотя бы один оператор с достаточным количеством записей
        const hasAnySufficientOperator = Object.values(
          userData.byDifficulty
        ).some(level =>
          Object.values(level as Record<string, number>).some(
            count => count >= 1
          )
        );

        console.log(`[DEBUG] User ${userId} alternative criteria check:`, {
          hasAnySufficientOperator,
          operatorCounts: Object.fromEntries(
            Object.entries(userData.byDifficulty).map(([level, operators]) => [
              level,
              Object.fromEntries(
                Object.entries(operators as Record<string, number>).filter(
                  ([, count]) => count > 0
                )
              ),
            ])
          ),
        });

        if (hasAnySufficientOperator) {
          usersWithSufficientStats.push({
            userId,
            totalRecords: userData.totalRecords,
            level1Complete,
            level2Complete,
            level3Complete,
            byDifficulty: userData.byDifficulty,
            alternativeCriteria: true,
          });
          console.log(
            `[DEBUG] User ${userId} meets alternative criteria - added to sufficient stats`
          );
        } else {
          console.log(`[DEBUG] User ${userId} does NOT meet criteria`);
        }
      }
    }

    console.log(
      '[INFO] Found users with sufficient stats:',
      usersWithSufficientStats.map(user => ({
        userId: user.userId,
        totalRecords: user.totalRecords,
        level1Complete: user.level1Complete,
        level2Complete: user.level2Complete,
        level3Complete: user.level3Complete,
        byDifficulty: user.byDifficulty,
      }))
    );

    // Получаем список пользователей с достаточной статистикой
    const userIdsWithSufficientStats = usersWithSufficientStats.map(
      stat => stat.userId
    );

    // Уведомления отправляем только тем, кто НЕ выполнил критерии
    // Это включает пользователей без записей за сегодня и тех, кто не выполнил требования
    const usersToNotify = userIdsFromSubscriptions.filter(userId => {
      // Если у пользователя нет записей за сегодня, он должен получить уведомление
      if (!userStats.has(userId)) {
        console.log(
          `[DEBUG] User ${userId} has no records today - will notify`
        );
        return true;
      }

      // Если у пользователя есть записи, но он не выполнил критерии, он должен получить уведомление
      const shouldNotify = !userIdsWithSufficientStats.includes(userId);
      if (shouldNotify) {
        console.log(
          `[DEBUG] User ${userId} has records but didn't meet criteria - will notify`
        );
      } else {
        console.log(`[DEBUG] User ${userId} met criteria - will NOT notify`);
      }
      return shouldNotify;
    });

    if (usersToNotify.length === 0) {
      console.log('[INFO] No users to notify.');
      return { success: true, message: 'Нет пользователей для уведомлений.' };
    }

    console.log('[INFO] Users to notify:', usersToNotify);

    // Отправка уведомлений пользователям, которые не выполнили критерии
    const message = 'Математика не сделана! Выполните задания по математике.';
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
