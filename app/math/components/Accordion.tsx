import Timer from './Timer';
import { GameProps } from './types';
export default function Accordion({ gameSettings, setGameSettings }: GameProps) {
	const { stepGame, difficultyLevel } = gameSettings;
	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm'>
			<div className='collapse collapse-arrow bg-base-200'>
				<input type='checkbox' name='my-accordion-2' />
				<div className='collapse-title text-xl font-medium'>Параметры</div>
				<div className='collapse-content text-xl'>
					<p>Уровень сложности: {difficultyLevel}</p>
					<p>Вопросов задано: {stepGame}</p>
					<div>
						Затрачено времени:{' '}
						<Timer
							setGameSettings={setGameSettings}
							gameSettings={gameSettings}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
