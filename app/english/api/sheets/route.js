import { NextResponse } from 'next/server';
import connectDB from '../../../backend/config/db';
import Sheet from '../../../backend/models/sheet'; // Импорт модели MongoDB

// Подключение к базе данных MongoDB
connectDB();

// GET запрос
export async function GET() {
	try {
		const sheets = await Sheet.find(); // Получаем данные из MongoDB
		return NextResponse.json(sheets); // Возвращаем данные
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: 'Не удалось получить данные' },
			{ status: 500 }
		);
	}
}

// POST запрос
export async function POST(request) {
	try {
		const { sheetTitle, sheetContent } = await request.json();
		const newSheet = new Sheet({
			sheetTitle,
			sheetContent,
		});
		await newSheet.save(); // Сохраняем данные в MongoDB
		return NextResponse.json({ message: 'Лист успешно сохранен' });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function DELETE(request) {
	try {
		// Получаем URL запроса
		const { pathname } = new URL(request.url);
		const id = pathname.split('/').pop(); // Извлекаем id из пути (последний сегмент пути)

		// Логируем извлеченный id
		console.log('Это извлеченный id:', id);

		if (!id) {
			return new Response(JSON.stringify({ message: 'ID не передан' }), {
				status: 400,
			});
		}

		// Удаление элемента из базы данных
		const result = await Sheet.deleteOne({ _id: id });

		// Ответ в зависимости от результата удаления
		if (result.deletedCount > 0) {
			return new Response(
				JSON.stringify({ message: 'Элемент удалён успешно' }),
				{ status: 200 }
			);
		} else {
			return new Response(JSON.stringify({ message: 'Элемент не найден' }), {
				status: 404,
			});
		}
	} catch (error) {
		console.error('Ошибка при удалении:', error);
		return new Response(JSON.stringify({ message: 'Ошибка сервера', error }), {
			status: 500,
		});
	}
}
