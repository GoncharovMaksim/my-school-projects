'use client';

import { useEffect, useState } from 'react';
import { Word } from '@/types/word'; // Предполагается, что интерфейс Word определен в этом файле
import fetchWords from '../englishClient/components/api';
import LoadingBars from '@/components/LoadingBars';
import DropdownMenu from '@/components/DropdownMenu';

export default function App() {
	const [error, setError] = useState(false);
	const [wordsList, setWordsList] = useState<Word[]>([]);
	const [filterWordsList, setFilterWordsList] = useState<Word[]>([]);
	const [schoolClass, setSchoolClass] = useState<number | ''>('');
	const [lessonUnit, setLessonUnit] = useState<number | ''>('');
	const [unitStep, setUnitStep] = useState<number | ''>(''); //

	useEffect(() => {
		async function getWords() {
			try {
				const words = await fetchWords();
				setWordsList(words);
				//setFilterWordsList(words);
			} catch (err) {
				console.error('Ошибка загрузки слов:', err);
				setError(true);
			}
		}

		getWords();
	}, []);


	useEffect(() => {
		const handleFilterChange = () => {
			let tempFilter = wordsList;
			if (schoolClass)
				tempFilter = tempFilter.filter(el => el.schoolClass === schoolClass);
			if (lessonUnit)
				tempFilter = tempFilter.filter(el => el.lessonUnit === lessonUnit);
			if (unitStep)
				tempFilter = tempFilter.filter(el => el.unitStep === unitStep);
			setFilterWordsList(tempFilter);
			console.log('tempFilter', tempFilter);
		};
		handleFilterChange();
	}, [wordsList, schoolClass, lessonUnit, unitStep]);

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<div className='p-2 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4'>Английский</h1>
				<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm'>
					<div className='collapse collapse-arrow bg-base-200 overflow-visible'>
						<input type='checkbox' name='my-accordion-2' />
						<div className='collapse-title text-xl font-bold text-center '>
							Параметры:
						</div>
						<div className='collapse-content flex flex-col items-center text-xl space-y-2'>
							{/* DropdownMenu для оператора */}
							<DropdownMenu
								defaultLabel='Выберите класс'
								options={[
									{
										label: 'Класс: 2',
										onClick: () => setSchoolClass(2),
									},
									{
										label: 'Класс: 3',
										onClick: () => setSchoolClass(3),
									},
									{
										label: 'Все классы',
										onClick: () => setSchoolClass(''),
									},
								]}
							/>

							{/* DropdownMenu для уровня сложности */}
							<DropdownMenu
								defaultLabel='Выберите урок'
								options={[
									{
										label: 'Урок: 1',
										onClick: () => setLessonUnit(1),
									},
									{
										label: 'Урок: 2',
										onClick: () => setLessonUnit(2),
									},
									{
										label: 'Урок: 3',
										onClick: () => setLessonUnit(3),
									},
									{
										label: 'Все уровни',
										onClick: () => setLessonUnit(''),
									},
								]}
							/>
							{/* DropdownMenu для уровня сложности */}
							<DropdownMenu
								defaultLabel='Выберите шаг'
								options={[
									{
										label: 'Шаг: 1',
										onClick: () => setUnitStep(1),
									},
									{
										label: 'Шаг: 2',
										onClick: () => setUnitStep(2),
									},
									{
										label: 'Шаг: 3',
										onClick: () => setUnitStep(3),
									},
									{
										label: 'Все шаги',
										onClick: () => setUnitStep(''),
									},
								]}
							/>
							{/* <button
								className='btn btn-outline w-full max-w-xs'
								onClick={handleFilterChange}
							>
								Применить
							</button> */}
						</div>
					</div>
				</div>
			</div>

			<div className='w-full'>
				{/* Карточки для мобильных устройств */}
				<div className='flex flex-col space-y-4 w-full'>
					{error ? (
						<div className='text-center py-4 text-red-500'>
							Ошибка загрузки слов.
						</div>
					) : wordsList.length > 0 ? (
						filterWordsList.map((el, index) => (
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
						<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center'>
							<h3 className='text-2xl text-center font-bold mb-4'>
								Загрузка данных...
							</h3>
							<LoadingBars />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
