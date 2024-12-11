
import { Word } from '@/types/word';
import fetchWords from './components/api';



export default async function App() {
	// Получение данных на сервере
	let wordsList: Word[] = [];
	try {
		wordsList = await fetchWords();
	} catch (err) {
		console.error('Ошибка загрузки слов:', err);
	}

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<div className='p-8 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4'>Английский</h1>

				<div className='w-full'>
					<table className='hidden sm:table table-auto text-sm sm:text-base w-full border-collapse'>
						<thead className='border-b'>
							<tr>
								<th className='px-4 py-2 text-left min-w-[100px]'>Слово</th>
								<th className='px-4 py-2 text-left min-w-[120px]'>
									Транскрипция
								</th>
								<th className='px-4 py-2 text-left min-w-[100px]'>Перевод</th>
							</tr>
						</thead>
						<tbody>
							{wordsList.length > 0 ? (
								wordsList.map((el, index) => (
									<tr key={index} className='border-b'>
										<td className='px-4 py-2'>{el.englishWord}</td>
										<td className='px-4 py-2'>{el.transcriptionRu}</td>
										<td className='px-4 py-2'>{el.translation}</td>
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

					{/* Адаптация для мобильных устройств */}
					<div className='sm:hidden flex flex-col space-y-4'>
						{wordsList.length > 0 ? (
							wordsList.map((el, index) => (
								<div
									key={index}
									className='border p-4 rounded-lg flex flex-col space-y-2 bg-gray-200 shadow-md text-4xl'
								>
									<div>{el.englishWord}</div>
									<div>{el.transcriptionRu}</div>
									<div>{el.translation}</div>
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
////