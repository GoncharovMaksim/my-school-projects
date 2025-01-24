import { createAsyncThunk } from '@reduxjs/toolkit';

export const loadMathStatistics = createAsyncThunk(
	'statistics/loadMathStatistics',
	async (
		{
			startDate,
			endDate,
			today,
		}: { startDate?: string; endDate?: string; today?: boolean },
		{ rejectWithValue }
	) => {
		try {
			// Формируем URL с параметрами
			let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gameStatistics/math`;

			const queryParams = new URLSearchParams();
			if (today) {
				queryParams.append('today', 'true');
			} else {
				if (startDate) queryParams.append('startDate', startDate);
				if (endDate) queryParams.append('endDate', endDate);
			}

			if (queryParams.toString()) {
				url += `?${queryParams.toString()}`;
			}

			const response = await fetch(url, { cache: 'no-store' });

			if (!response.ok) {
				throw new Error(`HTTP Error: ${response.status}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Ошибка при получении данных:', error);
			return rejectWithValue('Ошибка при загрузке статистики');
		}
	}
);
