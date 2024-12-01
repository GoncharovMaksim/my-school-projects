import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
	name: string;
	email: string;
	password?: string; // Необязательное поле для пользователей с OAuth
	image?: string; // Ссылка на аватар
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String }, // Поле для хранения пароля, если используется регистрация через email/пароль
		image: { type: String }, // Ссылка на аватар пользователя
	},
	{
		timestamps: true, // Автоматически добавляет поля createdAt и updatedAt
	}
);

export default mongoose.models.User ||
	mongoose.model<IUser>('User', userSchema);
  //
  
