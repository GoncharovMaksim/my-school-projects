'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import { ru } from 'date-fns/locale';

// Регистрируем локализацию
registerLocale('ru', ru);

const App = () => {
	const [startDate, setStartDate] = useState<Date | undefined>(new Date()); // startDate теперь может быть Date или undefined
	const [endDate, setEndDate] = useState<Date | undefined>(new Date()); // endDate теперь может быть Date или undefined
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	const handleConfirm = () => {
		setIsCalendarOpen(false); // Скрываем календарь
		if (startDate && endDate) {
			console.log('Выбранный диапазон:', startDate, endDate);
		} else {
			console.log('Диапазон дат не выбран');
		}
	};

	return (
		<div className='datepicker-container'>
			<h2>Выберите диапазон дат:</h2>

			{/* Поле для открытия календаря */}
			<input
				type='text'
				value={
					startDate && endDate
						? `${startDate.toLocaleDateString(
								'ru-RU'
						  )} - ${endDate.toLocaleDateString('ru-RU')}`
						: ''
				}
				onClick={() => setIsCalendarOpen(true)} // Показываем календарь
				readOnly
				className='border px-4 py-2 rounded w-full cursor-pointer'
				placeholder='Выберите диапазон дат'
			/>

			{/* Календарь, который отображается только при открытии */}
			{isCalendarOpen && (
				<DatePicker
					selected={startDate}
					onChange={(dates: [Date | null, Date | null]) => {
						const [start, end] = dates;
						setStartDate(start || undefined); // Преобразуем в undefined, если start == null
						setEndDate(end || undefined); // Преобразуем в undefined, если end == null
					}}
					startDate={startDate}
					endDate={endDate}
					selectsRange
					locale='ru' // Устанавливаем локализацию
					inline
					shouldCloseOnSelect={false} // Не закрываем календарь при выборе дат
				>
					<div className='footer'>
						<button
							onClick={handleConfirm}
							className='w-full bg-gray-500 text-white px-4 py-2 rounded mt-2 hover:bg-gray-600 flex justify-center items-center'
						>
							Подтвердить выбор
						</button>
					</div>
				</DatePicker>
			)}
		</div>
	);
};

export default App;
