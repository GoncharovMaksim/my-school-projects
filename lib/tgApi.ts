export default async function TgApi(message: string) {
	try {
		const response = await fetch('/api/tgApi', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ message }),
		});

		if (!response.ok) {
			throw new Error('Ошибка отправки сообщения');
		}

		const data = await response.json();
		console.log('Сообщение успешно отправлено:', data);
	} catch (error) {
		console.error('Ошибка:', error);
	}
}
