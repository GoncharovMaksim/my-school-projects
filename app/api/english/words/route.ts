import { NextResponse } from 'next/server';
import connectDB from '@/configs/connectDB';
import Words from '@/models/Words';

export async function GET() {
	await connectDB();
	const words = await Words.find();
	return NextResponse.json(words);
}
