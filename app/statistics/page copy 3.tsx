import { authConfig } from '@/configs/auth';
import { getServerSession } from 'next-auth';
import { Filters } from './Filters';

interface UserStatistics {
	userId: string;
	timeSpent: number;
	grade: string;
	percentCorrectAnswer: number;
	operator: string;
	difficultyLevel: number;
	createdAt: string;
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

	// Ожидаем обработки searchParams
	const searchParams = await props.searchParams;
	const operator = (await searchParams.operator) || null;
	const difficultyLevel = (await searchParams.difficultyLevel) || null;

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

	let filteredStatistics = userStatistics.filter(
		el => el.userId === session.user?.id
	);

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

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<div className='p-8 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4'>Статистика</h1>
				<Filters />
			</div>

			<div className='bg-gray-200 p-2 rounded text-1xl'>
				<p>Игр сыграно: {filteredStatistics.length}</p>
			</div>

			<div>
				{filteredStatistics.length > 0 ? (
					filteredStatistics.map(el => (
						<pre key={el.createdAt} className='bg-gray-200 p-2 rounded'>
							<div>Игра № {filteredStatistics.indexOf(el) + 1}</div>
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

//1