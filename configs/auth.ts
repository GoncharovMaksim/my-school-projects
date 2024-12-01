import { AuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import connectDB from '@/configs/connectDB';
import User from '@/models/User'

export const authConfig: AuthOptions = {
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_SECRET as string,
		}),
	],
	callbacks: {
		// Колбэк срабатывает после успешного входа пользователя
		async signIn({ user, account }) {
			try {
				// Подключаемся к базе данных
				await connectDB();

				// Проверяем, есть ли пользователь в базе данных
				const existingUser = await User.findOne({ email: user.email });

				if (!existingUser) {
					// Добавляем пользователя в базу данных
					await User.create({
						email: user.email,
						name: user.name,
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
		async session({ session, token }) {
			// Добавляем ID пользователя из базы данных в сессию
			if (token?.sub) {
				session.user.id = token.sub;
			}
			return session;
		},
	},
};
