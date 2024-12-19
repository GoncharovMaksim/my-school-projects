'use client';

import { useEffect, useState } from 'react';
import { Word } from '@/types/word';
import fetchWords from '../components/api';

import DropdownMenu from '@/components/DropdownMenu';
import { useSpeaker } from '../useSpeaker';
import { useDispatch, useSelector } from 'react-redux';
import { setWordsList, setError } from '@/lib/features/wordsSlice';
import { RootState } from '@/lib/store';
import Loading from '../loading';
import { GameProps } from './types';

export default function Settings({ setGameSettings }: GameProps) {
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
	const [difficultyLevel, setDifficultyLevel] = useState<number>(1);

	const { speak } = useSpeaker();
	useEffect(() => {
		const storedSchoolClass = localStorage.getItem('schoolClass');
		const storedLessonUnit = localStorage.getItem('lessonUnit');
		const storedUnitStep = localStorage.getItem('unitStep');
		const storedDifficultyLevel = localStorage.getItem('difficultyLevel');

		if (storedSchoolClass) setSchoolClass(JSON.parse(storedSchoolClass));
		if (storedLessonUnit) setLessonUnit(JSON.parse(storedLessonUnit));
		if (storedUnitStep) setUnitStep(JSON.parse(storedUnitStep));
		if (storedDifficultyLevel)
			setDifficultyLevel(JSON.parse(storedDifficultyLevel));
	}, []);

	useEffect(() => {
		async function getWords() {
			if (wordsList.length > 0) {
				return;
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
				// localStorage.setItem('schoolClass', JSON.stringify(''));
				// localStorage.setItem('lessonUnit', JSON.stringify(''));
				// localStorage.setItem('unitStep', JSON.stringify(''));
				//setListLessonUnit([]);
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
		localStorage.setItem('difficultyLevel', JSON.stringify(difficultyLevel));
		handleFilterChange();
	}, [wordsList, schoolClass, lessonUnit, unitStep, difficultyLevel]);

	const handleStartGame = () => {
		const wordCount = Array.isArray(filterWordsList)
			? filterWordsList.length
			: 0;

		setGameSettings(prevSettings => ({
			...prevSettings,
			difficultyLevel,
			schoolClass,
			lessonUnit,
			unitStep,
			limGame: wordCount < 5 ? wordCount : prevSettings.limGame,
			examWordsList: filterWordsList,
			gameStatus: true,
		}));
	};

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
				<div className='collapse collapse-arrow bg-base-200 overflow-visible'>
					<input type='checkbox' name='my-accordion-2' />
					<div className='collapse-title text-xl font-bold text-center '>
						Параметры:
					</div>
					<div className='flex justify-center items-center'>
						<button
							className='btn btn-outline min-w-[200px] '
							onClick={handleStartGame}
						>
							ПРОЙТИ ТЕСТ
						</button>
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
											localStorage.setItem('schoolClass', JSON.stringify('')),
											localStorage.setItem('lessonUnit', JSON.stringify('')),
											localStorage.setItem('unitStep', JSON.stringify('')),
											setSchoolClass(''),
											setLessonUnit(''),
											setUnitStep('')
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
								{
									label: 'Все уроки',
									onClick: () => {
										return (
											localStorage.setItem('lessonUnit', JSON.stringify('')),
											localStorage.setItem('unitStep', JSON.stringify('')),
											setLessonUnit(''),
											setUnitStep('')
										);
									},
								},
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
								{
									label: 'Все шаги',
									onClick: () => {
										return (
											localStorage.setItem('unitStep', JSON.stringify('')),
											setUnitStep('')
										);
									},
								},
								...listUnitStep.map((el: number) => ({
									label: `Выбран шаг: ${el}`,
									onClick: () => setUnitStep(el),
								})),
							]}
						/>
						<DropdownMenu
							defaultLabel={`Уровень ${difficultyLevel}`}
							options={[
								{
									label: 'Уровень 1',
									onClick: () => setDifficultyLevel(1),
								},
								{
									label: 'Уровень 2',
									onClick: () => setDifficultyLevel(2),
								},
								{
									label: 'Уровень 3',
									onClick: () => setDifficultyLevel(3),
								},
							]}
						/>
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
