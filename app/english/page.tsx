import { Word } from '@/types/word';
import fetchWords from './components/api';

export default async function App() {
	// Получение данных на сервере
	let wordsList: Word[] = [];
	let error = false;
	try {
		wordsList = await fetchWords();
	} catch (err) {
		console.error('Ошибка загрузки слов:', err);
		error = true;
	}

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<div className='p-2 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4'>Английский</h1>

				<div className='w-full'>
					{/* Таблица для больших экранов */}
					<div className='hidden sm:block'>
						<table className='table-auto text-4xl w-auto mx-auto border-collapse '>
							<thead className='border-b'>
								<tr>
									<th className='px-4 py-2 text-left'>Слово</th>
									<th className='px-4 py-2 text-left'>Транскрипция</th>
									<th className='px-4 py-2 text-left'>Перевод</th>
									<th className='px-4 py-2 text-left'>Аудио</th>
								</tr>
							</thead>
							<tbody>
								{wordsList.length > 0 ? (
									wordsList.map((el, index) => (
										<tr key={index} className='border-b'>
											<td className='px-4 py-2 text-left'>{el.englishWord}</td>
											<td className='px-4 py-2 text-left'>
												{el.transcriptionRu}
											</td>
											<td className='px-4 py-2 text-left'>{el.translation}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={3} className='text-center py-4'>
											Слова не найдены.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					{/* Карточки для мобильных устройств */}
					<div className='sm:hidden flex flex-col space-y-4 w-full '>
						{error ? (
							<div className='text-center py-4 text-red-500'>
								Ошибка загрузки слов.
							</div>
						) : wordsList.length > 0 ? (
							wordsList.map((el, index) => (
								<div
									key={index}
									className='border p-1 rounded-lg grid grid-cols-2 gap-4 place-content-center bg-gray-200 shadow-md w-full items-center'
								>
									<div className='text-3xl font-bold break-words overflow-hidden text-ellipsis'>
										{el.englishWord}
									</div>
									<div className='text-3xl text-gray-600 break-words overflow-hidden text-ellipsis'>
										{el.translation}
									</div>
									<div className='text-1xl text-gray-700 break-words overflow-hidden text-ellipsis'>
										{el.transcriptionRu}
									</div>
								</div>
							))
						) : (
							<div className='text-center py-4'>Слова не найдены.</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
