import { useState, useEffect } from 'react';

export default function Timer() {
	const [startTime, setStartTime] = useState<Date | null>(null); // Время старта
	const [elapsedTime, setElapsedTime] = useState(0); // Время, прошедшее с момента старта

	useEffect(() => {
		if (!startTime) return;

		const interval = setInterval(() => {
			const now = new Date();
			setElapsedTime(Math.floor((now.getTime() - startTime.getTime()) / 1000));
		}, 1000);

		return () => clearInterval(interval);
	}, [startTime]);

	const startTimer = () => {
		setStartTime(new Date());
		setElapsedTime(0);
	};

	const stopTimer = () => {
		setStartTime(null);
	};

	return (
	
					<span className='countdown font-mono text-2xl'>
						<span
							style={{ '--value': elapsedTime } as React.CSSProperties}
						></span>
					</span>
				
				
	);
}
