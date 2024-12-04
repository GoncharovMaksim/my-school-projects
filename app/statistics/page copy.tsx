import { authConfig } from '@/configs/auth';
import { getServerSession } from 'next-auth';

// Тип данных для статистики пользователя
interface UserStatistics {
	userId: string;
	timeSpent: number;
	grade: string;
	percentCorrectAnswer: number;
	operator: string;
	difficultyLevel: string;
	createdAt: string;
}

export default async function App() {
	const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gameStatistics/math`;
	const session = await getServerSession(authConfig);

	// Проверка на случай, если сессия отсутствует
	if (!session) {
		console.error('Сессия не найдена.');
		return <p>Вы не авторизованы.</p>;
	}

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

	// Фильтруем статистику по userId
	const filteredStatistics = userStatistics.filter(
		el => el.userId === session.user?.id
	);

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<div className='p-8 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4'>Статистика</h1>
				<h3 className='text-2xl text-center font-bold mb-4'>Математика:</h3>
			</div>
			<div className='bg-gray-200 p-2 rounded text-1xl'>
				<p>Игр сыграно: {filteredStatistics.length}</p>
			</div>
			<div>
				{filteredStatistics.length > 0 ? (
					filteredStatistics.map((el, index) => (
						<pre key={index} className='bg-gray-200 p-2 rounded'>
							<div>Игра № {index + 1}</div>
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
