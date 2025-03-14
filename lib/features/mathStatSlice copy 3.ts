import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadMathStatistics } from '@/app/statistics/math/loadMathStatistics'; // Импортируем асинхронное действи
import { MathStat } from '@/types/mathStat';

interface MathStatState {
	mathStatList: MathStat[];
	error: boolean;
	loading: boolean;
}

const initialState: MathStatState = {
	mathStatList: [],
	error: false,
	loading: false, // Добавим состояние загрузки
};

const mathStatSlice = createSlice({
	name: 'mathStat',
	initialState,
	reducers: {
		setMathStatList(state, action: PayloadAction<MathStat[]>) {
			state.mathStatList = action.payload;
		},
		addMathStat(state, action: PayloadAction<MathStat>) {
			state.mathStatList.push(action.payload);
		},
		updateMathStat(
			state,
			action: PayloadAction<{
				userId: string;
				updatedStat: Partial<MathStat>;
			}>
		) {
			const { userId, updatedStat } = action.payload;
			const index = state.mathStatList.findIndex(
				stat => stat.userId === userId
			);
			if (index !== -1) {
				state.mathStatList[index] = {
					...state.mathStatList[index],
					...updatedStat,
				};
			}
		},
		removeMathStat(state, action: PayloadAction<string>) {
			state.mathStatList = state.mathStatList.filter(
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
			.addCase(loadMathStatistics.pending, state => {
				state.loading = true; // Устанавливаем loading в true при начале загрузки
				state.error = false; // Сбрасываем ошибку
			})
			.addCase(loadMathStatistics.fulfilled, (state, action) => {
				state.loading = false;
				state.mathStatList = action.payload; // Обновляем список статистики
			})
			.addCase(loadMathStatistics.rejected, (state, action) => {
				state.loading = false;
				state.error = true; // Устанавливаем ошибку
				console.error(action.payload); // Выводим ошибку в консоль
			});
	},
});

export const {
	setMathStatList,
	addMathStat,
	updateMathStat,
	removeMathStat,
	setError,
} = mathStatSlice.actions;

export default mathStatSlice.reducer;
