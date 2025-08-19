import MathQuestions from '@/models/MathQuestion';

interface MathQuestion {
  _id: string;
  schoolClass: number;
  part: number;
  topic: string;
  partition: string;
  page: number;
  questionNumber: number;
  questionText: string;
  type: 'single' | 'multiple';
  options: {
    id: 'a' | 'b' | 'c' | 'd' | 'e';
    text: string;
  }[];

  correctOptions: string[];
}

export async function GET(request: Request) {
  const questions = await MathQuestions.find().lean();
  //console.log('!!!questions',questions);
  const { searchParams } = new URL(request.url);
  const optionsListParam = searchParams.get('optionsList');
  const topicFilter = searchParams.get('topic');
  const partFilter = searchParams.get('part');

  if (optionsListParam !== null) {
    const optionsList = [];
    const topicList = [...new Set(questions.map(q => q.topic))];

    for (const option of topicList) {
      const tempQuestions = questions.filter(q => q.topic === option);
      const tempOptionsList = [...new Set(tempQuestions.map(q => q.part))];
      optionsList.push({ topic: option, part: tempOptionsList });
    }

    return Response.json(optionsList);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let result = questions.map(({ correctOptions, ...question }) => question);
  //console.log('result', result);
  if (topicFilter !== null) {
    result = result.filter(q => q.topic === topicFilter);
  }

  if (partFilter !== null) {
    result = result.filter(q => q.part === Number(partFilter));
  }
  console.log(result);
  return Response.json(result);
}

interface UserAnswer {
  questionId: string;
  selected: string[];
}

export async function POST(req: Request) {
  try {
    const questions =
      (await MathQuestions.find().lean()) as unknown as MathQuestion[];
    const userAnswers: UserAnswer[] = await req.json();

    const result = userAnswers.map(answer => {
      console.log('answer.questionId', answer.questionId);
      console.log('questions', questions);
      const correct = questions.find(
        q => q._id.toString() === answer.questionId
      );
      if (!correct) {
        return { questionId: answer.questionId, isCorrect: false };
      }

      const isCorrect = arraysEqual(answer.selected, correct.correctOptions);

      return { questionId: answer.questionId, isCorrect };
    });

    return Response.json({ result });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

function arraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
}
