'use client';

import { evaluate } from 'mathjs';
import { useRef, useState } from 'react';

export default function App() {
	//const [answer, setAnswer] = useState('');
	const [userQwestion, setUserQwestion] = useState('');
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [bgNoUserQwestion, setBgNoUserQwestion] = useState(false);
	const [arrQwestions, setArrQwestions] = useState<string[]>([]);

	function userQwestionCheck() {
		if (inputRef.current) {
			inputRef.current.focus();
		}
		if (!userQwestion) {
			setBgNoUserQwestion(true);
			return;
		}
		try {
			const result = evaluate(userQwestion);
			if (result) {
				setArrQwestions(prev => [...prev, `${userQwestion} = ${result}`]);
				console.log(arrQwestions);
				return setUserQwestion('');
			}
			return new Error();
		} catch (error) {
			return error;
		}
	}

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
			<div className='my-8 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4 '>Калькулятор</h1>

				<>
					
					<input
						ref={inputRef}
						type='text'
						placeholder='Ваш пример'
						className={
							bgNoUserQwestion
								? 'input input-bordered w-full max-w-xs text-3xl bg-red-500'
								: 'input input-bordered w-full max-w-xs text-3xl'
						}
						value={userQwestion}
						onChange={event => setUserQwestion(event.target.value)}
						onKeyDown={event => {
							if (event.key === 'Enter') {
								userQwestionCheck();
							}
						}}
					/>
					<button
						className='btn btn-outline w-full max-w-xs'
						onClick={() => {
							userQwestionCheck();
						}}
					>
						Решить
					</button>
				</>
				{arrQwestions.map((el,index) => {
					return (
						<div key={`${el}+${index}`} className='text-5xl '>
							{el}
						</div>
					);
				})}
			</div>
		</div>
	);
}
