import { useState, useEffect } from 'react';
import { GameProps } from './types';

export default function Timer({ gameSettings, setGameSettings }: GameProps) {
	const [elapsedTime, setElapsedTime] = useState(gameSettings.timeSpent); 

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (gameSettings.timerStatus) {
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
	}, [gameSettings.timerStatus]);


	useEffect(() => {
		console.log('Elapsed Time:', elapsedTime);
		setGameSettings(prevSettings => ({
			...prevSettings,
			timeSpent: elapsedTime,
		}));
	}, [gameSettings.timerStatus]);

	return (
		<span className='countdown font-mono text-xl'>
			{(elapsedTime / 1000).toFixed(1)} сек
		</span>
	); 
}
