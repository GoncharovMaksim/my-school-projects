'use client';
import { useEffect, useState } from 'react';
import checkUserAnswer from './checkUserAnswer';
import styles from './page.module.css';
import getQuestions from './getQuestions';

interface UserAnswer {
  questionId: string;
  selected: string[];
}
interface CheckUserAnswer {
  questionId: string;
  isCorrect: boolean;
}

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

export default function Test({
  userCheckOptions,
  setStartTest,
}: {
  userCheckOptions: string;
  setStartTest: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [userAnswer, setUserAnswer] = useState<UserAnswer[]>([]);
  const [testIsCompleted, setTestIsCompleted] = useState(false);
  const [resultTestIsCompleted, setResultTestIsCompleted] = useState(false);
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [isLoading, setisLoading] = useState(true);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);

  useEffect(() => {
    function shuffleArray<T>(array: T[]): T[] {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
    // console.log('!!!!!!!!userCheckOptions', userCheckOptions);
    getQuestions(userCheckOptions).then(response => {
      const randomQuestions: MathQuestion[] = shuffleArray(response);
      randomQuestions.forEach(question => {
        question.options = shuffleArray(question.options);
      });

      setQuestions(randomQuestions.slice(0, 10));
      setisLoading(false);
    });
  }, [userCheckOptions]);

  const handleAnswerChange = (
    questionId: string,
    optionId: string,
    isChecked: boolean,
    type: 'single' | 'multiple'
  ) => {
    setUserAnswer(prev => {
      const existing = prev.find(ans => ans.questionId === questionId);

      if (type === 'single') {
        return [
          ...prev.filter(ans => ans.questionId !== questionId),
          { questionId, selected: [optionId] },
        ];
      } else {
        let newSelected = existing ? [...existing.selected] : [];

        if (isChecked) {
          if (!newSelected.includes(optionId)) newSelected.push(optionId);
        } else {
          newSelected = newSelected.filter(id => id !== optionId);
        }

        return [
          ...prev.filter(ans => ans.questionId !== questionId),
          { questionId, selected: newSelected },
        ];
      }
    });
  };

  const handleUserAnswerCheck = async () => {
    const { result }: { result: CheckUserAnswer[] } = await checkUserAnswer(
      userAnswer
    );

    const allCorrect =
      result.length === questions.length &&
      result.every((answer: CheckUserAnswer) => answer.isCorrect);
    setCorrectAnswerCount(result.filter(answer => answer.isCorrect).length);

    setResultTestIsCompleted(allCorrect);
    setTestIsCompleted(true);
  };

  const handleClearResultTest = () => {
    setTestIsCompleted(false);
    setUserAnswer([]);
    setResultTestIsCompleted(false);
    setStartTest(false);
  };

  if (testIsCompleted) {
    return (
      <div className={styles.page}>
        <h1>Тест {resultTestIsCompleted ? 'пройден' : 'не пройден'}</h1>
        <h3>
          Результат: правильных ответов {correctAnswerCount} из{' '}
          {questions.length}.
        </h3>
        <button
          onClick={handleClearResultTest}
          className="btn btn-outline w-full max-w-xs"
        >
          Назад
        </button>
      </div>
    );
  }
  if (isLoading) {
    return <div className={styles.page}>Загрузка...</div>;
  }
  if (questions.length === 0) {
    return <div className={styles.page}>Нет доступных вопросов.</div>;
  }

  return (
    <div className="container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center ">
      <div className="my-8 flex flex-col items-center space-y-6">
        <h1 className="text-4xl text-center font-bold mb-4 ">
          {questions[0].topic}
        </h1>

        <main className={styles.main}>
          {questions.map((question, index) => (
            <div key={question._id}>
              <h3 className={styles.questionTitle}>Вопрос №{index + 1}</h3>
              <p>{question.questionText}</p>
              <ul className={styles.optionsList}>
                {question.options.map(option => (
                  <li key={`${question._id}-${option.id}`}>
                    <label htmlFor={`${question._id}-${option.id}`}>
                      <input
                        type={question.type === 'single' ? 'radio' : 'checkbox'}
                        id={`${question._id}-${option.id}`}
                        name={`question-${question._id}`}
                        onChange={e =>
                          handleAnswerChange(
                            question._id,
                            option.id,
                            e.target.checked,
                            question.type as 'single' | 'multiple'
                          )
                        }
                      />
                      <span>{option.text}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button
            className="btn btn-outline w-full max-w-xs"
            onClick={handleUserAnswerCheck}
          >
            Проверить
          </button>
        </main>
      </div>
    </div>
  );
}
