export interface GameSettings {
	operator: string;
	difficultyLevel: number;
	gameStatus: boolean;
	stepGame: number;
	limGame: number;
	timerStatus: boolean;
	timeSpent: number;
}

export interface GameProps {
	gameSettings: GameSettings;
	setGameSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
}


