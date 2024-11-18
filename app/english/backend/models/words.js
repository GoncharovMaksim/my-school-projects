const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
	schoolClass: { type: Number, required: true },
	lessonUnit: { type: Number, required: true },
	unitStep: { type: Number, required: true },
	englishWord: { type: String, required: true },
	transcriptionEn: { type: String, required: true },
	transcriptionRu: { type: String, required: true },
	translation: { type: String, required: true },
	englishAudio: { type: String, required: false },
});

// Проверяем, существует ли уже модель, чтобы избежать повторного определения
const Word = mongoose.models.Word || mongoose.model('Word', wordSchema);

module.exports = Word;
