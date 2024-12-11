// Тип данных для слова
export interface Word {
	_id: string; // MongoDB добавляет это свойство автоматически
	schoolClass: number;
	lessonUnit: number;
	unitStep: number;
	englishWord: string;
	transcriptionEn: string;
	transcriptionRu: string;
	translation: string;
	englishAudio?: string; // Это поле необязательно
}
