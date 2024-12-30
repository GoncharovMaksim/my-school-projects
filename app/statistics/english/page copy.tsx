'use client';

import { useEffect, useState } from 'react';
import DropdownMenu from '@/components/DropdownMenu';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import Loading from '../loading';
import { loadEnglishStatistics } from './loadEnglishStatistics';

import { EnglishStat } from '@/types/englishStat';
import { useSession } from 'next-auth/react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import { ru } from 'date-fns/locale';

registerLocale('ru', ru);

export default function EnglishStatistics() {
	const dispatch = useDispatch<AppDispatch>();
	const error = useSelector((state: RootState) => state.englishStat.error);
	const allUsersStatisticsList = useSelector(
		(state: RootState) => state.englishStat.englishStatList
	);

	const [filterAllUsersStatisticsList, setFilterAllUsersStatisticsList] =
		useState<EnglishStat[]>([]);
	const [schoolClass, setSchoolClass] = useState<number | ''>('');
	const [lessonUnit, setLessonUnit] = useState<number | ''>('');
	const [unitStep, setUnitStep] = useState<number | ''>('');
	const [idSelectedUser, setIdSelectedUser] = useState<string | ''>('');

	const [listLessonUnit, setListLessonUnit] = useState<(number | '')[]>([]);
	const [listUnitStep, setListUnitStep] = useState<(number | '')[]>([]);
	const [listIdSelectedUser, setListIdSelectedUser] = useState<(string | '')[]>(
		[]
	);
	const [difficultyLevel, setDifficultyLevel] = useState<number>(1);
	const { data: session } = useSession();

	const [startDate, setStartDate] = useState<Date | undefined>(new Date()); // startDate теперь может быть Date или undefined
	const [endDate, setEndDate] = useState<Date | undefined>(new Date()); // endDate теперь может быть Date или undefined
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	const handleConfirm = () => {
		setIsCalendarOpen(false); // Скрываем календарь
	};

	const [
		currentUsersFilterStatisticsList,
		setCurrentUsersFilterStatisticsList,
	] = useState<EnglishStat[]>([]);

	useEffect(() => {
		function selectedUserFilterChange() {
			let tempFilter = filterAllUsersStatisticsList;
			if (idSelectedUser) {
				tempFilter = tempFilter.filter(el => el.userId === idSelectedUser);
				localStorage.setItem('idSelectedUser', JSON.stringify(idSelectedUser));
			}

			setCurrentUsersFilterStatisticsList(tempFilter);

			const uniqTempListUserId = [
				...new Set(allUsersStatisticsList.map(el => el.userId)),
			];

			setListIdSelectedUser(uniqTempListUserId);
		}

		if (session?.user?.isAdmin === true) {
			selectedUserFilterChange();
		} else {
			setCurrentUsersFilterStatisticsList(
				filterAllUsersStatisticsList.filter(
					el => el.userId === session?.user?.id
				)
			);
			localStorage.setItem('idSelectedUser', JSON.stringify(''));
		}
	}, [
		allUsersStatisticsList,
		filterAllUsersStatisticsList,
		idSelectedUser,
		session?.user?.id,
		session?.user?.isAdmin,
	]);

	const currentUsersRightAnswerFilterStatisticsList =
		currentUsersFilterStatisticsList.filter(el => el.grade === 5);
	const allUsersRightAnswerFilterStatisticsList =
		filterAllUsersStatisticsList.filter(el => el.grade === 5);

	const findMinByKey = <T extends EnglishStat>(
		array: T[],
		key: keyof T
	): T | undefined => {
		return array.length
			? array.reduce((min, obj) => (obj[key] < min[key] ? obj : min))
			: undefined;
	};

	const minTimeSpentCurrentUser = findMinByKey(
		currentUsersRightAnswerFilterStatisticsList,
		'timeSpent'
	)?.timeSpent;

	const minTimeSpentAllUser = findMinByKey(
		allUsersRightAnswerFilterStatisticsList,
		'timeSpent'
	)?.timeSpent;

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

		const storedIdSelectedUser = localStorage.getItem('idSelectedUser');

		if (storedSchoolClass) setSchoolClass(JSON.parse(storedSchoolClass));
		if (storedLessonUnit) setLessonUnit(JSON.parse(storedLessonUnit));
		if (storedUnitStep) setUnitStep(JSON.parse(storedUnitStep));
		if (storedDifficultyLevel)
			setDifficultyLevel(JSON.parse(storedDifficultyLevel));
		if (storedIdSelectedUser)
			setIdSelectedUser(JSON.parse(storedIdSelectedUser));
	}, []);

	useEffect(() => {
		const handleFilterChange = () => {
			let tempFilter = allUsersStatisticsList;

			if (startDate && endDate) {
				startDate.setHours(0, 0, 0, 0);
				endDate.setHours(0, 0, 0, 0);

				tempFilter = tempFilter.filter(el => {
					const elDate = new Date(el.createdAt);
					elDate.setHours(0, 0, 0, 0);
					return elDate >= startDate && elDate <= endDate;
				});
			}

			if (schoolClass) {
				tempFilter = tempFilter.filter(el => el.schoolClass === schoolClass);
				const uniqTempListLessonUnit = [
					...new Set(tempFilter.map(el => el.lessonUnit)),
				].sort((a, b) => {
					const numA = a === '' ? Infinity : a;
					const numB = b === '' ? Infinity : b;
					return numA - numB;
				});

				setListLessonUnit(uniqTempListLessonUnit);
				localStorage.setItem('schoolClass', JSON.stringify(schoolClass));
				localStorage.setItem('lessonUnit', JSON.stringify(''));
				localStorage.setItem('unitStep', JSON.stringify(''));
			}

			if (lessonUnit) {
				tempFilter = tempFilter.filter(el => el.lessonUnit === lessonUnit);
				const uniqTempListUnitStep = [
					...new Set(tempFilter.map(el => el.unitStep)),
				].sort((a, b) => {
					const numA = a === '' ? Infinity : a;
					const numB = b === '' ? Infinity : b;
					return numA - numB;
				});
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
		startDate,
		endDate,
		idSelectedUser,
	]);

	if (allUsersStatisticsList.length === 0) {
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
			{session?.user?.isAdmin === true ? (
				<DropdownMenu
					key={idSelectedUser}
					defaultLabel={
						idSelectedUser !== ''
							? `${
									allUsersStatisticsList.find(
										user => user.userId === idSelectedUser
									)?.userName
							  }`
							: 'Пользователь'
					}
					options={[
						{
							label: 'Все пользователи',
							onClick: () => {
								return (
									localStorage.setItem('idSelectedUser', JSON.stringify('')),
									setIdSelectedUser('')
								);
							},
						},
						...listIdSelectedUser.map((el: string | '') => ({
							label: `Выбран пользователь: ${
								allUsersStatisticsList.find(user => user.userId === el)
									?.userName
							}`,
							onClick: () => setIdSelectedUser(el),
						})),
					]}
				/>
			) : (
				''
			)}
			<div className='datepicker-container'>
				<h2>Выберете диапазон дат:</h2>

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
					className='inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-6 py-3 text-xl font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 max-w-[280px] min-w-[280px]'
					placeholder='За все время'
				/>

				{/* Календарь, который отображается только при открытии */}
				{isCalendarOpen && (
					<div className='flex justify-center items-center w-full'>
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
					</div>
				)}
			</div>
			<div>
				{/* <p>Время сервера: {filterDate.toString()}</p> */}
				<p>Тестов пройдено: {currentUsersFilterStatisticsList.length}</p>
				<p>
					Ваше лучшее время:{' '}
					{minTimeSpentCurrentUser !== undefined &&
					minTimeSpentAllUser !== undefined &&
					minTimeSpentCurrentUser <= minTimeSpentAllUser
						? `${minTimeSpentCurrentUser} 🥇`
						: minTimeSpentCurrentUser ?? 'Не доступно'}
				</p>
				<p>Рекордное время: {minTimeSpentAllUser ?? 'Не доступно'}</p>
			</div>
			<div className='w-full'>
				<div className='flex flex-col space-y-4 w-full'>
					{error ? (
						<div className='text-center py-4 text-red-500'>
							Ошибка загрузки статистики.
						</div>
					) : (
						currentUsersFilterStatisticsList.map((el, index) => (
							<div
								key={`${el.createdAt}-${index}`}
								className='border p-4 rounded-lg flex flex-col items-center justify-center bg-gray-200 shadow-md w-full h-full'
							>
								<div className='text-2xl font-bold break-words overflow-hidden text-ellipsis'>
									Класс: {el.schoolClass ? el.schoolClass : 'все'}, Урок:{' '}
									{el.lessonUnit ? el.lessonUnit : 'все'}, Шаг:{' '}
									{el.unitStep ? el.unitStep : 'все'}, Уровень:{' '}
									{el.difficultyLevel}
								</div>
								<div className='items-start '>
									<div className='flex items-end text-2xl text-gray-400 break-words overflow-hidden text-ellipsis '>
										Оценка: {el.grade}, Время прохождения: {el.timeSpent} с
									</div>
									<div className='flex items-end text-2xl text-gray-400 break-words overflow-hidden text-ellipsis'>
										Процент правильных ответов: {el.percentCorrectAnswer}
									</div>
									<div className='flex items-end text-2xl text-gray-400 break-words overflow-hidden text-ellipsis'>
										Дата и время:{' '}
										{new Date(el.createdAt).toLocaleString('ru-RU', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
											second: '2-digit',
										})}
									</div>
								</div>
								<div className='flex flex-col items-center justify-center text-2xl text-gray-400 break-words overflow-hidden text-ellipsis'>
									<div className='collapse collapse-arrow bg-base-200 overflow-visible'>
										<input type='checkbox' name='my-accordion-2' />
										<div className='collapse-title text-xl font-bold text-center '>
											Вопросы теста:
										</div>

										<div className='collapse-content flex flex-col items-center text-xl space-y-2 min-w-0 '>
											{el.results.map(el => {
												return (
													<div
														key={el._id}
														className='border p-2 rounded-md w-full'
													>
														{' '}
														<p>Вопрос № {el.taskIndex}</p>
														<p>Слово: {el.task.question} </p>
														<p>
															Правильный ответ: {el.task.rightAnswer.toString()}
														</p>
														<p>Ответ пользователя: {el.task.userAnswer}</p>
														<p>Результат: {el.taskResult}</p>
													</div>
												);
											})}
										</div>
									</div>
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
