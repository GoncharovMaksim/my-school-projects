import { createAsyncThunk } from '@reduxjs/toolkit';
import { Word } from '@/types/word';

// Асинхронное действие для получения данных
export const loadWords = createAsyncThunk<
	Word[],
	void,
	{ rejectValue: string }
>('words/loadWords', async (_, { rejectWithValue }) => {
	const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/english/words`;
	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Ошибка: ${response.statusText}`);
		}

		const data: Word[] = await response.json();
		return data; // Возвращаем данные, чтобы Redux автоматически обновил стейт
	} catch (error) {
		// Приводим error к типу Error, если возможно
		const errorMessage =
			error instanceof Error ? error.message : 'Неизвестная ошибка';
		console.error('Ошибка при получении слов:', errorMessage);
		return rejectWithValue(errorMessage); // Отправляем ошибку через rejectWithValue
	}
});
