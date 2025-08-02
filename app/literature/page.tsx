'use client';

import { useEffect, useState } from 'react';
import Test from './test';
import getOptionsList from './getOptionsList';
import styles from './page.module.css';

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
		<div className={styles.page}>
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
			<button className={styles.button} onClick={handleStartTest}>
				Начать
			</button>
		</div>
	) : (
		<Test
			userCheckOptions={`topic=${userCheckOptions}`}
			setStartTest={setStartTest}
		/>
	);
}
