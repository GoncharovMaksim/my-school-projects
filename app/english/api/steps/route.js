import connectDB from '@/configs/connectDB';
import Word from '../../backend/models/words';

export async function GET(req) {
	await connectDB();

	// Используем URL для извлечения параметров запроса
	const { searchParams } = new URL(req.url);
	const lessonUnit = searchParams.get('lessonUnit');
	const schoolClass = searchParams.get('schoolClass');

	// Логируем значения для диагностики
	console.log('lessonUnit:', lessonUnit, 'schoolClass:', schoolClass);

	try {
		// Преобразуем параметры в числа и выполняем запрос к базе данных
		const steps = await Word.distinct('unitStep', {
			lessonUnit: Number(lessonUnit),
			schoolClass: Number(schoolClass),
		});

		console.log('Steps:', steps);

		return new Response(JSON.stringify(steps), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Ошибка при получении шагов:', error);
		return new Response(
			JSON.stringify({ message: 'Ошибка при получении шагов', error }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
//
