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
	const [elapsedTime, setElapsedTime] = useState(gameSettings.timeSpent); 

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (isRunning) {
			const startTime = Date.now(); 
			interval = setInterval(() => {
				const now = Date.now();
				setElapsedTime(now - startTime); 
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


	useEffect(() => {
		console.log('Elapsed Time:', elapsedTime);
		setGameSettings(prevSettings => ({
			...prevSettings,
			timeSpent: elapsedTime,
		}));
	}, [isRunning]);

	return (
		<span className='countdown font-mono text-xl'>
			{(elapsedTime / 1000).toFixed(1)} сек
		</span>
	); 
}
