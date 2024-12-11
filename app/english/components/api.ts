import { Word } from '@/types/word';

export default async function fetchWords(): Promise<Word[]> {
	const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/english/words`;
	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Ошибка: ${response.statusText}`);
		}

		const data: Word[] = await response.json();
		return data;
	} catch (error) {
		console.error('Ошибка при получении слов:', error);
		return []; // Возвращаем пустой массив, чтобы избежать undefined
	}
}
