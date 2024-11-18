import connectDB from '../../backend/config/db';
import Word from '../../backend/models/words';

export async function GET(req) {
	await connectDB();



    // Получаем параметр schoolClass из запроса
    const schoolClass = req.nextUrl.searchParams.get('schoolClass'); // Используем get, а не деструктуризацию

    console.log('schoolClass:', schoolClass);

    // Проверка на наличие schoolClass в запросе
    if (!schoolClass) {
        return new Response(
            JSON.stringify({ message: 'Параметр schoolClass обязателен' }),
            { status: 400 }
        );
    }

    // Преобразуем schoolClass в число, если оно строковое
    const schoolClassNum = Number(schoolClass);

    if (isNaN(schoolClassNum)) {
        return new Response(
            JSON.stringify({ message: 'Некорректный параметр schoolClass' }),
            { status: 400 }
        );
    }

    try {
        // Получаем distinct значения для уроков и шагов
        const options = await Word.distinct('lessonUnit', {
            schoolClass: schoolClassNum,
        });
        const steps = await Word.distinct('unitStep', {
            schoolClass: schoolClassNum,
        });

        console.log('options:', options);
        console.log('steps:', steps);

        return new Response(
            JSON.stringify({ lessons: options, steps }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Ошибка при получении опций:', error);

        return new Response(
            JSON.stringify({ message: 'Ошибка при получении опций', error }),
            { status: 500 }
        );
    }
}
