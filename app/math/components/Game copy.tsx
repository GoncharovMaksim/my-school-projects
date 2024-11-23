import { useState } from 'react';
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
	const [question, setQuestion] = useState('2 + 2 =');
	const handleNextQuestion = () => {
		setGameSettings({
			...gameSettings,
			stepGame: gameSettings.stepGame + 1,
		});

		setQuestion('5 + 5 =');
	};

	
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
