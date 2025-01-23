import connectDB from "@/configs/connectDB";
import { sendNotification } from "./actions";

async function connectToDatabase() {
	console.log('Connecting to MongoDB...');
	try {
		await connectDB();
		console.log('Successfully connected to MongoDB');
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
		throw new Error('Database connection failed');
	}
}
export default async function cronPushNotification(){
  const message='Дорогой друг! Не забудь позаниматься!';
  const userId=''
  await connectToDatabase();
  await sendNotification(message, userId);
  const result = { success: true, message: 'Задача выполнена успешно!' };
  return result
}