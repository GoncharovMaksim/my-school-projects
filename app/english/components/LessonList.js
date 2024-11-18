function LessonList({ data }) {
	if (!data) {
		return 'Loading...';
	}
	return (
		<div className='lesson-list'>
			<table>
				<thead>
					<tr>
						<th>English Word</th>
						<th>Transcription (Ru)</th>
						<th>Translation</th>
						<th>Audio</th>
					</tr>
				</thead>
				<tbody>
					{data.map((el, index) => (
						<tr key={index} className='lesson-item'>
							<td>{el.englishWord}</td>
							<td>{el.transcriptionRu}</td>
							<td>{el.translation}</td>
							<td>
								<button
									className='play-button'
									onClick={() => new Audio(`${el.englishAudio}`).play()}
								>
									▶
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default LessonList;
