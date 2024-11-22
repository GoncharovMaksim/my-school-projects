import { useState, useEffect } from 'react';

export default function Timer({ isRunning }: { isRunning: boolean }) {
	const [elapsedTime, setElapsedTime] = useState(0); // Время, прошедшее с момента старта

	// Управление запуском и остановкой таймера
	useEffect(() => {
		let interval: NodeJS.Timeout;

		// Если таймер запускается
		if (isRunning) {
			const startTime = new Date(); // Время старта при запуске

			// Обновление времени каждую секунду
			interval = setInterval(() => {
				const now = new Date();
				setElapsedTime(
					Math.floor((now.getTime() - startTime.getTime()) / 1000)
				);
			}, 1000);
		} else {
			// Если таймер остановлен, очищаем интервал
			clearInterval(interval);
		}

		// Очистка интервала при размонтировании компонента или смене состояния
		return () => clearInterval(interval);
	}, [isRunning]); // Следим только за состоянием isRunning

	return (
		<span className='countdown font-mono text-xl'>{elapsedTime}сек</span>
	);
}
