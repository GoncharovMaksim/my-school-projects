'use client';
import { useEffect, useState, useRef } from 'react';
import Accordion from './Accordion';
import { GameProps, Task } from './types';
import { useSession } from 'next-auth/react';

import TgApi from '@/lib/tgApi';
import { Word } from '@/types/word';

export default function Game({ gameSettings, setGameSettings }: GameProps) {
	const { difficultyLevel, stepGame, limGame } = gameSettings;
	const [question, setQuestion] = useState('');
	const [rightAnswer, setRightAnswer] = useState<string[]>([]);
	const [userAnswer, setUserAnswer] = useState('');
	const [percentCorrectAnswer, setPercentCorrectAnswer] = useState<
		number | null
	>(null);

	const [arrTasks, setArrTasks] = useState<Task[]>([]);
	const [bgNoUserAnswer, setBgNoUserAnswer] = useState(false);
	const [endGame, setEndGame] = useState(false);
	const [badAnswer, setBadAnswer] = useState(limGame);
	const [gradeAnswer, setGradeAnswer] = useState(0);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [arrRandomWords, setArrRandomWords] = useState<Word[]>([]);

	const session = useSession();
	//console.log(gameSettings.limGame);
	// Функция для перемешивания массива
	function shuffleArray(array: Word[]) {
		const shuffledArray = array.slice();

		for (let i = shuffledArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffledArray[i], shuffledArray[j]] = [
				shuffledArray[j],
				shuffledArray[i],
			];
		}

		return shuffledArray;
	}

	// useEffect(() => {
	// 	if (arrRandomWords.length > 0) {
	// 		console.log('arrRandomWords.length', arrRandomWords.length);
	// 		console.log('gameSettings.stepGame', gameSettings.stepGame);
	// 		const currentWord = arrRandomWords[gameSettings.stepGame - 1];
	// 		setQuestion(currentWord.englishWord);
	// 		const rightAnswer = currentWord.translation.split(',').map(word => word);
	// 		setRightAnswer(rightAnswer);
	// 	}
	// }, [arrRandomWords, gameSettings.stepGame]);
	useEffect(() => {
		if (arrRandomWords.length > 0) {
			console.log('arrRandomWords.length', arrRandomWords.length);
			console.log('gameSettings.stepGame', gameSettings.stepGame);
			const currentWord = arrRandomWords[gameSettings.stepGame - 1];
			if (gameSettings.difficultyLevel === 1) {
				setQuestion(currentWord.englishWord);
				const rightAnswer = currentWord.translation
					.split(',')
					.map(word => word);
				setRightAnswer(rightAnswer);
			}
			if (gameSettings.difficultyLevel === 2) {
				setQuestion(currentWord.translation);
				const rightAnswer = currentWord.englishWord
					.split(',')
					.map(word => word);
				setRightAnswer(rightAnswer);
			}
		}
	}, [arrRandomWords, gameSettings.stepGame, gameSettings.difficultyLevel]);

	function startGame() {
		if (inputRef.current) {
			inputRef.current.focus();
		}

		if (gameSettings.stepGame === 0) {
			const shuffledWords = shuffleArray(gameSettings.examWordsList);

			setArrRandomWords(shuffledWords); // Запуск обновления состояния
		}

		setGameSettings({
			...gameSettings,
			timerStatus: true,
			stepGame: gameSettings.stepGame + 1,
		});
	}

	const handleStopGame = () => {
		setGameSettings(prevSettings => ({
			...prevSettings,
			difficultyLevel,
			gameStatus: false,
			stepGame: 0,
			timeSpent: 0,
		}));
	};

	useEffect(() => {
		if (checkUserAnswer(userAnswer, rightAnswer)) {
			setBadAnswer(prev => prev - 1);
		}
	}, [rightAnswer, userAnswer]);

	useEffect(() => {
		const percentAnswer = 100 - (badAnswer / limGame) * 100;
		setPercentCorrectAnswer(percentAnswer);
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

	function checkUserAnswer(userAnswer: string, rightAnswer: string[]): boolean {
		const sanitize = (str: string): string[] =>
			str
				.toLowerCase()
				.replace(/ё/g, 'е')
				.replace(/[;.()]/g, ',') // Замена символов на запятую
				.replace(/[^a-zа-я0-9,]/g, '') // Удаление всех лишних символов
				.split(',') // Разделение строки на массив по запятой
				.filter(Boolean); // Удаление пустых элементов массива

		return rightAnswer.some(answer => {
			const sanitizedAnswer = sanitize(answer);
			const sanitizedUserAnswer = sanitize(userAnswer);
			return sanitizedAnswer.some(part => sanitizedUserAnswer.includes(part));
		});
	}

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
			{
				question,
				rightAnswer,
				userAnswer,
				checkUserAnswer: checkUserAnswer(userAnswer, rightAnswer),
			},
		]);
		setUserAnswer(''); //РАЗОБРАТЬСЯ ГДЕ ОЧИЩАТЬ
		if (stepGame === limGame) {
			setGameSettings(prevSettings => ({
				...prevSettings,
				timerStatus: false,
			}));
			setEndGame(true);
		} else {
			startGame();
		}
	}
	useEffect(() => {
		startGame();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
				appComponent: 'english',
				percentCorrectAnswer,
				results,
				grade: gradeAnswer,
				timeSpent: gameSettings.timeSpent / 1000,
				difficultyLevel: gameSettings.difficultyLevel,
				schoolClass: gameSettings.schoolClass,
				lessonUnit: gameSettings.lessonUnit,
				unitStep: gameSettings.unitStep,
			};

			const response = await fetch('/api/gameStatistics/english', {
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
Английский
Результат теста:
${arrTasks
	.map(
		el =>
			`${el.question} = ${el.rightAnswer} ${
				el.checkUserAnswer ? '' : `Ваш ответ: ${el.userAnswer}`
			}`
	)
	.join('\n')}
Оценка: ${gradeAnswer}
Время: ${(gameSettings.timeSpent / 1000).toFixed(2)} сек
Сложность: ${gameSettings.difficultyLevel}
Класс: ${gameSettings.schoolClass}
Урок: ${gameSettings.lessonUnit}
Шаг: ${gameSettings.unitStep}

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
	//1
	return (
		<>
			{endGame ? (
				<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm text-xl items-center'>
					<div className='space-y-4 max-w-screen-sm text-xl flex flex-col items-center break-words'>
						<h1>Результат:</h1>
						<div>
							{arrTasks.map((el, index) => {
								const isCorrect = el.checkUserAnswer;
								return (
									<p
										key={`${el}-${index}`}
										className={isCorrect ? 'text-green-500' : 'text-red-500'}
									>
										{`${el.question} = ${el.rightAnswer} ${
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
						type='string'
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
