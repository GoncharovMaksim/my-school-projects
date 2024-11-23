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

	let coefficient = 10;

	const inputUserName = document.querySelector('[name="user-name"]');
	const answer = document.querySelector('[name="answer"]');
	const btnStart = document.querySelector('.btn-start');
	const btnCheck = document.querySelector('.btn-check');
	const output = document.querySelector('.output');
	const grade = document.querySelector('.big-number');
	const gameOver = document.querySelector('.end-game');
	const dropdown1 = document.querySelector('.dropdown1');
	//const dropdown2 = document.querySelector('.dropdown2');
	const timer = document.querySelector('.timer');
	const min = document.querySelector('.min');
	const sec = document.querySelector('.sec');
	//const mSec = document.querySelector('.m-sec');
	const settings = document.querySelector('.settings');

	let a;
	let b;
	let result;
	let counter = 0;
	let errorCounter = 0;
	//let time;
	let intervalId;
	let count = 0;
	let countGame = 0;
	let second = 0;
	let minute = 0;
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

		a = randomNumber(minNumber, maxNumber);
		b = randomNumber(minNumber, maxNumber);
		if (operator === '*') {
			result = a * b;
		} else if (operator === '/') {
			a = a * b;
			result = a / b;
		} else if (operator === '-') {
			a = randomNumber(minNumber, maxNumber * coefficient);
			b = randomNumber(minNumber, maxNumber * coefficient);
			a += 50;
			result = a - b;
		} else {
			a = randomNumber(minNumber, maxNumber * coefficient);
			b = randomNumber(minNumber, maxNumber * coefficient);
			result = a + b;
		}

		setQuestion(`${a} ${operator} ${b} =`);
		setGameSettings({
			...gameSettings,
			stepGame: gameSettings.stepGame + 1,
		});
	}

	// btnCheck.addEventListener('click', answerCheck);
	// answer.addEventListener('keydown', event => {
	// 	if (event.key == 'Enter') {
	// 		answerCheck();
	// 	}
	// });
	const [question, setQuestion] = useState('');
	const handleNextQuestion = () => {
		
		startGame();
	};
	

useEffect(()=>{
	startGame()
},[])
	return (
		<>
			<div className='text-5xl '>{question}</div>
			<input
				type='number'
				placeholder='Ваш ответ'
				className='input input-bordered w-full max-w-xs text-3xl'
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
		</>
	);
}
