import filterCronPushNotificationMath from '@/app/pushNotification/filterCronPushNotificationMath';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Проверка заголовка Authorization
  const authHeader = req.headers.get('Authorization');
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Выполнение задачи только для математики
    const result = await filterCronPushNotificationMath();

    // Верните ответ
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error('Error in math cronPushNotification:', error);
    return NextResponse.json(
      { error: 'Failed to execute math cronPushNotification' },
      { status: 500 }
    );
  }
}
