import { NextResponse } from 'next/server';
import Subscription from '@/models/Subscription'; // Убедитесь, что путь правильный
import connectDB from '@/configs/connectDB';

export async function GET() {
	try {
    await connectDB();
		// Получаем подписки из базы данных
		const subscriptions = await Subscription.find();
		return NextResponse.json(subscriptions);
	} catch (error) {
		console.error('Failed to fetch subscriptions:', error);
		return NextResponse.json(
			{ error: 'Error fetching subscriptions' },
			{ status: 500 }
		);
	}
}
