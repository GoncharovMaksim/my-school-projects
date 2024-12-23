'use client';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '@/lib/store';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../loading';
import { loadEnglishStatistics } from './loadEnglishStatistics';

export default function EnglishStatistics() {
	const dispatch = useDispatch<AppDispatch>();
	const allUsersStatisticsList = useSelector(
		(state: RootState) => state.englishStat.englishStatList
	);
	


useEffect(() => {
	if (allUsersStatisticsList.length === 0) {
		dispatch(loadEnglishStatistics());
	}
}, [dispatch, allUsersStatisticsList.length]);

	if (allUsersStatisticsList.length === 0) {
	
		return <Loading />;
	}

	return (
		<div className='container mx-auto px-4 p-8 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<h1 className='text-4xl text-center font-bold mb-4'>Статистика</h1>
			<h3 className='text-2xl text-center font-bold mb-4'>Английский</h3>
			<div>
				{allUsersStatisticsList.length > 0 ? (
					allUsersStatisticsList.map(el => (
						<pre
							key={el.createdAt.toString()}
							className='bg-gray-200 p-2 rounded'
						>
							<div>Тест № {allUsersStatisticsList.indexOf(el) + 1}</div>
							<p>Время: {el.timeSpent} сек.</p>
							<p>Оценка: {el.grade}</p>
							<p>Процент правильных ответов: {el.percentCorrectAnswer}%</p>
							<p>Класс: {el.schoolClass}</p>
							<p>Урок: {el.lessonUnit}</p>
							<p>Шаг: {el.unitStep}</p>
							<p>Сложность: {el.difficultyLevel}</p>
							<p>Дата: {new Date(el.createdAt).toLocaleString('ru-RU')}</p>
						</pre>
					))
				) : (
					<p>Данных нет</p>
				)}
			</div>
		</div>
	);
}
