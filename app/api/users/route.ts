// pages/api/statistics.ts
import connectDB from '@/configs/connectDB';


//import Word from '../../backend/models/words';

export async function GET(req) {
	await connectDB(); // Подключаемся к базе данных

	// Используем URL для извлечения параметров запроса
	const { searchParams } = new URL(req.url);
	const schoolClass = searchParams.get('schoolClass');
	const lessonUnit = searchParams.get('lessonUnit');
	const unitStep = searchParams.get('unitStep');

	try {
		// Логируем параметры для проверки
		console.log('Полученные параметры:', { schoolClass, lessonUnit, unitStep });

		// Создаем объект для фильтрации

		const filter = {};
		if (schoolClass) filter.schoolClass = Number(schoolClass); // Преобразуем в число
		if (lessonUnit) filter.lessonUnit = Number(lessonUnit); // Преобразуем в число
		if (unitStep) filter.unitStep = Number(unitStep); // Преобразуем в число

		// Логируем фильтр для проверки
		console.log('Используемый фильтр:', filter);

		// Запрос в базу данных с фильтром
		const words = await Word.find(filter);

		if (words.length === 0) {
			return new Response(JSON.stringify({ message: 'Уроки не найдены' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Ответ с найденными словами
		return new Response(JSON.stringify(words), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Ошибка при получении слов:', error); // Логируем ошибку

		return new Response(
			JSON.stringify({ message: 'Ошибка получения уроков', error }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
//1
