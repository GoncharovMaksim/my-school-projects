// pages/api/statistics.ts
import connectDB from '@/configs/connectDB';

//import Word from '../../backend/models/words';

export async function GET() {
	await connectDB(); // Подключаемся к базе данных
}
//1
