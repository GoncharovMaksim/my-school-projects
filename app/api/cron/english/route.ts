import filterCronPushNotificationEnglish from '@/app/pushNotification/filterCronPushNotificationEnglish';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Проверка заголовка Authorization
  const authHeader = req.headers.get('Authorization');
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Выполнение задачи только для английского языка
    const result = await filterCronPushNotificationEnglish();

    // Верните ответ
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error('Error in english cronPushNotification:', error);
    return NextResponse.json(
      { error: 'Failed to execute english cronPushNotification' },
      { status: 500 }
    );
  }
}
