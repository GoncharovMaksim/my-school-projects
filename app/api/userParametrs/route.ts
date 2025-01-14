import connectDB from '@/configs/connectDB';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const { userId, newPassword } = body;

		if (!userId || !newPassword) {
			return new Response(
				JSON.stringify({ error: 'userId и newPassword обязательны.' }),
				{ status: 400 }
			);
		}

		await connectDB();

		// Найти пользователя по ID
		const user = await User.findById(userId);
		if (!user) {
			return new Response(
				JSON.stringify({ error: 'Пользователь не найден.' }),
				{ status: 404 }
			);
		}

		// Хэшировать новый пароль
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		// Обновить пароль
		user.password = hashedPassword;
		await user.save();

		return new Response(
			JSON.stringify({ message: 'Пароль успешно обновлен.' }),
			{ status: 200 }
		);
	} catch (error) {
		console.error('Ошибка при обновлении пароля:', error);
		return new Response(
			JSON.stringify({ error: 'Внутренняя ошибка сервера.' }),
			{ status: 500 }
		);
	}
}
