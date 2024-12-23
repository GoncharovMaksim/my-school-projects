'use client';

import { useEffect, useState } from 'react';

import DropdownMenu from '@/components/DropdownMenu';

import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/lib/store';
import Loading from '../loading';

import { loadEnglishStatistics } from './loadEnglishStatistics';
import { useFilteredEnglishStatistics } from './useFilteredEnglishStatistics';
import { EnglishStat } from '@/types/englishStat';

export default function EnglishStatistics() {
	const dispatch = useDispatch<AppDispatch>();

	const error = useSelector((state: RootState) => state.words.error);

	const [filterAllUsersStatisticsList, setFilterAllUsersStatisticsList] =
		useState<EnglishStat[]>([]);
	const [schoolClass, setSchoolClass] = useState<number | ''>('');
	const [lessonUnit, setLessonUnit] = useState<number | ''>('');
	const [unitStep, setUnitStep] = useState<number | ''>('');
	const [listLessonUnit, setListLessonUnit] = useState<(number | '')[]>([]);
	const [listUnitStep, setListUnitStep] = useState<(number | '')[]>([]);
	const [difficultyLevel, setDifficultyLevel] = useState<number>(1);

	const allUsersStatisticsList = useSelector(
		(state: RootState) => state.englishStat.englishStatList
	);

	const currentUsersFilterStatisticsList = useFilteredEnglishStatistics(
		allUsersStatisticsList,
		{ difficultyLevel: 3 },
		true
	);

	useEffect(() => {
		if (allUsersStatisticsList.length === 0) {
			dispatch(loadEnglishStatistics());
		}
	}, [dispatch, allUsersStatisticsList.length]);

	useEffect(() => {
		const storedSchoolClass = localStorage.getItem('schoolClass');
		const storedLessonUnit = localStorage.getItem('lessonUnit');
		const storedUnitStep = localStorage.getItem('unitStep');
		const storedDifficultyLevel = localStorage.getItem(
			'difficultyLevelEnglish'
		);

		if (storedSchoolClass) setSchoolClass(JSON.parse(storedSchoolClass));
		if (storedLessonUnit) setLessonUnit(JSON.parse(storedLessonUnit));
		if (storedUnitStep) setUnitStep(JSON.parse(storedUnitStep));
		if (storedDifficultyLevel)
			setDifficultyLevel(JSON.parse(storedDifficultyLevel));
	}, []);
	console.log(
		'schoolClass',
		schoolClass,
		'lessonUnit',
		lessonUnit,
		'difficultyLevel',
		difficultyLevel
	);

	useEffect(() => {
		const handleFilterChange = () => {
			let tempFilter = allUsersStatisticsList;
			if (schoolClass) {
				tempFilter = tempFilter.filter(el => el.schoolClass === schoolClass);
				const uniqTempListLessonUnit = [
					...new Set(tempFilter.map(el => el.lessonUnit)),
				];
				setListLessonUnit(uniqTempListLessonUnit);
				localStorage.setItem('schoolClass', JSON.stringify(schoolClass));
				localStorage.setItem('lessonUnit', JSON.stringify(''));
				localStorage.setItem('unitStep', JSON.stringify(''));
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

			setFilterAllUsersStatisticsList(tempFilter);
		};

		handleFilterChange();
	}, [
		allUsersStatisticsList,
		schoolClass,
		lessonUnit,
		unitStep,
		difficultyLevel,
	]);

	if (currentUsersFilterStatisticsList.length === 0) {
		return <Loading />;
	}
	return (
		<div className='container mx-auto px-4 p-8 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<h1 className='text-4xl text-center font-bold mb-4'>Статистика</h1>
			<h3 className='text-2xl text-center font-bold mb-4'>Английский</h3>

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
							return setSchoolClass(2), setLessonUnit(''), setUnitStep('');
						},
					},
					{
						label: 'Класс: 3',
						onClick: () => {
							return setSchoolClass(3), setLessonUnit(''), setUnitStep('');
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
					...listLessonUnit.map((el: number | '') => ({
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
					unitStep !== '' ? `Выбран шаг: ${unitStep.toString()}` : 'Выбрать шаг'
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
					...listUnitStep.map((el: number | '') => ({
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
						onClick: () => {
							return (
								setDifficultyLevel(1),
								localStorage.setItem(
									'difficultyLevelEnglish',
									JSON.stringify(1)
								)
							);
						},
					},
					{
						label: 'Уровень 2',
						onClick: () => {
							return (
								setDifficultyLevel(2),
								localStorage.setItem(
									'difficultyLevelEnglish',
									JSON.stringify(2)
								)
							);
						},
					},
					{
						label: 'Уровень 3',
						onClick: () => {
							return (
								setDifficultyLevel(3),
								localStorage.setItem(
									'difficultyLevelEnglish',
									JSON.stringify(3)
								)
							);
						},
					},
				]}
			/>

			<div className='w-full'>
				<div className='flex flex-col space-y-4 w-full'>
					{error ? (
						<div className='text-center py-4 text-red-500'>
							Ошибка загрузки слов.
						</div>
					) : (
						filterAllUsersStatisticsList.map((el, index) => (
							<div
								key={`${el.createdAt}-${index}`}
								className='border p-4 rounded-lg grid grid-cols-2 gap-4 place-content-center bg-gray-200 shadow-md w-full h-full'
							>
								<div className='text-2xl font-bold break-words overflow-hidden text-ellipsis'>
									{el.schoolClass}
								</div>
								<div className='text-2xl text-gray-600 break-words overflow-hidden text-ellipsis'>
									{el.lessonUnit}
								</div>
								<div className='flex items-end text-2xl text-gray-400 break-words overflow-hidden text-ellipsis h-12'>
									{el.unitStep}
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
