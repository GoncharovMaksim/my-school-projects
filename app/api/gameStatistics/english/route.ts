// pages/api/MathStatistics/route.ts

import { NextResponse } from 'next/server';
import connectDB from '@/configs/connectDB';
import EnglishStatistics from '@/models/EnglishStatistics';

export async function GET() {
	await connectDB();
	const stats = await EnglishStatistics.find();
	return NextResponse.json(stats);
}

export async function POST(req: Request) {
	await connectDB();
	const body = await req.json();
	const newStat = new EnglishStatistics(body);
	await newStat.save();
	return NextResponse.json(newStat, { status: 201 });
}
