// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import wordsReducer from './features/wordsSlice';
import englishStatReducer from './features/englishStatSlice';


export const makeStore = () => {
	return configureStore({
		reducer: {
			words: wordsReducer,
			englishStat: englishStatReducer,
		},
		devTools: process.env.NODE_ENV !== 'production', // Включение DevTools в режиме разработки
	});
};


export type AppStore = ReturnType<typeof makeStore>; // Тип для стора
export type RootState = ReturnType<AppStore['getState']>; // Тип для состояния всего стора
export type AppDispatch = AppStore['dispatch']; // Тип для dispatch
