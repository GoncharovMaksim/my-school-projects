// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import wordsReducer from './features/wordsSlice';

export const makeStore = () => {
	return configureStore({
		reducer: {
			words: wordsReducer,
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
