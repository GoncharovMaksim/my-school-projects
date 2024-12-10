// api.js
export default async function fetchWords() {
	const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/english/words`;
	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Ошибка: ${response.statusText}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Ошибка при получении слов:', error);
	}
}
