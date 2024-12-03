export interface GameProps {
	gameSettings: GameSettings;
	setGameSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
}

export interface GameSettings {
	operator: string; // '+', '-', '*', '/'
	difficultyLevel: number; // Уровень сложности
	stepGame: number; // Текущий шаг игры
	limGame: number; // Максимальное количество задач
	timerStatus: boolean; // Статус таймера
	timeSpent: number; // Время, затраченное на игру
	gameStatus: boolean; // Статус игры (активна/завершена)
}

export interface Task {
	question: string;
	result: number;
	userAnswer: string;
	checkUserAnswer: boolean;
}
