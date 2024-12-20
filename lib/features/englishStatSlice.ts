import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
}

const initialState: EnglishStatState = {
	englishStatList: [],
	error: false,
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
});

export const {
	setEnglishStatList,
	addEnglishStat,
	updateEnglishStat,
	removeEnglishStat,
	setError,
} = englishStatSlice.actions;

export default englishStatSlice.reducer;
