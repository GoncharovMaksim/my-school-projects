'use client';
import { useState } from 'react';
import Settings from './components/Settings';
import Game from './components/Game';
export default function App() {

	const [gameSettings, setGameSettings] = useState( {
		operator: '*',
		difficultyLevel: 1,
	});

const [startGame, setStartGame]= useState(false);
///const[endGame, setEndGame]= useState(false)


	return (
		<div>
			{!startGame ? (
				<Settings
					setGameSettings={setGameSettings}
					setStartGame={setStartGame}
				/>
			) : (
				<Game gameSettings={gameSettings} />
			)}
		</div>
	);
}
