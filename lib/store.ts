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
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
