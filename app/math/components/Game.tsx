import { useState } from "react";
import Accordion from "./Accordion";
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
	//const { operator, difficultyLevel } = gameSettings;
	const [question, setQuestion] = useState('2 + 2 =');
	const handleNextQuestion = () => {
		setGameSettings({
			...gameSettings, // сохраняем текущие значения
			stepGame: gameSettings.stepGame + 1, // увеличиваем шаг игры
		});

		setQuestion('5 + 5 ='); // обновляем вопрос
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
					setQuestion('5+5');
					handleNextQuestion();
					// 	setStartGame(true);
					// 	console.log(settingsGame);
				}}
			>
				Продолжить
			</button>
			<progress className='progress w-56' value='25' max='100'></progress>

			<Accordion gameSettings={gameSettings} />
		</>
	);
}
