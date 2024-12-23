export interface Task {
	taskIndex: number;
	task: {
		question: string;
		rightAnswer: string[];
		userAnswer: string;
		checkUserAnswer: boolean;
	};
	taskResult: 'Верно' | 'Неверно';
	_id: string; // если `_id` гарантированно присутствует
}

// Тип для массива результатов
export type Results = Task[];

export interface EnglishStat {
	userId: string;
	userName: string;
	userEmail: string;
	appComponent: string;
	grade: number;
	percentCorrectAnswer: number;
	timeSpent: number;
	schoolClass: number | ''; // Подставьте более точный тип вместо any, если известно
	lessonUnit: number | '';
	unitStep: number | '';
	difficultyLevel: number;
	results: Task[];
	createdAt: string; // Поля timestamps из mongoose
	updatedAt?: string;
}
