import { useState } from "react";
import Timer from "./Timer";
export default function StartGame({ gameSettings }: { gameSettings: { operator: string; difficultyLevel: number } }) {
	console.log(gameSettings);
	const { operator, difficultyLevel } = gameSettings;
	const [question, setQuestion] = useState('2 + 2 =');
	return (
		<>
			
			<p>Operator: {operator}</p>
			<p>Difficulty Level: {difficultyLevel}</p>
			<div></div>
			<div className='text-5xl '>{question}</div>
			<input
				type='number'
				placeholder='Ваш ответ'
				className='input input-bordered w-full max-w-xs text-3xl'
			/>
			<button
				className='btn btn-outline w-full max-w-xs'
				// onClick={() => {
				// 	setGameSettings(settingsGame);
				// 	setStartGame(true);
				// 	console.log(settingsGame);
				// }}
			>
				Продолжить
			</button>
			<Timer />
		</>
	);
}
