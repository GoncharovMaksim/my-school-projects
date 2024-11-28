export default function TgApi(message:string) {
	const TOKEN = process.env.TOKEN; // Токен твоего бота
	const CHAT_ID = process.env.CHAT_ID; // ID чата

	fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			chat_id: CHAT_ID,
			text: message,
		}),
	})
		.then(response => response.json())
		.then(data => {
			console.log('Успешно отправлено:', data);
		})
		.catch(error => {
			console.error('Ошибка при отправке:', error);
		});
}
