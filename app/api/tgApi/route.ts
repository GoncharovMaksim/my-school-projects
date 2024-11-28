import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const { message } = await request.json();

	const TOKEN = process.env.TOKEN; // Токен вашего бота
	const CHAT_ID = process.env.CHAT_ID; // ID чата

	if (!TOKEN || !CHAT_ID) {
		return NextResponse.json(
			{ error: 'Токен или ID чата отсутствуют' },
			{ status: 500 }
		);
	}

	try {
		const telegramResponse = await fetch(
			`https://api.telegram.org/bot${TOKEN}/sendMessage`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					chat_id: CHAT_ID,
					text: message,
				}),
			}
		);

		if (!telegramResponse.ok) {
			throw new Error('Ошибка отправки сообщения в Telegram');
		}

		const data = await telegramResponse.json();
		return NextResponse.json({ success: true, data });
	} catch (error) {
		console.error('Ошибка:', error);
		return NextResponse.json(
			{ error: 'Ошибка при отправке сообщения' },
			{ status: 500 }
		);
	}
}
