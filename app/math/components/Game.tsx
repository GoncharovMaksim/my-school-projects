import { useState } from "react";
import Accordion from "./Accordion";
export default function StartGame({
	gameSettings,
}: {
	gameSettings: {
		operator: string;
		difficultyLevel: number;
		gameStatus: boolean;
	};
}) {

	//const { operator, difficultyLevel } = gameSettings;
	const [question, setQuestion] = useState('2 + 2 =');
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
				// 	setGameSettings(settingsGame);
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
