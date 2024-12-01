import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/configs/connectDB';
import User from '@/models/User';

export const authConfig: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_SECRET as string,
		}),
	],
	callbacks: {
		// Колбэк срабатывает после успешного входа пользователя
		async signIn({ user }) {
			try {
				// Подключаемся к базе данных
				await connectDB();

				// Проверяем, есть ли пользователь в базе данных
				const existingUser = await User.findOne({ email: user.email });

				if (!existingUser) {
					// Добавляем пользователя в базу данных
					await User.create({
						email: user.email,
						name: user.name || 'Без имени',
						profilePicture: user.image,
					});
				}

				return true; // Успешный вход
			} catch (error) {
				console.error('Ошибка при обработке signIn:', error);
				return false; // Прерываем процесс авторизации
			}
		},

		// Колбэк срабатывает при создании сессии
		async session({ session }) {
			try {
				// Подключаемся к базе данных
				await connectDB();

				if (session.user) {
					// Получаем данные пользователя из базы
					const dbUser = await User.findOne({ email: session.user.email });
					if (dbUser) {
						session.user.id = dbUser._id.toString(); // Добавляем ID пользователя
					}
				}

				return session;
			} catch (error) {
				console.error('Ошибка при обработке session:', error);
				return session;
			}
		},
	},
};
//