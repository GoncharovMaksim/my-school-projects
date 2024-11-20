// src/app/page.js




import Script from 'next/script';
export default function Home() {
	return (
		<>
			<div className='container'>
				<h1>Математический опросник</h1>
				<div>
					<input type='text' name='user-name' placeholder='введите свое имя' />
				</div>
				<div className='timer'>
					<span className='min'>00</span>
					<span className='dot'>:</span>
					<span className='sec'>00</span>
				</div>

				<div className='settings'>
					<label>
						<h2>Выберите действие:</h2>
					</label>
					<select className='dropdown1'>
						<option value='*'>УМНОЖЕНИЕ</option>
						<option value='+'>СЛОЖЕНИЕ</option>
						<option value='-'>ВЫЧИТАНИЕ</option>
						<option value='/'>ДЕЛЕНИЕ</option>
					</select>

					<label>
						<h2>Сложность:</h2>
					</label>
					<select className='dropdown2'>
						<option value='1'>УРОВЕНЬ 1</option>
						<option value='2'>УРОВЕНЬ 2</option>
						<option value='3'>УРОВЕНЬ 3</option>
					</select>
				</div>

				<div className='question'></div>
				<div>
					<input type='number' name='answer' placeholder='ваш ответ' />
				</div>
				<div>
					<button className='btn-start'>НАЧАТЬ</button>
				</div>
				<div>
					<button className='btn-check'>ПРОДОЛЖИТЬ</button>
				</div>
				<div className='end-game'>
					<h2>Ваша оценка:</h2>
					<div className='big-number'></div>
				</div>
				<div className='output'></div>
			</div>
			<Script
				src='/app.js'
				type='module'
				strategy='beforeInteractive'
			/>
			<Script
				src='/tgApi.js'
				type='module'
				strategy='beforeInteractive'
			/>
		</>
	);
}
