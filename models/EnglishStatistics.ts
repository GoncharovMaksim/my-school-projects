import mongoose from 'mongoose';

// Вложенная схема для `task`
const TaskSchema = new mongoose.Schema(
	{
		question: { type: String, required: true }, // Вопрос
		rightAnswer: { type: [String], required: true },
		userAnswer: { type: String, required: true }, // Ответ пользователя
		checkUserAnswer: { type: Boolean, required: true }, // Проверка правильности ответа
	},
	{ _id: true }
); // Отключаем автоматическое создание _id для вложенной схемы

// Основная схема
const EnglishStatisticsSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true }, // Идентификатор пользователя
		userName: { type: String, required: true, default: 'Гость' }, // Имя пользователя
		userNickName: { type: String, required: false, default: '' },
		userEmail: { type: String, required: false, default: '' }, // Email пользователя
		appComponent: { type: String, required: true },
		grade: { type: Number, required: true }, // Оценка пользователя (1-5)
		percentCorrectAnswer: { type: Number, required: true },
		timeSpent: { type: Number, required: true },
		schoolClass: { type: mongoose.Schema.Types.Mixed, required: true },
		lessonUnit: { type: mongoose.Schema.Types.Mixed, required: true },
		unitStep: { type: mongoose.Schema.Types.Mixed, required: true },
		difficultyLevel: { type: Number, required: true },

		results: [
			{
				taskIndex: { type: Number, required: true }, // Индекс задания
				task: { type: TaskSchema, required: true }, // Используем вложенную схему
				taskResult: {
					type: String,
					enum: ['Верно', 'Неверно'],
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

// Экспортируем модель
const EnglishStatistics =
	mongoose.models.EnglishStatistics ||
	mongoose.model('EnglishStatistics', EnglishStatisticsSchema);

export default EnglishStatistics;
