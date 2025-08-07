//import { questions } from '@/app/data/questions';
import Questions from '@/models/Questions';

export async function GET(request: Request) {
const questions = await Questions.find().lean();
	//console.log(questions);
	const { searchParams } = new URL(request.url);
	const optionsListParam = searchParams.get('optionsList');
	const topicFilter = searchParams.get('topic');
	const partFilter = searchParams.get('part');

	if (optionsListParam !== null) {
		const optionsList = [...new Set(questions.map(q => q.topic))];
		return Response.json(optionsList);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let result = questions.map(({ correctOptions, ...question }) => question);
console.log('result', result);
	if (topicFilter !== null) {
		result = result.filter(q => q.topic === topicFilter);
	}

	if (partFilter !== null) {
		result = result.filter(q => q.part === Number(partFilter));
	}
	console.log(result);
	return Response.json(result);
}
