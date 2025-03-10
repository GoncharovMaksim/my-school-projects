'use client';
import { useState } from 'react';
import Settings from './components/Settings';
import Game from './components/Game';
import { GameSettings } from './components/types';
import { Word } from '@/types/word';

export default function App() {
	const [gameSettings, setGameSettings] = useState<GameSettings>({
		examWordsList: [] as Word[],
		difficultyLevel: 1,
		schoolClass: 2,
		lessonUnit: 1,
		unitStep: 1,
		gameStatus: false,
		stepGame: 0,
		limGame: 5,
		timerStatus: false,
		timeSpent: 0,
	});

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
			<div className='my-8 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4 '>Английский</h1>

				{!gameSettings.gameStatus ? (
					<Settings
						gameSettings={gameSettings}
						setGameSettings={setGameSettings}
					/>
				) : (
					<>
						<Game
							gameSettings={gameSettings}
							setGameSettings={setGameSettings}
						/>
					</>
				)}
			</div>
		</div>
	);
}
