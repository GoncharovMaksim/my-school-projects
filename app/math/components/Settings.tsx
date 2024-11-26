import DropdownMenu from '../../components/DropdownMenu';
import { useState } from 'react';
import { GameProps } from './types';

export default function Settings({ setGameSettings }: GameProps) {

	const [operator, setOperator] = useState('*');
	const [difficultyLevel, setDifficultyLevel] = useState(1);


	const handleOperatorChange = (newOperator: string) => {
		setOperator(newOperator);
	};

	const handleDifficultyChange = (newLevel: number) => {
		setDifficultyLevel(newLevel);
	};

	const handleStartGame = () => {
		setGameSettings(prevSettings => ({
			...prevSettings,
			operator,
			difficultyLevel,
			gameStatus: true,
		}));
	};

	return (
		<>
			<DropdownMenu
				defaultLabel='Выберите действие'
				options={[
					{
						label: 'Умножение',
						onClick: () => handleOperatorChange('*'),
					},
					{
						label: 'Сложение',
						onClick: () => handleOperatorChange('+'),
					},
					{
						label: 'Вычитание',
						onClick: () => handleOperatorChange('-'),
					},
					{
						label: 'Деление',
						onClick: () => handleOperatorChange('/'),
					},
				]}
			/>
			<DropdownMenu
				defaultLabel='Выберите сложность'
				options={[
					{
						label: 'Уровень 1',
						onClick: () => handleDifficultyChange(1),
					},
					{
						label: 'Уровень 2',
						onClick: () => handleDifficultyChange(2),
					},
					{
						label: 'Уровень 3',
						onClick: () => handleDifficultyChange(3),
					},
				]}
			/>
			<button
				className='btn btn-outline w-full max-w-xs'
				onClick={handleStartGame}
			>
				Начать
			</button>
		</>
	);
}
