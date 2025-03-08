'use client';

import { evaluate } from 'mathjs';
import { useRef, useState } from 'react';

export default function App() {
	const [userQuestion, setUserQuestion] = useState('');
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [bgNoUserQuestion, setBgNoUserQuestion] = useState(false);
	const [arrQuestions, setArrQuestions] = useState<string[]>([]);

	function userQuestionCheck() {
		if (inputRef.current) {
			inputRef.current.focus();
		}
		if (!userQuestion) {
			setBgNoUserQuestion(true);
			return;
		}
		try {
			const result = evaluate(userQuestion);
			setArrQuestions(prev => [`${userQuestion} = ${result}`, ...prev]);
			setUserQuestion('');
		} catch (error) {
			console.error('Ошибка вычисления:', error);
		}
	}

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
			<div className='my-8 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4 '>Калькулятор</h1>

				<input
					ref={inputRef}
					type='text'
					placeholder='Ваш пример'
					className={
						bgNoUserQuestion
							? 'input input-bordered w-full max-w-xs text-3xl bg-red-500'
							: 'input input-bordered w-full max-w-xs text-3xl'
					}
					value={userQuestion}
					onChange={event => setUserQuestion(event.target.value)}
					onKeyDown={event => {
						if (event.key === 'Enter') {
							userQuestionCheck();
						}
					}}
				/>
				<button
					className='btn btn-outline w-full max-w-xs'
					onClick={userQuestionCheck}
				>
					Решить
				</button>

				{arrQuestions.map((el, index) => (
					<div key={`${el}+${index}`} className='text-5xl w-full max-w-xs'>
						{el}
					</div>
				))}
			</div>
		</div>
	);
}
