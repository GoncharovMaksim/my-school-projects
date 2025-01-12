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

				if (existingUser) {
					// Обновляем дату последнего визита
					existingUser.lastVisit = new Date();
					await existingUser.save();
				} else {
					// Создаем нового пользователя
					await User.create({
						email: user.email,
						name: user.name || 'Без имени',
						image: user.image,
						lastVisit: new Date(), // Устанавливаем дату визита
						isAdmin: false, // Устанавливаем значение по умолчанию для обычных пользователей
						nickName: 'Ник не задан',
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
				await connectDB();
				if (session.user) {
					const dbUser = await User.findOne({ email: session.user.email });

					const now = new Date();
					const oneHour = 60 * 60 * 1000; // Один час в миллисекундах
					if (
						dbUser &&
						(!dbUser.lastVisit ||
							now.getTime() - dbUser.lastVisit.getTime() > oneHour)
					) {
						dbUser.lastVisit = now;
						await dbUser.save();
					}

					if (dbUser) {
						session.user.id = dbUser._id.toString();
						session.user.isAdmin = dbUser.isAdmin; // Добавляем статус администратора в сессию
						session.user.nickName = dbUser.nickName;
					}
				}
				return session;
			} catch (error) {
				console.error('Ошибка при обновлении lastVisit:', error);
				return session;
			}
		},
	},
};
