'use client';

import { useEffect, useState } from 'react';
import { Word } from '@/types/word';
import fetchWords from './components/api';
import LoadingBars from '@/components/LoadingBars';
import DropdownMenu from '@/components/DropdownMenu';
import { useSpeaker } from './useSpeaker';

export default function App() {
	const [error, setError] = useState(false);
	const [wordsList, setWordsList] = useState<Word[]>([]);
	const [filterWordsList, setFilterWordsList] = useState<Word[]>([]);
	const [schoolClass, setSchoolClass] = useState<number | ''>('');
	const [lessonUnit, setLessonUnit] = useState<number | ''>(''); // Выбранный урок
	const [unitStep, setUnitStep] = useState<number | ''>(''); // Выбранный шаг
	const [listLessonUnit, setListLessonUnit] = useState<number[]>([]); // Список уроков
	const [listUnitStep, setListUnitStep] = useState<number[]>([]); // Список шагов
	const { speak } = useSpeaker();

	useEffect(() => {
		const storedSchoolClass = localStorage.getItem('schoolClass');
		if (storedSchoolClass) {
			setSchoolClass(JSON.parse(storedSchoolClass));
		}

		const storedLessonUnit = localStorage.getItem('lessonUnit');
		if (storedLessonUnit) {
			setLessonUnit(JSON.parse(storedLessonUnit));
		}

		const storedUnitStep = localStorage.getItem('unitStep');
		if (storedUnitStep) {
			setUnitStep(JSON.parse(storedUnitStep));
		}
	}, []);

	useEffect(() => {
		async function getWords() {
			try {
				const words = await fetchWords();
				setWordsList(words);
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
			if (schoolClass) {
				tempFilter = tempFilter.filter(el => el.schoolClass === schoolClass);
				const uniqTempListLessonUnit = [
					...new Set(tempFilter.map(el => el.lessonUnit)),
				];
				setListLessonUnit(uniqTempListLessonUnit);
				localStorage.setItem('schoolClass', JSON.stringify(schoolClass));
			} else {
				setListLessonUnit([]);
			}

			if (lessonUnit) {
				tempFilter = tempFilter.filter(el => el.lessonUnit === lessonUnit);
				const uniqTempListUnitStep = [
					...new Set(tempFilter.map(el => el.unitStep)),
				];
				setListUnitStep(uniqTempListUnitStep);
				localStorage.setItem('lessonUnit', JSON.stringify(lessonUnit));
			} else {
				setListUnitStep([]);
			}

			if (unitStep) {
				tempFilter = tempFilter.filter(el => el.unitStep === unitStep);
				localStorage.setItem('unitStep', JSON.stringify(unitStep));
			}

			setFilterWordsList(tempFilter);
		};

		handleFilterChange();
	}, [wordsList, schoolClass, lessonUnit, unitStep]);

	// useEffect(() => {
	// 	setLessonUnit('');
	// 	setUnitStep('');
	// }, [schoolClass]);

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<div className='p-2 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4'>Английский</h1>
				<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-full'>
					<div className='collapse collapse-arrow bg-base-200 overflow-visible'>
						<input type='checkbox' name='my-accordion-2' />
						<div className='collapse-title text-xl font-bold text-center '>
							Параметры:
						</div>
						<div className='collapse-content flex flex-col items-center text-xl space-y-2 min-w-0 '>
							<DropdownMenu
								defaultLabel='Выбор класса'
								options={[
									{
										label: 'Класс: 2',
										onClick: () => {
											return (
												setSchoolClass(2), setLessonUnit(''), setUnitStep('')
											);
										},
									},
									{
										label: 'Класс: 3',
										onClick: () => {
											return (
												setSchoolClass(3), setLessonUnit(''), setUnitStep('')
											);
										},
									},
									{
										label: 'Все классы',
										onClick: () => {
											return (
												setSchoolClass(''), setLessonUnit(''), setUnitStep('')
											);
										},
									},
								]}
							/>
							<DropdownMenu
								key={`lessonUnit-${schoolClass}`}
								defaultLabel='Выбор урока'
								options={[
									{ label: 'Все уроки', onClick: () => setLessonUnit('') },
									...listLessonUnit.map((el: number) => ({
										label: `Выбран урок: ${el}`,
										onClick: () => {
											return setLessonUnit(el), setUnitStep('');
										},
									})),
								]}
							/>
							<DropdownMenu
								key={`unitStep-${lessonUnit}`}
								defaultLabel='Выбор шага'
								options={[
									{ label: 'Все шаги', onClick: () => setUnitStep('') },
									...listUnitStep.map((el: number) => ({
										label: `Выбран шаг: ${el}`,
										onClick: () => setUnitStep(el),
									})),
								]}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className='w-full'>
				<div className='flex flex-col space-y-4 w-full'>
					{error ? (
						<div className='text-center py-4 text-red-500'>
							Ошибка загрузки слов.
						</div>
					) : wordsList.length > 0 ? (
						filterWordsList.map((el, index) => (
							<div
								key={`${el.englishWord}-${index}`}
								className='border p-4 rounded-lg grid grid-cols-2 gap-4 place-content-center bg-gray-200 shadow-md w-full h-full'
							>
								<div className='text-2xl font-bold break-words overflow-hidden text-ellipsis'>
									{el.englishWord}
								</div>
								<div className='text-2xl text-gray-600 break-words overflow-hidden text-ellipsis'>
									{el.translation}
								</div>
								<div className='flex items-end text-2xl text-gray-400 break-words overflow-hidden text-ellipsis h-12'>
									{el.transcriptionRu}
								</div>
								<div className='flex items-end'>
									<button
										className='btn btn-outline text-lg text-gray-400 w-24 h-8 flex items-center justify-center p-0 min-h-0'
										onClick={() => speak(el.englishWord, 'en-US')}
									>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-6 w-6'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
												d='M6 4l12 8-12 8V4z'
											/>
										</svg>
									</button>
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
