// pages/api/MathStatistics/route.ts

import { NextResponse } from 'next/server';
import connectDB from '@/configs/connectDB';
import MathStatistics from '@/models/MathStatistics';

export async function GET() {
	await connectDB();
	const stats = await MathStatistics.find();
	return NextResponse.json(stats);
}

export async function POST(req: Request) {
	await connectDB();
	const body = await req.json();
	const newStat = new MathStatistics(body);
	await newStat.save();
	return NextResponse.json(newStat, { status: 201 });
}
