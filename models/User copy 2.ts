import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
	name: string;
	email: string;
	password?: string; // Необязательное поле для пользователей с OAuth
	image?: string; // Ссылка на аватар
	createdAt: Date;
	updatedAt: Date;
	lastVisit: Date; // Поле для даты последнего визита
	isAdmin: boolean; // Добавлено поле для проверки, является ли пользователь администратором
}

const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String }, // Поле для хранения пароля, если используется регистрация через email/пароль
		image: { type: String }, // Ссылка на аватар пользователя
		lastVisit: { type: Date, default: Date.now }, // Поле с текущей датой по умолчанию
		isAdmin: { type: Boolean, default: false }, // Новое поле, указывающее, является ли пользователь администратором
	},
	{
		timestamps: true, // Автоматически добавляет поля createdAt и updatedAt
	}
);

// Middleware для обновления lastVisit при сохранении пользователя
userSchema.pre('save', function (next) {
	this.lastVisit = new Date(); // Устанавливаем текущую дату
	next();
});

// Middleware для обновления lastVisit при каждом запросе
userSchema.methods.updateLastVisit = async function () {
	this.lastVisit = new Date();
	await this.save();
};

export default mongoose.models.User ||
	mongoose.model<IUser>('User', userSchema);
