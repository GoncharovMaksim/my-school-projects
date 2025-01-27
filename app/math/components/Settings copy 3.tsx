import DropdownMenu from '../../../components/DropdownMenu';
import { useEffect, useState } from 'react';
import { GameProps } from './types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { loadMathStatistics } from '@/app/statistics/math/loadMathStatistics';

import MathStatisticsToday from '@/app/statistics/math/MathStatisticsToday';

export default function Settings({ setGameSettings }: GameProps) {
	const [operator, setOperator] = useState('*'); // Значение по умолчанию '*'
	const [difficultyLevel, setDifficultyLevel] = useState(1);
	const [isLoading, setIsLoading] = useState(true); // Флаг загрузки данных

	// Функция для получения текста оператора по его значению
	const getOperatorLabel = (operator: string) => {
		switch (operator) {
			case '*':
				return 'Умножение';
			case '+':
				return 'Сложение';
			case '-':
				return 'Вычитание';
			case '/':
				return 'Деление';
			default:
				return 'Выберите действие';
		}
	};

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const operatorLocalStorage = localStorage.getItem('operator') || '*';
			const difficultyLevelLocalStorage =
				localStorage.getItem('difficultyLevel') || 1;

			setOperator(operatorLocalStorage !== '' ? operatorLocalStorage : '*'); // Обновляем значение оператора

			setDifficultyLevel(
				difficultyLevelLocalStorage !== ''
					? Number(difficultyLevelLocalStorage)
					: 1
			); // Устанавливаем уровень сложности

			// После загрузки данных, снимаем флаг загрузки
			setIsLoading(false);
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
		localStorage.setItem('operator', operator); // Сохраняем значение оператора
		localStorage.setItem('difficultyLevel', difficultyLevel.toString()); // Сохраняем уровень сложности
	};

	
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		dispatch(loadMathStatistics({ today: true }));
	}, [dispatch]);


	if (isLoading) {
		return <div>Загрузка...</div>;
	}

	return (
		<>
			<div>Настройки:</div>
			<DropdownMenu
				defaultLabel={getOperatorLabel(operator)} // Отображаем правильную метку
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
				defaultLabel={`Уровень ${difficultyLevel}`}
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
			<MathStatisticsToday
				minTimeSpent={false}
				operatorFromSettings={operator}
				difficultyLevelFromSettings={difficultyLevel}
			/>
		</>
	);
}
