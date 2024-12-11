
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

				<div className='overflow-x-auto'>
					<table className='table table-xs'>
						<thead>
							<tr>
								<th></th>
								<th>Слово</th>
								<th>Транскрипция</th>
								<th>Перевод</th>
								{/* <th>Аудио</th> */}
							</tr>
						</thead>
						<tbody>
							{wordsList.length > 0 ? (
								wordsList.map((el, index) => (
									<tr key={index}>
										<th></th>
										<td>{el.englishWord}</td>
										<td>{el.transcriptionRu}</td>
										<td>{el.translation}</td>
										{/* <td>
											{el.englishAudio ? (
												<audio >
													<source src={el.englishAudio} type='audio/mpeg' />
													Ваш браузер не поддерживает воспроизведение аудио.
												</audio>
											) : (
												'Нет аудио'
											)}
										</td> */}
									</tr>
								))
							) : (
								<tr>
									<td colSpan={5} className='text-center'>
										Слова не найдены.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
//