import { useState, useEffect } from 'react';
import Timer from './Timer';
export default function Accordion({
	gameSettings,
}: {
	gameSettings: {
		operator: string;
		difficultyLevel: number;
		gameStatus: boolean;
	};
}) {
	const { operator, difficultyLevel } = gameSettings;
	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm'>
			<div className='collapse collapse-arrow bg-base-200'>
				<input type='checkbox' name='my-accordion-2' />
				<div className='collapse-title text-xl font-medium'>Параметры игры</div>
				<div className='collapse-content text-xl'>
					<p>Уровень сложности: {difficultyLevel}</p>
					<p>Действие: {operator}</p>
					<div>
						Затрачено времени: <Timer isRunning={gameSettings.gameStatus} />
					</div>
				</div>
			</div>
		</div>
	);
}
