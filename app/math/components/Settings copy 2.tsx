
import DropdownMenu from '../../components/DropdownMenu';
import { useEffect, useState } from 'react';
import { GameProps } from './types';

export default function Settings({ setGameSettings }: GameProps) {
	
	const [operator, setOperator] = useState('*');
	const [difficultyLevel, setDifficultyLevel] = useState(1);
	    useEffect(() => {
				if (typeof window !== 'undefined') {
					const operatorLocalStorage = localStorage.getItem('operator') || '*';
					const difficultyLevelLocalStorage =
						localStorage.getItem('difficultyLevel');

					setOperator(operatorLocalStorage);
					setDifficultyLevel(
						difficultyLevelLocalStorage
							? Number(difficultyLevelLocalStorage)
							: 1
					);
				}
			}, []);
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
		localStorage.setItem('operator',operator);
		localStorage.setItem('difficultyLevel', difficultyLevel.toString());
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
