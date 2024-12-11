'use client';

import { useEffect, useState } from 'react';
import { Word } from '@/types/word'; // Предполагается, что интерфейс Word определен в этом файле
import fetchWords from '../englishClient/components/api';
import LoadingBars from '@/components/LoadingBars';

export default function App() {
	// Состояния для списка слов и ошибки
	const [wordsList, setWordsList] = useState<Word[]>([]);
	const [error, setError] = useState(false);

	useEffect(() => {
		async function getWords() {
			try {
				const words = await fetchWords();
				setWordsList(words);
			} catch (err) {
				console.error('Ошибка загрузки слов:', err);
				setError(true);
			}
		}

		getWords();
	}, []);

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<div className='p-2 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4'>Английский</h1>

				<div className='w-full'>
					{/* Карточки для мобильных устройств */}
					<div className='flex flex-col space-y-4 w-full'>
						{error ? (
							<div className='text-center py-4 text-red-500'>
								Ошибка загрузки слов.
							</div>
						) : wordsList.length > 0 ? (
							wordsList.map((el, index) => (
								<div
									key={index}
									className='border p-4 rounded-lg grid grid-cols-2 gap-4 place-content-center bg-gray-200 shadow-md w-full items-start'
								>
									<div className='text-2xl font-bold break-words overflow-hidden text-ellipsis'>
										{el.englishWord}
									</div>
									<div className='text-2xl text-gray-600 break-words overflow-hidden text-ellipsis'>
										{el.translation}
									</div>
									<div className='text-lg text-gray-400 break-words overflow-hidden text-ellipsis'>
										{el.transcriptionRu}
									</div>
								</div>
							))
						) : (
							<>
								<h3 className='text-2xl text-center font-bold mb-4'>
									Загрузка данных...
								</h3>
								<LoadingBars />
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
