// config/db.js

import mongoose	from 'mongoose'
const connectDB = async () => {
	try {
		await mongoose.connect(
			'mongodb+srv://papkand:Val12345678@cluster0.sorq7.mongodb.net/english?retryWrites=true&w=majority&appName=Cluster0'
		);
		console.log('Подключено к MongoDB');
	} catch (error) {
		console.error('Ошибка подключения к MongoDB', error);
		process.exit(1); // Завершение процесса, если подключение не удалось
	}
};

export default connectDB;