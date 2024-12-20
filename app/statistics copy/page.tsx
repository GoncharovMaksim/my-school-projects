import { authConfig } from '@/configs/auth';
import { getServerSession } from 'next-auth';
import { Filters } from './Filters';

interface UserStatistics {
	userId: string;
	timeSpent: number;
	grade: number;
	percentCorrectAnswer: number;
	operator: string;
	difficultyLevel: number;
	createdAt: Date;
}

type SearchParams = Promise<Record<string, string | undefined>>;

export default async function App(props: { searchParams: SearchParams }) {
	const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gameStatistics/math`;
	const session = (await getServerSession(authConfig)) as {
		user?: { id?: string };
	};

	if (!session) {
		console.error('Сессия не найдена.');
		return <p>Вы не авторизованы.</p>;
	}

	const searchParams = await props.searchParams;
	const operator = (await searchParams.operator) || null;
	const difficultyLevel = (await searchParams.difficultyLevel) || null;
	const isCheckedFilterDate = (await searchParams.isCheckedFilterDate) || null;

	let userStatistics: UserStatistics[] = [];
	try {
		const response = await fetch(url, { cache: 'no-store' });
		if (!response.ok) {
			throw new Error(`HTTP Error: ${response.status}`);
		}
		userStatistics = await response.json();
	} catch (error) {
		console.error('Ошибка при получении данных:', error);
	}
	// let filteredCurrentUserStatistics=userStatistics.filter(
	// 		el => el.userId === session.user?.id
	// 	);

const filteredStatisticsSearch = (statistics: UserStatistics[]) => {
	let filteredStatistics = [...statistics];
	if (operator) {
		filteredStatistics = filteredStatistics.filter(
			el => el.operator === operator
		);
	}

	if (difficultyLevel) {
		const numDifficultyLevel = Number(difficultyLevel);
		filteredStatistics = filteredStatistics.filter(
			el => el.difficultyLevel === numDifficultyLevel
		);
	}

	if (!isCheckedFilterDate) {
		const filterDate = new Date();
		// filterDate.setFullYear(2024);
		// filterDate.setMonth(11);
		// filterDate.setDate(5);
		console.log('filterDate', filterDate);
		filterDate.setHours(0, 0, 0, 0);

		filteredStatistics = filteredStatistics.filter(el => {
			if (!el.createdAt) return false;

			const createdAtDate = new Date(el.createdAt);
			if (isNaN(createdAtDate.getTime())) return false;
			createdAtDate.setHours(0, 0, 0, 0);
			return createdAtDate.getTime() === filterDate.getTime();
		});
	}
	return filteredStatistics;
};
	const checkMinTimeSpent = (
		statistics: UserStatistics[]
	): number | undefined => {
		const arrUserTimeSpent: number[] = [];
		statistics.forEach(el => {
			if (el.grade === 5) {
				arrUserTimeSpent.push(el.timeSpent);
			}
		});

		if (arrUserTimeSpent.length === 0) {
			console.log('Массив пуст, минимального значения нет');
			return undefined;
		}

		let minUserTimeSpent = arrUserTimeSpent[0];
		for (let i = 1; i < arrUserTimeSpent.length; i++) {
			if (arrUserTimeSpent[i] < minUserTimeSpent) {
				minUserTimeSpent = arrUserTimeSpent[i];
			}
		}

		console.log('Минимальное значение времени:', minUserTimeSpent);
		return minUserTimeSpent;
	};

	let filteredCurrentUserStatistics = filteredStatisticsSearch(userStatistics);

	filteredCurrentUserStatistics = filteredCurrentUserStatistics.filter(
		el => el.userId === session.user?.id
	);

	const filteredAllUserStatistics =
			filteredStatisticsSearch(userStatistics);

	const minUserTimeSpent = checkMinTimeSpent(filteredCurrentUserStatistics);
	const minAllUserTimeSpent = checkMinTimeSpent(filteredAllUserStatistics);



	
	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<div className='p-8 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4'>Статистика</h1>
				<Filters />
				<div>
					{/* <p>Время сервера: {filterDate.toString()}</p> */}
					<p>Игр сыграно: {filteredCurrentUserStatistics.length}</p>
					<p>
						Ваше лучшее время:{' '}
						{minUserTimeSpent !== undefined &&
						minAllUserTimeSpent !== undefined &&
						minUserTimeSpent <= minAllUserTimeSpent
							? `${minUserTimeSpent} 🥇`
							: minUserTimeSpent ?? 'Не доступно'}
					</p>
					<p>Рекордное время: {minAllUserTimeSpent ?? 'Не доступно'}</p>
				</div>
			</div>

			<div>
				{filteredCurrentUserStatistics.length > 0 ? (
					filteredCurrentUserStatistics.map(el => (
						<pre key={el.timeSpent} className='bg-gray-200 p-2 rounded'>
							<div>Игра № {filteredCurrentUserStatistics.indexOf(el) + 1}</div>
							<p>Время: {el.timeSpent} сек.</p>
							<p>Оценка: {el.grade}</p>
							<p>Процент правильных ответов: {el.percentCorrectAnswer}%</p>
							<p>Действие: {el.operator}</p>
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
