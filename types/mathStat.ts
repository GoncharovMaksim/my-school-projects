export interface Task {
	taskIndex: number; // Индекс задания
	task: {
		question: string; // Вопрос
		argumentA: number; // Первый аргумент
		operator: string; // Оператор (например, +, -, *)
		argumentB: number; // Второй аргумент
		result: number; // Ожидаемый результат
		userAnswer: string; // Ответ пользователя
		checkUserAnswer: boolean; // Проверка правильности ответа
	};
	taskResult: 'Верно' | 'Неверно';
	_id: string; // Результат выполнения задания
}
export type Results = Task[];
export interface MathStat {
	userId: string; // Идентификатор пользователя
	userName: string;
	userNickName: string; // Имя пользователя
	userEmail: string; // Email пользователя
	appComponent: string; // Компонент приложения
	operator: string; // Оператор (например, +, -, *)
	grade: number; // Оценка пользователя (1-5)
	percentCorrectAnswer: number; // Процент правильных ответов
	timeSpent: number; // Затраченное время в секундах
	difficultyLevel: number; // Уровень сложности игры (1, 2, 3)
	results: Results; // Массив результатов
	createdAt: string; // Дата создания (из timestamps Mongoose)
	updatedAt?: string; // Дата обновления (из timestamps Mongoose)
}
