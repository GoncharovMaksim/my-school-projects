import connectDB from '../../../../backend/config/db';
import Sheet from '../../../../backend/models/sheet'; // Импорт модели MongoDB

// Подключение к базе данных MongoDB
connectDB();

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
