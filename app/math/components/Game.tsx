import { useEffect, useState, useRef } from 'react';
import Accordion from './Accordion';
import { GameProps } from './types';

// import { getServerSession } from 'next-auth';
// import { authConfig } from '../configs/auth';
import TgApi from '@/app/components/TgApi';

export default function Game({ gameSettings, setGameSettings }: GameProps) {
	const { operator, difficultyLevel, stepGame, limGame } = gameSettings;

	const [question, setQuestion] = useState('');
	const [userAnswer, setUserAnswer] = useState('');

	const [result, setResult] = useState<number | null>(null);
	const [arrTasks, setArrTasks] = useState<string[]>([]);
	const [bgNoUserAnswer, setBgNoUserAnswer] = useState(false);
	const [endGame, setEndGame] = useState(false);
	const [badAnswer, setBadAnswer] = useState(limGame);
	const [gradeAnswer, setGradeAnswer] = useState(0);
	const inputRef = useRef<HTMLInputElement | null>(null);

	function randomNumber(a: number, b: number) {
		return Math.floor(Math.random() * (b - a + 1)) + a;
	}

	function startGame() {
		if (inputRef.current) {
			inputRef.current.focus();
		}

		let maxNumber = 10;
		const minNumber = 2;
		let coefficient = 10;

		if (difficultyLevel === 1) {
			maxNumber = 9;
		}
		if (difficultyLevel === 2) {
			maxNumber = 20;
			coefficient = 20;
		}
		if (difficultyLevel === 3) {
			maxNumber = 30;
			coefficient = 30;
		}

		let a = randomNumber(minNumber, maxNumber);
		let b = randomNumber(minNumber, maxNumber);

		if (operator === '*') {
			setResult(a * b);
		} else if (operator === '/') {
			a = a * b;
			setResult(a / b);
		} else if (operator === '-') {
			a = randomNumber(minNumber, maxNumber * coefficient);
			b = randomNumber(minNumber, maxNumber * coefficient);
			a += 50;
			setResult(a - b);
		} else {
			a = randomNumber(minNumber, maxNumber * coefficient);
			b = randomNumber(minNumber, maxNumber * coefficient);
			setResult(a + b);
		}

		setQuestion(`${a} ${operator} ${b} =`);
		setGameSettings({
			...gameSettings,
			timerStatus: true,
			stepGame: gameSettings.stepGame + 1,
		});
	}

	const handleStopGame = () => {
		// Создаем строку с результатами игры
		const resultText = `
    Результат игры:
    ${arrTasks
			.map((el, index) => {
				const isNoCorrect = el.includes('Не верно:');
				console.log(isNoCorrect);
				return `Задание ${index + 1}: ${el}`;
			})
			.join('\n')}
    
    Оценка: ${gradeAnswer}
    Время: ${(gameSettings.timeSpent / 1000).toFixed(2)} сек
  `;

		// Передаем эту строку в TgApi
		TgApi(resultText);
		setGameSettings(prevSettings => ({
			...prevSettings,
			operator,
			difficultyLevel,
			gameStatus: false,
			stepGame: 0,
			timeSpent: 0,
		}));
	};

	useEffect(() => {
		if (result === Number(userAnswer)) {
			setBadAnswer(prev => prev - 1);
		}
	}, [result, userAnswer]);

	useEffect(() => {
		const percentAnswer = 100 - (badAnswer / limGame) * 100;

		if (percentAnswer > 89) {
			setGradeAnswer(5);
		} else if (percentAnswer > 69) {
			setGradeAnswer(4);
		} else if (percentAnswer > 49) {
			setGradeAnswer(3);
		} else if (percentAnswer > 29) {
			setGradeAnswer(2);
		} else {
			setGradeAnswer(1);
		}
	}, [badAnswer, limGame]);

	function userAnswerCheck() {
		if (inputRef.current) {
			inputRef.current.focus();
		}
		if (!userAnswer) {
			setBgNoUserAnswer(true);

			return;
		}

		setBgNoUserAnswer(false);
		setArrTasks(prev => [
			...prev,
			result === Number(userAnswer)
				? `${question} ${result}`
				: `${question} ${userAnswer}  Не верно: ${result}`,
		]);
		setUserAnswer('');
		if (stepGame === limGame) {
			setGameSettings(prevSettings => ({
				...prevSettings,
				timerStatus: false,
			}));
			return setEndGame(true);
		} else {
			return startGame();
		}
	}

	useEffect(() => {
		startGame();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{endGame ? (
				<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm text-xl'>
					<div className='space-y-4 max-w-screen-sm text-xl flex flex-col items-center'>
						<h1>Результат:</h1>
						<div>
							{arrTasks.map((el, index) => {
								const isNoCorrect = el.includes('Не верно:');
								return (
									<p
										key={`${el}-${index}`}
										className={isNoCorrect ? 'text-red-500' : 'text-green-500'}
									>
										{el}
									</p>
								);
							})}
						</div>
						<div>
							Оценка: <span className='text-2xl font-bold'>{gradeAnswer}</span>
						</div>
						<div>Время: {(gameSettings.timeSpent / 1000).toFixed(2)} сек</div>
					</div>
					<button
						className='btn btn-outline w-full max-w-xs'
						onClick={() => {
							handleStopGame();
						}}
					>
						Продолжить
					</button>
				</div>
			) : (
				<>
					<div className='text-5xl '>{question}</div>
					<input
						ref={inputRef}
						type='number'
						placeholder='Ваш ответ'
						className={
							bgNoUserAnswer
								? 'input input-bordered w-full max-w-xs text-3xl bg-red-500'
								: 'input input-bordered w-full max-w-xs text-3xl'
						}
						value={userAnswer}
						onChange={event => setUserAnswer(event.target.value)}
						onKeyDown={event => {
							if (event.key === 'Enter') {
								userAnswerCheck();
							}
						}}
					/>
					<button
						className='btn btn-outline w-full max-w-xs'
						onClick={() => {
							userAnswerCheck();
						}}
					>
						Продолжить
					</button>
				</>
			)}
			<progress
				className='progress w-56'
				value={arrTasks.length}
				max={limGame}
			/>
			<Accordion
				gameSettings={gameSettings}
				setGameSettings={setGameSettings}
			/>
		</>
	);
}
