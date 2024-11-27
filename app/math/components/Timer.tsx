import { useState, useEffect } from 'react';

export default function Timer({
	isRunning,
	gameSettings,
	setGameSettings,
}: {
	isRunning: boolean;

	gameSettings: {
		operator: string;
		difficultyLevel: number;
		gameStatus: boolean;
		stepGame: number;
		limGame: number;
		timerStatus: boolean;
		timeSpent: number;
	};
	setGameSettings: React.Dispatch<
		React.SetStateAction<{
			operator: string;
			difficultyLevel: number;
			gameStatus: boolean;
			stepGame: number;
			limGame: number;
			timerStatus: boolean;
			timeSpent: number;
		}>
	>;
}) {
	const [elapsedTime, setElapsedTime] = useState(gameSettings.timeSpent); // будет хранить время в миллисекундах

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (isRunning) {
			const startTime = Date.now(); // Начало отсчета в миллисекундах
			interval = setInterval(() => {
				const now = Date.now();
				setElapsedTime(now - startTime); // Обновляем время в миллисекундах
			}, 10);
		} else {
			if (interval) {
				clearInterval(interval);
			}
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [isRunning]);

	// Обновление timeSpent в gameSettings
	useEffect(() => {
		console.log('Elapsed Time:', elapsedTime);
		setGameSettings(prevSettings => ({
			...prevSettings,
			timeSpent: elapsedTime,
		}));
	}, [isRunning]);

	return (
		<span className='countdown font-mono text-xl'>
			{(elapsedTime / 1000).toFixed(0)} сек
		</span>
	); // Отображаем время в секундах с точностью до тысячных
}
