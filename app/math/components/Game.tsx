import { useState } from "react";
import Timer from "./Timer";
import Accordion from "./Accordion";
export default function StartGame({ gameSettings }: { gameSettingssh: { operator: string; difficultyLevel: number } }) {
	console.log(gameSettings);
	const { operator, difficultyLevel } = gameSettings;
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
				// onClick={() => {
				// 	setGameSettings(settingsGame);
				// 	setStartGame(true);
				// 	console.log(settingsGame);
				// }}
			>
				Продолжить
			</button>
			<progress className='progress w-56' value='25' max='100'></progress>

			<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm'>
				<div className='collapse collapse-arrow bg-base-200'>
					<input type='checkbox' name='my-accordion-2' />
					<div className='collapse-title text-xl font-medium'>
						Параметры игры
					</div>
					<div className='collapse-content'>
						<p>Уровень сложности: {difficultyLevel}</p>
						<div>
							Затрачено времени: <Timer />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
