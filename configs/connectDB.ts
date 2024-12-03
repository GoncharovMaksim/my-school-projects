// config/connectDB.ts


import mongoose from 'mongoose';

const connectDB = async () => {
	if (mongoose.connection.readyState === 0) {
		// Если соединение не установлено
		try {
			await mongoose.connect(process.env.MONGO_DB as string);
			console.log('Подключение к MongoDB успешно установлено');
		} catch (error) {
			console.error('Ошибка подключения к базе данных:', error);
			throw new Error('Не удалось подключиться к MongoDB');
		}
	} else {
		console.log('Подключение к MongoDB уже установлено');
	}
};

export default connectDB;
