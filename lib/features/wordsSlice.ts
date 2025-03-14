import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Word } from '@/types/word';
import { loadWords } from '@/app/english/components/loadWords'; // Импорт асинхронного действия

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
	extraReducers: builder => {
		builder
			.addCase(loadWords.fulfilled, (state, action: PayloadAction<Word[]>) => {
				state.wordsList = action.payload;
				state.error = false;
			})
			.addCase(loadWords.rejected, state => {
				state.error = true;
			});
	},
});

export const { setWordsList, setError } = wordsSlice.actions;

export default wordsSlice.reducer;
