const getQuestions = async (questionsFilter:string) => {
	try {
		const params = new URLSearchParams(questionsFilter).toString();
		const response = await fetch(`/api/questions?${params}`, {
			method: 'GET',
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`Ошибка ответа сервера: ${response.status} — ${errorText}`
			);
		}

		const data = await response.json();
		console.log('Загружены вопросы:', data);
		return data;
	} catch (error) {
		console.error('Ошибка при загрузке вопросов:', error);
	}
};

export default getQuestions;
