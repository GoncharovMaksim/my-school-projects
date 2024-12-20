// loadingStatistics.ts
import { AppDispatch } from '@/lib/store'; // Импортируйте тип для `dispatch`
import { setEnglishStatList } from '@/lib/features/englishStatSlice';

export const loadEnglishStatistics = async (dispatch: AppDispatch) => {
	const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gameStatistics/english`;

	try {
		const response = await fetch(url, { cache: 'no-store' });
		if (!response.ok) {
			throw new Error(`HTTP Error: ${response.status}`);
		}
		const data = await response.json();
		dispatch(setEnglishStatList(data)); // Сохранение данных в Redux
	} catch (error) {
		console.error('Ошибка при получении данных:', error);
	}
};
