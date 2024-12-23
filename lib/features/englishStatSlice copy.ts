import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadEnglishStatistics } from '@/app/statistics/english/loadEnglishStatistics' ; // Импортируем асинхронное действи

// Интерфейсы для данных
interface Task {
	taskIndex: number;
	task: object; // Здесь нужно описать структуру TaskSchema, если она известна
	taskResult: 'Верно' | 'Неверно';
}

interface EnglishStat {
	userId: string;
	userName: string;
	userEmail: string;
	appComponent: string;
	grade: number;
	percentCorrectAnswer: number;
	timeSpent: number;
	schoolClass: number | ''; // Подставьте более точный тип вместо any, если известно
	lessonUnit: number | '';
	unitStep: number | '';
	difficultyLevel: number;
	results: Task[];
	createdAt: string; // Поля timestamps из mongoose
	updatedAt?: string;
}

interface EnglishStatState {
	englishStatList: EnglishStat[];
	error: boolean;
	loading: boolean;
}

const initialState: EnglishStatState = {
	englishStatList: [],
	error: false,
	loading: false, // Добавим состояние загрузки
};

const englishStatSlice = createSlice({
	name: 'englishStat',
	initialState,
	reducers: {
		setEnglishStatList(state, action: PayloadAction<EnglishStat[]>) {
			state.englishStatList = action.payload;
		},
		addEnglishStat(state, action: PayloadAction<EnglishStat>) {
			state.englishStatList.push(action.payload);
		},
		updateEnglishStat(
			state,
			action: PayloadAction<{
				userId: string;
				updatedStat: Partial<EnglishStat>;
			}>
		) {
			const { userId, updatedStat } = action.payload;
			const index = state.englishStatList.findIndex(
				stat => stat.userId === userId
			);
			if (index !== -1) {
				state.englishStatList[index] = {
					...state.englishStatList[index],
					...updatedStat,
				};
			}
		},
		removeEnglishStat(state, action: PayloadAction<string>) {
			state.englishStatList = state.englishStatList.filter(
				stat => stat.userId !== action.payload
			);
		},
		setError(state, action: PayloadAction<boolean>) {
			state.error = action.payload;
		},
	},
	// Обработчики для асинхронного действия
	extraReducers: builder => {
		builder
			.addCase(loadEnglishStatistics.pending, state => {
				state.loading = true; // Устанавливаем loading в true при начале загрузки
				state.error = false; // Сбрасываем ошибку
			})
			.addCase(loadEnglishStatistics.fulfilled, (state, action) => {
				state.loading = false;
				state.englishStatList = action.payload; // Обновляем список статистики
			})
			.addCase(loadEnglishStatistics.rejected, (state, action) => {
				state.loading = false;
				state.error = true; // Устанавливаем ошибку
				console.error(action.payload); // Выводим ошибку в консоль
			});
	},
});

export const {
	setEnglishStatList,
	addEnglishStat,
	updateEnglishStat,
	removeEnglishStat,
	setError,
} = englishStatSlice.actions;

export default englishStatSlice.reducer;
