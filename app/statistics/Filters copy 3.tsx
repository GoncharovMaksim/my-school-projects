'use client'; // Этот компонент должен быть клиентским, чтобы управлять изменениями фильтров

import DropdownMenu from '@/components/DropdownMenu';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// // Определяем типы для опций DropdownMenu
// interface DropdownOption {
// 	label: string;
// 	onClick: () => void;
// }

// // Типизация пропсов DropdownMenu (если она используется здесь)
// interface DropdownMenuProps {
// 	defaultLabel: string;
// 	options: DropdownOption[];
// }

export function Filters() {
	const router = useRouter();
	const [operator, setOperator] = useState<string>(''); // Оператор: строка
	const [difficulty, setDifficulty] = useState<number | ''>(''); // Сложность: число или пустая строка
	const [isCheckedFilterDate, setIsCheckedFilterDate] = useState(true);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsCheckedFilterDate(event.target.checked);
	};
	const handleFilterChange = () => {
		const params = new URLSearchParams();
		if (operator) params.append('operator', operator);
		if (difficulty) params.append('difficultyLevel', difficulty.toString());
		if (isCheckedFilterDate === false)
			params.append('isCheckedFilterDate', isCheckedFilterDate.toString());
		router.push(`/statistics?${params.toString()}`);
	};
	useEffect(()=>{
		setOperator('');
		setDifficulty('');
		handleFilterChange();
	},[])

	return (
		<>
			<h3 className='text-lg font-bold'>Фильтры:</h3>
			<label className='flex items-center gap-2'>
				<input
					type='checkbox'
					checked={isCheckedFilterDate}
					onChange={handleChange}
					className='checkbox'
				/>
				<span>Статистика за сегодня</span>
			</label>

			{/* DropdownMenu для оператора */}
			<DropdownMenu
				defaultLabel='Выберите действие'
				options={[
					{
						label: 'Умножение',
						onClick: () => setOperator('Умножение'),
					},
					{
						label: 'Сложение',
						onClick: () => setOperator('Сложение'),
					},
					{
						label: 'Вычитание',
						onClick: () => setOperator('Вычитание'),
					},
					{
						label: 'Деление',
						onClick: () => setOperator('Деление'),
					},
					{
						label: 'Все действия',
						onClick: () => setOperator(''),
					},
				]}
			/>

			{/* DropdownMenu для уровня сложности */}
			<DropdownMenu
				defaultLabel='Выберите сложность'
				options={[
					{
						label: 'Уровень 1',
						onClick: () => setDifficulty(1),
					},
					{
						label: 'Уровень 2',
						onClick: () => setDifficulty(2),
					},
					{
						label: 'Уровень 3',
						onClick: () => setDifficulty(3),
					},
					{
						label: 'Все уровни',
						onClick: () => setDifficulty(0),
					},
				]}
			/>

			<button
				className='btn btn-outline w-full max-w-xs'
				onClick={handleFilterChange}
			>
				Применить
			</button>
		</>
	);
}
