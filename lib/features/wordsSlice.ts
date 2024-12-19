import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Word } from '@/types/word';

interface WordsState {
	wordsList: Word[];
	error: boolean;
}

const initialState: WordsState = {
	wordsList: [],
	error: false,
};

const wordsSlice = createSlice({
	name: 'words',
	initialState,
	reducers: {
		setWordsList(state, action: PayloadAction<Word[]>) {
			state.wordsList = action.payload;
		},
		setError(state, action: PayloadAction<boolean>) {
			state.error = action.payload;
		},
	},
});

export const { setWordsList, setError } = wordsSlice.actions;

export default wordsSlice.reducer;
