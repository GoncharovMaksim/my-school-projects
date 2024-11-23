import { useEffect, useState } from 'react';
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
	};
	setGameSettings: React.Dispatch<
		React.SetStateAction<{
			operator: string;
			difficultyLevel: number;
			gameStatus: boolean;
			stepGame: number;
		}>
	>;
}) {
	const minNumber = 1;
	let maxNumber = 10;
	const { operator } = gameSettings;
	const { difficultyLevel } = gameSettings;
	const { stepGame } = gameSettings;
	const limGame = 5;
	const [question, setQuestion] = useState('');
	let coefficient = 10;

	const [result, setResult] = useState<number | null>(null);
	const [arrTasks, setArrTasks] = useState<string[]>([]);
	function randomNumber(a: number, b: number) {
		return Math.floor(Math.random() * (b - a + 1)) + a;
	}

	function startGame() {
		if (difficultyLevel === 1) {
			maxNumber = 10;
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
	function userAnswerCheck() {
		if (!userAnswer) {
			alert('не введен ответ');
			return console.log('не введен ответ');
		}
		if (stepGame >= limGame) {
			return handleStopGame();
		} else {
			setArrTasks(prev => [
				...prev,
				`${question} ${result}  Ваш ответ: ${userAnswer}`,
			]);
			//setArrTasks(`${question} ${result} Ваш ответ: ${userAnswer}`);
			console.log(arrTasks);
			return startGame();
		}
	}

	const handleNextQuestion = () => {
		userAnswerCheck();
	};
	const [userAnswer, setUserAnswer] = useState('');

	useEffect(() => {
		startGame();
	}, []);
	return (
		<>
			<div className='text-5xl '>{question}</div>
			<input
				type='number'
				placeholder='Ваш ответ'
				className='input input-bordered w-full max-w-xs text-3xl'
				onChange={event => setUserAnswer(event.target.value)}
			/>
			<button
				className='btn btn-outline w-full max-w-xs'
				onClick={() => {
					handleNextQuestion();
				}}
			>
				Продолжить
			</button>
			<progress className='progress w-56' value='25' max='100'></progress>

			<Accordion gameSettings={gameSettings} />
			<div>правильный ответ {result}</div>
			<div>ответ пользователя {userAnswer}</div>
			<div>
				весь пример {question}
				{result} и ответ пользователя {userAnswer}
			</div>
			<div>весь массив{arrTasks}</div>
			<div>
				{arrTasks.map((el, index) => (
					<p key={index}>{el}</p>
				))}
			</div>
		</>
	);
}
