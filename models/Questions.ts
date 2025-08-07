import mongoose from 'mongoose';

const questionsSchema = new mongoose.Schema({
	id: { type: Number, required: true },
	topic: { type: String, required: true },
	part: { type: Number, required: true },
	questionText: { type: String, required: true },
	type: { type: String, enum: ['single', 'multiple'], required: true },
	options: [
		{
			id: { type: String, enum: ['a', 'b', 'c', 'd', 'e'], required: true },
			text: { type: String, required: true }
		}
	],

	correctOptions: [{ type: String, enum: ['a', 'b', 'c', 'd', 'e'], required: true }]
});

// Проверяем, существует ли уже модель, чтобы избежать повторного определения
const Questions = mongoose.models.Questions || mongoose.model('Questions', questionsSchema);

export default Questions;
