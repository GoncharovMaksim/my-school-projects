// config/connectDB.ts
import mongoose from 'mongoose';

export default async function connectDB() {
	if (mongoose.connection.readyState >= 1) {
		console.log('Подключение уже установлено');
		return;
	}

	try {
		await mongoose.connect(process.env.MONGO_DB as string);
		console.log('Подключено к MongoDB school112');
	} catch (error) {
		console.error('Ошибка подключения к MongoDB', error);
		process.exit(1);
	}
}
