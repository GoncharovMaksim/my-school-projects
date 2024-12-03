import mongoose from 'mongoose';

// Вложенная схема для `task`
const TaskSchema = new mongoose.Schema(
	{
		question: { type: String, required: true }, // Вопрос
		result: { type: Number, required: true }, // Ожидаемый результат
		userAnswer: { type: String, required: true }, // Ответ пользователя
		checkUserAnswer: { type: Boolean, required: true }, // Проверка правильности ответа
	},
	{ _id: false }
); // Отключаем автоматическое создание _id для вложенной схемы

// Основная схема
const MathStatisticsSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true }, // Идентификатор пользователя
		userName: { type: String, required: true, default: 'Гость' }, // Имя пользователя
		userEmail: { type: String, required: false, default: '' }, // Email пользователя
		appComponent: { type: String, required: true },
		results: [
			{
				taskIndex: { type: Number, required: true }, // Индекс задания
				task: { type: TaskSchema, required: true }, // Используем вложенную схему
				taskResult: {
					type: String,
					enum: ['Верно', 'Неверно'],
					required: true,
				}, // Результат задания
			},
		],
		grade: { type: Number, required: true }, // Оценка пользователя (1-5)
		timeSpent: { type: Number, required: true }, // Затраченное время в секундах
		difficultyLevel: { type: Number, required: true }, // Уровень сложности игры (1, 2, 3)
	},
	{ timestamps: true } // Автоматическое добавление времени создания и обновления
);

// Экспортируем модель
const MathStatistics =
	mongoose.models.MathStatistics ||
	mongoose.model('MathStatistics', MathStatisticsSchema);

export default MathStatistics;
