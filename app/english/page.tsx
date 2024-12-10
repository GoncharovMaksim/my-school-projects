import fetchWords from './components/api';

interface Word {
	id: string; // или number, если id числовой
	englishWord: string;
	transcriptionRu: string;
	translation: string;
	audio?: string; // Если используется аудио
}

export default async function App() {
	// Указываем тип возвращаемых данных
	const wordsList: Word[] = await fetchWords();

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
			<div className='p-8 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4'>Английский</h1>

				<div className='overflow-x-auto'>
					<table className='table table-xs '>
						{/* head */}
						<thead>
							<tr>
								<th></th>
								<th>Слово</th>
								<th>Транскрипция</th>
								<th>Перевод</th>
								<th>Аудио</th>
							</tr>
						</thead>
						<tbody>
							{/* row 1 */}
							{wordsList.map((el: Word) => {
								return (
									<tr key={el.id}>
										<th></th>
										<td>{el.englishWord}</td>
										<td>{el.transcriptionRu}</td>
										<td>{el.translation}</td>
										<td>
											{/* Если аудио есть, добавляем ссылку */}
											{el.audio ? (
												<audio controls>
													<source src={el.audio} type='audio/mpeg' />
													Ваш браузер не поддерживает воспроизведение аудио.
												</audio>
											) : (
												'Нет аудио'
											)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
