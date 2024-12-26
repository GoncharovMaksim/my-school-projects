import { useEffect, useState, useRef } from 'react';
import Accordion from './Accordion';
import { GameProps, Task } from './types';
import { useSession } from 'next-auth/react';

import TgApi from '@/lib/tgApi';

export default function Game({ gameSettings, setGameSettings }: GameProps) {
	const { operator, difficultyLevel, stepGame, limGame } = gameSettings;
	const [argumentA, setArgumentA] = useState<number | null>(null);
	const [argumentB, setArgumentB] = useState<number | null>(null);
	const [question, setQuestion] = useState('');
	const [userAnswer, setUserAnswer] = useState('');
	const [percentCorrectAnswer, setPercentCorrectAnswer] = useState<
		number | null
	>(null);

	const [result, setResult] = useState<number | null>(null);
	const [arrTasks, setArrTasks] = useState<Task[]>([]);
	const [bgNoUserAnswer, setBgNoUserAnswer] = useState(false);
	const [endGame, setEndGame] = useState(false);
	const [badAnswer, setBadAnswer] = useState(limGame);
	const [gradeAnswer, setGradeAnswer] = useState(0);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const session = useSession();

	function randomNumber(a: number, b: number): number {
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
		setArgumentA(a);
		setArgumentB(b);
		setQuestion(`${a} ${operator} ${b}`);
		setGameSettings({
			...gameSettings,
			timerStatus: true,
			stepGame: gameSettings.stepGame + 1,
		});
	}

	const handleStopGame = () => {
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
	console.log('Checking if user answer is correct...');
	if (result === Number(userAnswer)) {
		console.log(
			`User's answer (${userAnswer}) is correct. Decreasing badAnswer.`
		);
		setBadAnswer(prev => prev - 1);
	} else {
		console.log(`User's answer (${userAnswer}) is incorrect.`);
	}
}, [result, userAnswer]);

useEffect(() => console.log('badAnswer', badAnswer), [badAnswer]);



useEffect(() => {
	const percentAnswer = 100 - (badAnswer / limGame) * 100;
	console.log(`Calculated percent of correct answers: ${percentAnswer}%`);
	setPercentCorrectAnswer(percentAnswer);
	if (percentAnswer > 89) {
		console.log('Grade set to 5');
		setGradeAnswer(5);
	} else if (percentAnswer > 69) {
		console.log('Grade set to 4');
		setGradeAnswer(4);
	} else if (percentAnswer > 49) {
		console.log('Grade set to 3');
		setGradeAnswer(3);
	} else if (percentAnswer > 29) {
		console.log('Grade set to 2');
		setGradeAnswer(2);
	} else {
		console.log('Grade set to 1');
		setGradeAnswer(1);
	}
}, [badAnswer, limGame]);

function userAnswerCheck() {
	console.log('Checking user answer...');
	if (inputRef.current) {
		console.log('Focusing on the input field');
		inputRef.current.focus();
	}

	if (!userAnswer) {
		console.log('No answer provided, setting background to red.');
		setBgNoUserAnswer(true);
		return;
	}

	console.log('Answer provided:', userAnswer);
	setBgNoUserAnswer(false);
	setArrTasks(prev => {
		console.log('Adding new task to arrTasks');
		return [
			...prev,
			{
				question,
				argumentA,
				argumentB,
				operator,
				result: result!,
				userAnswer,
				checkUserAnswer: result === Number(userAnswer),
			},
		];
	});
	setUserAnswer('');
	if (stepGame === limGame) {
		console.log('Game step limit reached, ending game.');
		setGameSettings(prevSettings => ({
			...prevSettings,
			timerStatus: false,
		}));
		setEndGame(true);
	} else {
		console.log('Starting new game step.');
		startGame();
	}
}

useEffect(() => {
	console.log('Starting game...');
	startGame();
	// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

	const getOperatorLabel = (operator: string) => {
		switch (operator) {
			case '*':
				return 'Умножение';
			case '+':
				return 'Сложение';
			case '-':
				return 'Вычитание';
			case '/':
				return 'Деление';
			default:
				return 'Выберите действие';
		}
	};


	async function setStatisticUserGame() {
		try {
			const results = arrTasks.map((el, index) => ({
				taskIndex: index + 1,
				task: el,
				taskResult: el.checkUserAnswer ? 'Верно' : 'Неверно',
			}));

			const gameData = {
				userId: session.data?.user?.id || '',
				userName: session.data?.user?.name || 'Гость',
				userEmail: session.data?.user?.email || '',
				appComponent: 'math',
				operator: getOperatorLabel(operator),
				percentCorrectAnswer,
				results,
				grade: gradeAnswer,
				timeSpent: gameSettings.timeSpent / 1000,
				difficultyLevel: gameSettings.difficultyLevel,
			};

			const response = await fetch('/api/gameStatistics/math', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(gameData),
			});

			if (!response.ok) {
				throw new Error(
					`Ошибка при отправке статистики: ${response.statusText}`
				);
			}

			const result = await response.json();
			console.log('Статистика успешно сохранена:', result);

			// Telegram API
			const resultText = `
${session.data?.user?.name || 'Гость'}
Результат игры:
${arrTasks
	.map(
		el =>
			`${el.question} = ${el.result} ${
				el.checkUserAnswer ? '' : `Ваш ответ: ${el.userAnswer}`
			}`
	)
	.join('\n')}
Оценка: ${gradeAnswer}
Время: ${(gameSettings.timeSpent / 1000).toFixed(2)} сек
Сложность: ${gameSettings.difficultyLevel}
${session.data?.user?.email || ''}`;

			TgApi(resultText);
		} catch (error) {
			console.error('Ошибка при сохранении статистики:', error);
		}
	}

	useEffect(() => {
		if (gameSettings.timeSpent > 0) {
			setStatisticUserGame();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameSettings.timeSpent]);

	return (
		<>
			{endGame ? (
				<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm text-xl'>
					<div className='space-y-4 max-w-screen-sm text-xl flex flex-col items-center'>
						<h1>Результат:</h1>
						<div>
							{arrTasks.map((el, index) => {
								const isCorrect = el.checkUserAnswer;
								return (
									<p
										key={`${el}-${index}`}
										className={isCorrect ? 'text-green-500' : 'text-red-500'}
									>
										{`${el.question} = ${el.result} ${
											el.checkUserAnswer ? '' : `Ваш ответ: ${el.userAnswer}`
										}`}
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
