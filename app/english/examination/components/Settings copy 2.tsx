'use client';

import { useEffect, useState } from 'react';
import { Word } from '@/types/word';
import fetchWords from '../../components/api';
import LoadingBars from '@/components/LoadingBars';
import DropdownMenu from '@/components/DropdownMenu';
import { useSpeaker } from '../../useSpeaker';
import Link from 'next/link';

import { GameProps } from './types';

export default function Settings({ setGameSettings }: GameProps) {
	const [operator, setOperator] = useState('*'); // Значение по умолчанию '*'
	const [difficultyLevel, setDifficultyLevel] = useState(1);
	const [isLoading, setIsLoading] = useState(true); // Флаг загрузки данных

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
				localStorage.setItem('lessonUnit', JSON.stringify(''));
				localStorage.setItem('unitStep', JSON.stringify(''));
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

	// if (isLoading) {
	// 	// Пока идет загрузка данных, показываем индикатор
	// 	return <div>Загрузка...</div>;
	// }

	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<div>Настройки:</div>
			<div className='p-2 flex flex-col items-center space-y-6'>
				<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-full'>
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
									return setSchoolClass(''), setLessonUnit(''), setUnitStep('');
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
	);
}
