'use client'; // Этот компонент должен быть клиентским, чтобы управлять изменениями фильтров

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Filters() {
	const router = useRouter();
	const [operator, setOperator] = useState('');
	const [difficulty, setDifficulty] = useState('');

	const handleFilterChange = () => {
		const params = new URLSearchParams();
		if (operator) params.append('operator', operator);
		if (difficulty) params.append('difficultyLevel', difficulty);
		router.push(`/statistics?${params.toString()}`);
	};

	return (
		<div className='filters flex flex-col space-y-4'>
			<h3 className='text-lg font-bold'>Фильтры:</h3>

			<select
				value={operator}
				onChange={e => setOperator(e.target.value)}
				className='p-2 rounded border'
			>
				<option value=''>Выберите действие</option>
				<option value='Умножение'>Умножение</option>
				<option value='Сложение'>Сложение</option>
				<option value='Вычитание'>Вычитание</option>
				<option value='Деление'>Деление</option>
			</select>

			<select
				value={difficulty}
				onChange={e => setDifficulty(e.target.value)}
				className='p-2 rounded border'
			>
				<option value=''>Выберите уровень сложности</option>
				<option value='1'>Легкий</option>
				<option value='2'>Средний</option>
				<option value='3'>Сложный</option>
			</select>

			<button
				onClick={handleFilterChange}
				className='bg-blue-500 text-white p-2 rounded'
			>
				Применить
			</button>
		</div>
	);
}
//1