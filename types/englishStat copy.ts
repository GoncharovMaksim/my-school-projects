export interface Task {
	taskIndex: number;
	task: object; // Здесь нужно описать структуру TaskSchema, если она известна
	taskResult: 'Верно' | 'Неверно';
}

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
