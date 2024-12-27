import { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css'; // Стили для Flatpickr
import { Russian } from 'flatpickr/dist/l10n/ru';

export default function DatePicker() {
	// Типизация для состояния выбранной даты
	const [selectedDate, setSelectedDate] = useState<Date>(() => new Date()); // Текущая дата по умолчанию

	return (
		<div className='w-full max-w-xs mx-auto'>
			<Flatpickr
				value={selectedDate}
				onChange={(date: Date[]) => setSelectedDate(date[0])} // Установка первой выбранной даты
				options={{
					locale: Russian, // Установка русской локализации
					dateFormat: 'd.m.Y', // Формат даты без времени
					defaultDate: new Date(), // Текущая дата по умолчанию
				}}
				className='w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300'
			/>
		</div>
	);
}
