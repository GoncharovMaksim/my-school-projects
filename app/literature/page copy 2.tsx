'use client';

import { useEffect, useState } from 'react';
import Test from './test';
import getOptionsList from './getOptionsList';
import styles from './page.module.css';
import DropdownMenu from '@/components/DropdownMenu';

export default function App() {
	const [isLoading, setisLoading] = useState(true);
	const [optionsList, setOptionsList] = useState<string[]>([]);
	const [userCheckOptions, setUserCheckOptions] = useState<string>('');
	const [startTests, setStartTest] = useState<boolean>(false);
	
	useEffect(() => {
		getOptionsList().then(response => {
			setOptionsList(response);
			setUserCheckOptions(response[0] || '');
			setisLoading(false);
		});
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setUserCheckOptions(e.target.value);
	};

	const handleStartTest = () => {
		setStartTest(true);
	};

	if (isLoading) {
		return <div className={styles.page}>Загрузка...</div>;
	}
	return !startTests ? (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
			<div className='my-8 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4 '>Литература</h1>
				<h3>Выберите тему теста</h3>
				<select
					className={styles.optionsList}
					name='optionsList'
					id='optionsList'
					value={userCheckOptions}
					onChange={handleChange}
				>
					{optionsList.map(option => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>

				<DropdownMenu
					//defaultLabel={getOperatorLabel(operator)} // Отображаем правильную метку
					options={optionsList.map(option => ({
						label: option
					}))}
				/>

				<button
					className='btn btn-outline w-full max-w-xs'
					onClick={handleStartTest}
				>
					Начать
				</button>
			</div>
		</div>
	) : (
		<Test
			userCheckOptions={`topic=${userCheckOptions}`}
			setStartTest={setStartTest}
		/>
	);
}
