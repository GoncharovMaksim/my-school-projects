import { useEffect, useState, useRef } from 'react';
import Accordion from './Accordion';
export default function Game({
	gameSettings,
	setGameSettings,
}: {
	gameSettings: {
		operator: string;
		difficultyLevel: number;
		gameStatus: boolean;
		stepGame: number;
		limGame: number;
	};
	setGameSettings: React.Dispatch<
		React.SetStateAction<{
			operator: string;
			difficultyLevel: number;
			gameStatus: boolean;
			stepGame: number;
			limGame: number;
		}>
	>;
}) {
	const { operator } = gameSettings;
	const { difficultyLevel } = gameSettings;
	const { stepGame } = gameSettings;
	const { limGame } = gameSettings;
	const [question, setQuestion] = useState('');
	const [userAnswer, setUserAnswer] = useState('');

	const [result, setResult] = useState<number | null>(null);
	const [arrTasks, setArrTasks] = useState<string[]>([]);
	function randomNumber(a: number, b: number) {
		return Math.floor(Math.random() * (b - a + 1)) + a;
	}

	function startGame() {
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
		}));
	};
	const [bgNoUserAnswer, setBgNoUserAnswer] = useState(false); // состояние для управления цветом
	const [endGame, setEndGame] = useState(false);
	function userAnswerCheck() {
		if (!userAnswer) {
			setBgNoUserAnswer(true); // установить красный фон

			return;
		}

		setBgNoUserAnswer(false); // сбросить фон при вводе ответа

		if (stepGame == limGame) {
			setArrTasks(prev => [
				...prev,
				`${question} ${result}  Ваш ответ: ${userAnswer}`,
			]);
			setUserAnswer('');
			return setEndGame(true);
		} else {
			setArrTasks(prev => [
				...prev,
				`${question} ${result}  Ваш ответ: ${userAnswer}`,
			]);
			setUserAnswer('');
			return startGame();
		}
	}

	const handleNextQuestion = () => {
		userAnswerCheck();
	};

	const inputRef = useRef<HTMLInputElement | null>(null); // фокус на поле input

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus(); // Установка фокуса
		}
	}, [stepGame]);

	const startGameRef = useRef(startGame);

	useEffect(() => {
		startGameRef.current();
	}, []);

	return endGame ? (
		<>
			<div>
				{arrTasks.map((el, index) => (
					<p key={`${el}-${index}`}>{el}</p>
				))}
			</div>
			<button
				className='btn btn-outline w-full max-w-xs'
				onClick={() => {
					handleStopGame();
				}}
			>
				Продолжить
			</button>
		</>
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
						handleNextQuestion();
					}
				}}
			/>
			<button
				className='btn btn-outline w-full max-w-xs'
				onClick={() => {
					handleNextQuestion();
				}}
			>
				Продолжить
			</button>
			<progress
				className='progress w-56'
				value={stepGame}
				max={limGame}
			></progress>

			<Accordion gameSettings={gameSettings} />
		</>
	);
}
//
