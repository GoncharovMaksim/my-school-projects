import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/configs/connectDB';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export const authConfig: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_SECRET as string,
		}),
		CredentialsProvider({
			credentials: {
				email: { label: 'Email', type: 'email' },
				nickName: { label: 'Nick', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error('Email и пароль обязательны.');
				}

				await connectDB();

				// Проверка, существует ли пользователь с таким email
				let user = await User.findOne({ email: credentials.email });

				if (!user) {
					// Если пользователь не найден, создаем нового
					const hashedPassword = await bcrypt.hash(credentials.password, 10);
					user = await User.create({
						email: credentials.email,
						password: hashedPassword,
						name: credentials.email.split('@')[0], // Имя по умолчанию (можно изменить логику)
						isAdmin: false,
						nickName: credentials.nickName ? credentials.nickName : '',
						lastVisit: new Date(),
					});
				}

				// Проверка пароля, если пользователь был найден в базе
				const isPasswordValid = await bcrypt.compare(
					credentials.password,
					user.password
				);
				if (!isPasswordValid) {
					throw new Error('Неверный пароль.');
				}

				return {
					id: user._id.toString(),
					email: user.email,
					name: user.name,
					isAdmin: user.isAdmin,
					nickName: user.nickName ? user.nickName : credentials.nickName,
				};
			},
		}),
	],
	pages: {
		signIn: '/auth/signin', // Укажите путь к кастомной странице
		
	},
	callbacks: {
		async signIn({ user }) {
			try {
				await connectDB();
				const existingUser = await User.findOne({ email: user.email });

				if (existingUser) {
					existingUser.lastVisit = new Date();
					existingUser.image = user.image;
					existingUser.name = existingUser.name ? user.name : '';
					if (!existingUser.nickName) {
						existingUser.nickName = user.nickName;
					}
					await existingUser.save();
				} else {
					await User.create({
						email: user.email,
						name: user.name || 'Без имени',
						image: user.image,
						lastVisit: new Date(),
						isAdmin: false,
						nickName: '',
						password: bcrypt.hashSync('defaultPassword', 10), // Для Google авторизации (в случае необходимости)
					});
				}

				return true;
			} catch (error) {
				console.error('Ошибка при обработке signIn:', error);
				return false;
			}
		},
		async session({ session }) {
			try {
				await connectDB();
				if (session.user) {
					const dbUser = await User.findOne({ email: session.user.email });

					if (dbUser) {
						session.user.id = dbUser._id.toString();
						session.user.isAdmin = dbUser.isAdmin;
						session.user.nickName = dbUser.nickName;
					}
				}
				return session;
			} catch (error) {
				console.error('Ошибка при обновлении session:', error);
				return session;
			}
		},
	},
};
