'use client';

import { useEffect, useState } from 'react';
import { Word } from '@/types/word';
import fetchWords from '../components/api';

import DropdownMenu from '@/components/DropdownMenu';
import { useSpeaker } from '../useSpeaker';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { setWordsList, setError } from '@/lib/features/wordsSlice';
import { RootState } from '@/lib/store';
import Loading from '../loading';

export default function App() {
	const dispatch = useDispatch();
	const wordsList = useSelector((state: RootState) => state.words.wordsList);
	const error = useSelector((state: RootState) => state.words.error);

	const [isLoading, setIsLoading] = useState(true);
	const [filterWordsList, setFilterWordsList] = useState<Word[]>([]);
	const [schoolClass, setSchoolClass] = useState<number | ''>('');
	const [lessonUnit, setLessonUnit] = useState<number | ''>('');
	const [unitStep, setUnitStep] = useState<number | ''>('');
	const [listLessonUnit, setListLessonUnit] = useState<number[]>([]);
	const [listUnitStep, setListUnitStep] = useState<number[]>([]);

	const { speak } = useSpeaker();

	useEffect(() => {
		async function getWords() {
			if (wordsList.length > 0) {
				return; // Если данные уже есть, не делаем запрос
			}
			try {
				setIsLoading(true);
				const words = await fetchWords();
				dispatch(setWordsList(words));
			} catch (err) {
				console.error('Ошибка загрузки слов:', err);
				dispatch(setError(true));
			} finally {
				setIsLoading(false);
			}
		}

		getWords();
	}, [dispatch, wordsList.length]);

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
				localStorage.setItem('lessonUnit', JSON.stringify(''));
				localStorage.setItem('unitStep', JSON.stringify(''));
			} else {
				localStorage.setItem('schoolClass', JSON.stringify(''));
				localStorage.setItem('lessonUnit', JSON.stringify(''));
				localStorage.setItem('unitStep', JSON.stringify(''));
				setListLessonUnit([]);
			}

			if (lessonUnit) {
				tempFilter = tempFilter.filter(el => el.lessonUnit === lessonUnit);
				const uniqTempListUnitStep = [
					...new Set(tempFilter.map(el => el.unitStep)),
				];
				setListUnitStep(uniqTempListUnitStep);
				localStorage.setItem('lessonUnit', JSON.stringify(lessonUnit));
				localStorage.setItem('unitStep', JSON.stringify(''));
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
	useEffect(() => {
		if (filterWordsList.length > 0) {
			return setIsLoading(false);
		}
	}, [filterWordsList]);
	if (isLoading) {
		return <Loading />;
	}

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
						<div className='flex justify-center items-center'>
							<Link href='/english/examination'>
								<button className='btn btn-outline min-w-[200px]'>
									ПРОЙТИ ТЕСТ
								</button>
							</Link>
						</div>
						<div className='collapse-content flex flex-col items-center text-xl space-y-2 min-w-0 '>
							<DropdownMenu
								key={`schoolClass-${schoolClass}`}
								defaultLabel={
									schoolClass !== ''
										? `Выбран класс ${schoolClass.toString()}`
										: 'Выбрать класс'
								}
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
								defaultLabel={
									lessonUnit !== ''
										? `Выбран урок: ${lessonUnit.toString()}`
										: 'Выбрать урок'
								}
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
								defaultLabel={
									unitStep !== ''
										? `Выбран шаг: ${unitStep.toString()}`
										: 'Выбрать шаг'
								}
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
					) : (
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
					)}
				</div>
			</div>
		</div>
	);
}
//
