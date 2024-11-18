'use client';
// api.js
export async function fetchWords(filters) {
	const queryParams = new URLSearchParams(filters).toString();
	const url = `/english/api/words?${queryParams}`;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Ошибка: ${response.statusText}`);
		}

		const data = await response.json();
		return data; // Верните данные для дальнейшего использования
	} catch (error) {
		console.error('Ошибка при получении слов:', error);
	}
}

export async function fetchAvailableOptions(schoolClass) {
	const url = `/english/api/options?schoolClass=${schoolClass}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Ошибка: ${response.statusText}`);
		}
		const options = await response.json();
		return options; // Возвращаем доступные уроки и шаги
	} catch (error) {
		console.error('Ошибка при получении опций:', error);
		throw error; // Пробрасываем ошибку для обработки
	}
}
