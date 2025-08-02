import { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css'; // Стили для Flatpickr
import { Russian } from 'flatpickr/dist/l10n/ru';

export default function DatePicker() {
	// Типизация для состояния выбранной даты
const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // Без значения по умолчанию для SSR

// Устанавливаем дату только на клиенте
useEffect(() => {
  setSelectedDate(new Date());
}, []);

	return (
		<div className='w-full max-w-xs mx-auto'>
<Flatpickr
  value={selectedDate}
  onChange={(date: Date[]) => setSelectedDate(date[0])}
  options={{
	locale: Russian,
	dateFormat: 'd.m.Y',
	// defaultDate убран для предотвращения гидратации
  }}
  className='w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300'
/>
		</div>
	);
}
