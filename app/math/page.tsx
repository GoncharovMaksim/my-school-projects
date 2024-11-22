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
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
			<div className='p-8 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4'>Математика</h1>
				
					{!startGame ? (
						<Settings
							setGameSettings={setGameSettings}
							setStartGame={setStartGame}
						/>
					) : (
						<Game gameSettings={gameSettings} />
					)}
				
			</div>
			
		</div>
	);
}
