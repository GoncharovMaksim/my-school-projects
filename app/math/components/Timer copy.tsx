import { useState, useEffect } from 'react';

export default function Timer({ isRunning }: { isRunning: boolean }) {
	const [elapsedTime, setElapsedTime] = useState(0);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null; 

		if (isRunning) {
			const startTime = new Date(); 
			interval = setInterval(() => {
				const now = new Date();
				setElapsedTime(
					Math.floor((now.getTime() - startTime.getTime()) / 1000)
				);
			}, 1000);
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
	return <span className='countdown font-mono text-xl'>{elapsedTime} сек</span>;
}
