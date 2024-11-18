export function tgMessage(message) {
	let token = '7228464479:AAGLa3LqagpnkEaIU_J9aWpqk_uVgMz2JVc'; // Токен твоего бота
	let chat_id = '-1002412839155'; // ID чата

	fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			chat_id: chat_id,
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
