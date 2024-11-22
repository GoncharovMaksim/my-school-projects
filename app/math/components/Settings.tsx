import DropdownMenu from '../../components/DropdownMenu';
import { useState } from 'react';

export default function StartSettings({
	setGameSettings,
}: {
	setGameSettings: React.Dispatch<
		React.SetStateAction<{
			operator: string;
			difficultyLevel: number;
			gameStatus: boolean;
			stepGame: number;
			limGame: number;
		}>
	>;
}) {
	// Локальное состояние для временных значений
	const [operator, setOperator] = useState('*');
	const [difficultyLevel, setDifficultyLevel] = useState(1);

	// Обработчики для обновления состояния
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
