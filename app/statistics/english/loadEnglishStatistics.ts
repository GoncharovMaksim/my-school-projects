import { createAsyncThunk } from '@reduxjs/toolkit';


export const loadEnglishStatistics = createAsyncThunk(
	'statistics/loadEnglishStatistics', 
	async (_, { rejectWithValue }) => {
		
		const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gameStatistics/english`;

		try {
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
