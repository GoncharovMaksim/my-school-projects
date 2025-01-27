'use client';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
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

interface MathStatisticsProps {
	minTimeSpent: boolean;
	operatorFromSettings: string;
	difficultyLevelFromSettings: number;
}

export default function MathStatisticsToday({
	minTimeSpent,
	operatorFromSettings,
	difficultyLevelFromSettings,
}: MathStatisticsProps) {
	const dispatch = useDispatch<AppDispatch>();
	const isLoading = useSelector((state: RootState) => state.mathStat.loading);
	const error = useSelector((state: RootState) => state.mathStat.error);
	const allUsersStatisticsList = useSelector(
		(state: RootState) => state.mathStat.mathStatList
	);

	const [filterAllUsersStatisticsList, setFilterAllUsersStatisticsList] =
		useState<MathStat[]>([]);
	const [operator, setOperator] = useState(operatorFromSettings || '');
	const [idSelectedUser, setIdSelectedUser] = useState<string | ''>('');

	const [listIdSelectedUser, setListIdSelectedUser] = useState<(string | '')[]>(
		[]
	);
	const [difficultyLevel, setDifficultyLevel] = useState<number | string>(
		difficultyLevelFromSettings || ''
	);
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
		const storedDifficultyLevel = localStorage.getItem('difficultyLevel');
		const storedOperator = localStorage.getItem('operator');

		//const storedIdSelectedUser = localStorage.getItem('idSelectedUser');

		if (storedOperator) setOperator(storedOperator);
		if (storedDifficultyLevel)
			setDifficultyLevel(JSON.parse(storedDifficultyLevel));
		// if (storedIdSelectedUser)
		// 	setIdSelectedUser(JSON.parse(storedIdSelectedUser));
		if (session?.user?.id) setIdSelectedUser(session?.user?.id);
	}, [session?.user?.id]);

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

	const getOperatorLabel = (operator: string) => {
		switch (operator) {
			case '*':
				return 'Умножение';
			case '+':
				return 'Сложение';
			case '-':
				return 'Вычитание';
			case '/':
				return 'Деление';
			default:
				return '';
		}
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
	);

	const minTimeSpentAllUser = findMinByKey(
		allUsersRightAnswerFilterStatisticsList,
		'timeSpent'
	);

	const timeAllTests = currentUsersFilterStatisticsList.reduce((sum, item) => {
		return sum + item.timeSpent;
	}, 0);

	useEffect(() => {
		if (allUsersStatisticsList.length === 0) {
			dispatch(loadMathStatistics({ today: true }));
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
				tempFilter = tempFilter.filter(
					el => el.operator === getOperatorLabel(operator)
				);

				localStorage.setItem('operator', operator);
			}
			if (difficultyLevel) {
				tempFilter = tempFilter.filter(
					el => el.difficultyLevel === difficultyLevel
				);
				localStorage.setItem(
					'difficultyLevel',
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

	const listRef = React.useRef<HTMLDivElement | null>(null);

	const rowVirtualizer = useWindowVirtualizer({
		count: currentUsersFilterStatisticsList.length,

		estimateSize: () => 250, // Предполагаемый размер строки
		overscan: 5, // Количество строк, которые будут рендериться за пределами видимой области
		scrollMargin: listRef.current?.offsetTop ?? 0,
		gap: 7,
	});

	// const handleClick = async () => {
	// 	setIsLoading(true);
	// 	await dispatch(loadMathStatistics({}));
	// 	setIsLoading(false);
	// };
	const handleClick = async () => {
		dispatch(loadMathStatistics({})); // Загрузка данных
	};
	useEffect(() => {
		setOperator(operatorFromSettings);
		setDifficultyLevel(difficultyLevelFromSettings);
	}, [difficultyLevelFromSettings, operatorFromSettings]);
	if (allUsersStatisticsList.length === 0) {
		return <Loading />;
	}
	if (minTimeSpent) {
		return (
			<div className='container mx-auto px-4 p-8 flex flex-col space-y-6 max-w-screen-sm items-center'>
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
						{minTimeSpentCurrentUser?.timeSpent !== undefined &&
						minTimeSpentAllUser?.timeSpent !== undefined &&
						minTimeSpentCurrentUser?.timeSpent <= minTimeSpentAllUser.timeSpent
							? `${minTimeSpentCurrentUser?.timeSpent} 🥇`
							: minTimeSpentCurrentUser?.timeSpent ?? 'Не доступно'}
					</p>
					<p>
						Рекордное время:
						{` ${minTimeSpentAllUser?.timeSpent ?? 'Не доступно'} ${
							minTimeSpentAllUser?.userNickName
								? `(${minTimeSpentAllUser.userNickName})`
								: ''
						}`}
					</p>
					<p>
						Всего затрачено времени:
						{` ${
							timeAllTests
								? `${
										Math.floor(timeAllTests / 3600) > 0
											? `${Math.floor(timeAllTests / 3600)} ч `
											: ''
								  }${Math.floor((timeAllTests % 3600) / 60)} мин ${Math.floor(
										timeAllTests % 60
								  )} сек`
								: 'Не доступно'
						}
`}
					</p>
				</div>
			</div>
		);
	}
	return (
		<div className='container mx-auto px-4 p-8 flex flex-col space-y-6 max-w-screen-sm items-center'>
			<h1 className='text-4xl text-center font-bold mb-4'>Статистика</h1>
			<h3 className='text-2xl text-center font-bold mb-4'>Математика</h3>
			<DropdownMenu
				key={`operator-${operator}`}
				defaultLabel={operator ? getOperatorLabel(operator) : 'Все действия'} // Отображаем правильную метку
				options={[
					{
						label: 'Умножение',
						onClick: () => setOperator('*'),
					},
					{
						label: 'Сложение',
						onClick: () => setOperator('+'),
					},
					{
						label: 'Вычитание',
						onClick: () => setOperator('-'),
					},
					{
						label: 'Деление',
						onClick: () => setOperator('/'),
					},
					{
						label: 'Все действия',
						onClick: () => {
							setOperator('');
							localStorage.setItem('operator', '');
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
							localStorage.setItem('difficultyLevel', '');
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
			<div>
				<button
					onClick={() => handleClick()}
					disabled={isLoading}
					className='btn btn-outline w-full min-w-[200px]'
				>
					{isLoading ? 'Загрузка...' : 'Загрузить всю статистику'}
				</button>
			</div>

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
					onClick={() => {
						setIsCalendarOpen(true);
						//dispatch(loadMathStatistics({}))
					}} // Показываем календарь
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
					{minTimeSpentCurrentUser?.timeSpent !== undefined &&
					minTimeSpentAllUser?.timeSpent !== undefined &&
					minTimeSpentCurrentUser?.timeSpent <= minTimeSpentAllUser.timeSpent
						? `${minTimeSpentCurrentUser?.timeSpent} 🥇`
						: minTimeSpentCurrentUser?.timeSpent ?? 'Не доступно'}
				</p>
				<p>
					Рекордное время:
					{` ${minTimeSpentAllUser?.timeSpent ?? 'Не доступно'} ${
						minTimeSpentAllUser?.userNickName
							? `(${minTimeSpentAllUser.userNickName})`
							: ''
					}`}
				</p>
				<p>
					Всего затрачено времени:
					{` ${
						timeAllTests
							? `${
									Math.floor(timeAllTests / 3600) > 0
										? `${Math.floor(timeAllTests / 3600)} ч `
										: ''
							  }${Math.floor((timeAllTests % 3600) / 60)} мин ${Math.floor(
									timeAllTests % 60
							  )} сек`
							: 'Не доступно'
					}
`}
				</p>
			</div>
			<div className='w-full'>
				<div className='flex flex-col space-y-4 w-full'>
					{error ? (
						<div className='text-center py-4 text-red-500'>
							Ошибка загрузки статистики.
						</div>
					) : (
						<div>
							<div ref={listRef}>
								<div
									style={{
										height: `${rowVirtualizer.getTotalSize()}px`,
										position: 'relative',
									}}
								>
									{rowVirtualizer.getVirtualItems().map(virtualRow => {
										const el =
											currentUsersFilterStatisticsList[virtualRow.index];
										return (
											<div
												key={`${el.createdAt}-${virtualRow.index}`}
												ref={rowVirtualizer.measureElement}
												data-index={virtualRow.index}
												style={{
													position: 'absolute',
													top: 0,
													left: 0,
													width: '100%',
													height: `auto`,

													transform: `translateY(${
														virtualRow.start -
														rowVirtualizer.options.scrollMargin
													}px)`,
												}}
												className='border p-4 rounded-lg flex flex-col items-center justify-center bg-gray-200 shadow-md w-full h-full '
											>
												<div className='text-2xl font-bold break-words overflow-hidden text-ellipsis'>
													Уровень: {el.difficultyLevel}
												</div>
												<div className='items-start'>
													<div className='flex items-end text-2xl text-gray-400 break-words overflow-hidden text-ellipsis'>
														Оценка: {el.grade}, Время прохождения:{' '}
														{el.timeSpent} с
													</div>
													<div className='flex items-end text-2xl text-gray-400 break-words overflow-hidden text-ellipsis'>
														Процент правильных ответов:{' '}
														{el.percentCorrectAnswer}
													</div>

													<div className='flex items-end text-2xl text-gray-400 break-words overflow-hidden text-ellipsis'>
														Пользователь:{' '}
														{el.userNickName ? el.userNickName : 'Нет ника'}
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
														<div className='collapse-title text-xl font-bold text-center'>
															Вопросы теста:
														</div>

														<div className='collapse-content flex flex-col items-center text-xl space-y-2 min-w-0'>
															{el.results.map(question => (
																<div
																	key={question._id}
																	className='border p-2 rounded-md w-full'
																>
																	<p>Вопрос № {question.taskIndex}</p>
																	<p>Пример: {question.task.question}</p>
																	<p>
																		Правильный ответ:{' '}
																		{question.task.result.toString()}
																	</p>
																	<p>
																		Ответ пользователя:{' '}
																		{question.task.userAnswer}
																	</p>
																	<p>Результат: {question.taskResult}</p>
																</div>
															))}
														</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
//4
