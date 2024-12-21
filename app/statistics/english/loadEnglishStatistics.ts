import { createAsyncThunk } from '@reduxjs/toolkit';


export const loadEnglishStatistics = createAsyncThunk(
	'statistics/loadEnglishStatistics', // Название для экшн-тега
	async (_, { rejectWithValue }) => {
		// Используем пустой аргумент, так как он не используется в вашем случае
		const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gameStatistics/english`;

		try {
			const response = await fetch(url, { cache: 'no-store' });

			if (!response.ok) {
				throw new Error(`HTTP Error: ${response.status}`);
			}

			const data = await response.json();
			return data; // Возвращаем данные для сохранения в хранилище
		} catch (error) {
			console.error('Ошибка при получении данных:', error);
			return rejectWithValue('Ошибка при загрузке статистики'); // Возвращаем ошибку через `rejectWithValue`
		}
	}
);
