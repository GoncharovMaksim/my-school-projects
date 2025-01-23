
import filterCronPushNotificationEnglish from '@/app/pushNotification/filterCronPushNotificationEnglish';
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
		// Выполнение задачи
		const resultMath = await filterCronPushNotificationMath();
		const resultEnglish = await filterCronPushNotificationEnglish();

		// Верните ответ
		const combinedResult = { resultMath, resultEnglish };
		return NextResponse.json({ ok: true, combinedResult });
	} catch (error) {
		console.error('Error in cronPushNotification:', error);
		return NextResponse.json(
			{ error: 'Failed to execute cronPushNotification' },
			{ status: 500 }
		);
	}
}
