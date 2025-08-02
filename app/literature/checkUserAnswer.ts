interface UserAnswer {
	questionId: number;
	selected: string[];
}


const checkUserAnswer = async (userAnswer: UserAnswer[]) => {
	try {
		const response = await fetch('/api/check-answers', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userAnswer),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`Ошибка ответа сервера: ${response.status} — ${errorText}`
			);
		}

		const data = await response.json();
		console.log('Результат проверки:', data);
		return data;
	} catch (error) {
		console.error('Ошибка при проверке ответов:', error);
	}
};

export default checkUserAnswer;
