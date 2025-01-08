'use client';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useState } from 'react';
import DropdownMenu from '@/components/DropdownMenu';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import Loading from '../loading';
import { loadMathStatistics } from './loadMathStatistics';

import { MathStat } from '@/types/mathStat';
import { useSession } from 'next-auth/react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import { ru } from 'date-fns/locale';
import React from 'react';

registerLocale('ru', ru);

export default function MathStatistics() {
	const dispatch = useDispatch<AppDispatch>();
	const error = useSelector((state: RootState) => state.mathStat.error);
	const allUsersStatisticsList = useSelector(
		(state: RootState) => state.mathStat.mathStatList
	);

	const [filterAllUsersStatisticsList, setFilterAllUsersStatisticsList] =
		useState<MathStat[]>([]);
	const [operator, setOperator] = useState('');
	const [idSelectedUser, setIdSelectedUser] = useState<string | ''>('');

	const [listIdSelectedUser, setListIdSelectedUser] = useState<(string | '')[]>(
		[]
	);
	const [difficultyLevel, setDifficultyLevel] = useState<number | string>();
	const { data: session } = useSession();

	const [startDate, setStartDate] = useState<Date | undefined>(new Date());
	const [endDate, setEndDate] = useState<Date | undefined>(new Date());
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	const handleConfirm = () => {
		setIsCalendarOpen(false);
	};

	const [
		currentUsersFilterStatisticsList,
		setCurrentUsersFilterStatisticsList,
	] = useState<MathStat[]>([]);

	useEffect(() => {
		const storedDifficultyLevel = localStorage.getItem('difficultyLevelMath');
		const storedOperator = localStorage.getItem('operatorMath');

		const storedIdSelectedUser = localStorage.getItem('idSelectedUser');

		if (storedOperator) setOperator(JSON.parse(storedOperator));
		if (storedDifficultyLevel)
			setDifficultyLevel(JSON.parse(storedDifficultyLevel));
		if (storedIdSelectedUser)
			setIdSelectedUser(JSON.parse(storedIdSelectedUser));
	}, []);

	const [gradeStates, setGradeStates] = useState<boolean[]>([
		true,
		true,
		true,
		true,
		true,
	]);

	const toggleStar = (index: number) => {
		const newStates = [...gradeStates];
		newStates[index] = !newStates[index];
		setGradeStates(newStates);
	};

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

	const findMinByKey = <T extends MathStat>(
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
			dispatch(loadMathStatistics());
		}
	}, [dispatch, allUsersStatisticsList.length]);

	useEffect(() => {
		const handleFilterChange = () => {
			let tempFilter = allUsersStatisticsList;
			const gradeTempList = gradeStates
				.map((el, index) => (el === true ? index + 1 : null))
				.filter(value => value !== null);

			if (startDate && endDate) {
				startDate.setHours(0, 0, 0, 0);
				endDate.setHours(0, 0, 0, 0);

				tempFilter = tempFilter.filter(el => {
					const elDate = new Date(el.createdAt);
					elDate.setHours(0, 0, 0, 0);
					return elDate >= startDate && elDate <= endDate;
				});
			}

			if (operator) {
				tempFilter = tempFilter.filter(el => el.operator === operator);

				localStorage.setItem('operatorMath', JSON.stringify(operator));
			}
			if (difficultyLevel) {
				tempFilter = tempFilter.filter(
					el => el.difficultyLevel === difficultyLevel
				);
				localStorage.setItem(
					'difficultyLevelMath',
					JSON.stringify(difficultyLevel)
				);
			}
			if (gradeTempList.length > 0) {
				tempFilter = tempFilter.filter(
					item => gradeTempList.includes(item.grade) // Проверяем, есть ли grade в tempList
				);
			}

			setFilterAllUsersStatisticsList(tempFilter);
		};

		handleFilterChange();
	}, [
		allUsersStatisticsList,
		difficultyLevel,
		startDate,
		endDate,
		idSelectedUser,
		operator,
		gradeStates,
	]);




	const parentRef = React.useRef<HTMLDivElement>(null);

	const rowVirtualizer = useVirtualizer({
		count: currentUsersFilterStatisticsList.length,
		getScrollElement: () => parentRef.current!,
		estimateSize: () => 100, // Предполагаемый размер строки
		overscan: 10, // Количество строк, которые будут рендериться за пределами видимой области
	});
	
	if (allUsersStatisticsList.length === 0) {
		return <Loading />;
	}
	return (
		<div className='container mx-auto px-4 p-8 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<h1 className='text-4xl text-center font-bold mb-4'>Статистика</h1>
			<h3 className='text-2xl text-center font-bold mb-4'>Математика</h3>
			<DropdownMenu
				key={`operator-${operator}`}
				defaultLabel={operator ? operator : 'Все действия'} // Отображаем правильную метку
				options={[
					{
						label: 'Умножение',
						onClick: () => setOperator('Умножение'),
					},
					{
						label: 'Сложение',
						onClick: () => setOperator('Сложение'),
					},
					{
						label: 'Вычитание',
						onClick: () => setOperator('Вычитание'),
					},
					{
						label: 'Деление',
						onClick: () => setOperator('Деление'),
					},
					{
						label: 'Все действия',
						onClick: () => {
							setOperator('');
							localStorage.setItem('operatorMath', JSON.stringify(''));
						},
					},
				]}
			/>
			<DropdownMenu
				key={`difficultyLevel-${difficultyLevel}`}
				defaultLabel={
					difficultyLevel ? `Уровень ${difficultyLevel}` : 'Все уровни'
				}
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
					{
						label: 'Все уровни',
						onClick: () => {
							setDifficultyLevel('');
							localStorage.setItem('difficultyLevelMath', JSON.stringify(''));
						},
					},
				]}
			/>

			{session?.user?.isAdmin === true ? (
				<DropdownMenu
					key={`idSelectedUser-${idSelectedUser}`}
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
							label: `${
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
				<h2>Выберите оценки:</h2>
				<div className='flex space-x-4'>
					{gradeStates.map((isSelected, index) => (
						<button
							key={index}
							className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 
                      ${
												isSelected
													? 'bg-gray-500 text-white border-gray-700'
													: 'bg-gray-200 text-black border-gray-300'
											}`}
							onClick={() => toggleStar(index)}
						>
							{index + 1}
						</button>
					))}
				</div>
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
						<div ref={parentRef} style={{ height: 500, overflowY: 'auto' }}>
							<div>
								{rowVirtualizer.getVirtualItems().map(virtualRow => (
									<div key={virtualRow.index}>
										{/* Контент строки */}
										<div className='p-4'>
											<p>
												{
													currentUsersFilterStatisticsList[virtualRow.index]
														.userName
												}
											</p>
											{
												currentUsersFilterStatisticsList[virtualRow.index]
													.grade
											}
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
//4
