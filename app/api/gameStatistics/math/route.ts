// pages/api/MathStatistics/route.ts

import { NextResponse } from 'next/server';
import connectDB from '@/configs/connectDB';
import MathStatistics from '@/models/MathStatistics';

export async function GET(req: Request) {
	await connectDB();

	const { searchParams } = new URL(req.url);
	const startDate = searchParams.get('startDate'); // Получение начальной даты из параметров
	const endDate = searchParams.get('endDate'); // Получение конечной даты из параметров
	const today = searchParams.get('today') === 'true'; // Флаг для получения записей за текущие сутки

	try {
		let query = {};

		// Если указаны startDate и endDate
		if (startDate && endDate) {
			query = {
				createdAt: {
					$gte: new Date(startDate), // Дата больше или равна startDate
					$lte: new Date(endDate), // Дата меньше или равна endDate
				},
			};
		}

		// Если флаг onlyToday установлен
		if (today) {
			const startOfDay = new Date();
			startOfDay.setHours(0, 0, 0, 0); // Начало текущего дня
			const endOfDay = new Date();
			endOfDay.setHours(23, 59, 59, 999); // Конец текущего дня

			query = {
				createdAt: {
					$gte: startOfDay,
					$lte: endOfDay,
				},
			};
		}

		const stats = await MathStatistics.find(query);
		return NextResponse.json(stats);
	} catch (error) {
		console.error('Ошибка при получении статистики:', error);
		return NextResponse.json(
			{ error: 'Ошибка при получении данных' },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	await connectDB();
	const body = await req.json();

	try {
		const newStat = new MathStatistics(body);
		await newStat.save();
		return NextResponse.json(newStat, { status: 201 });
	} catch (error) {
		console.error('Ошибка при сохранении статистики:', error);
		return NextResponse.json(
			{ error: 'Ошибка при сохранении данных' },
			{ status: 500 }
		);
	}
}
