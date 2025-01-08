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
			}

			setCurrentUsersFilterStatisticsList(tempFilter);
			const uniqTempListUserId = [
				...new Set(allUsersStatisticsList.map(el => el.userId)),
			];

			setListIdSelectedUser(uniqTempListUserId);
		}

		selectedUserFilterChange();
	}, [allUsersStatisticsList, filterAllUsersStatisticsList, idSelectedUser]);

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
			}
			if (difficultyLevel) {
				tempFilter = tempFilter.filter(
					el => el.difficultyLevel === difficultyLevel
				);
			}
			if (gradeTempList.length > 0) {
				tempFilter = tempFilter.filter(item =>
					gradeTempList.includes(item.grade)
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

	// Инициализация виртуализатора
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
			{/* Фильтры и настройки */}
			<h1 className='text-4xl text-center font-bold mb-4'>Статистика</h1>
			<h3 className='text-2xl text-center font-bold mb-4'>Математика</h3>

			{/* Дропдаун меню и фильтры */}
			<DropdownMenu
				key={`operator-${operator}`}
				defaultLabel={operator ? operator : 'Все действия'}
				options={[
					{ label: 'Умножение', onClick: () => setOperator('Умножение') },
					{ label: 'Сложение', onClick: () => setOperator('Сложение') },
					{ label: 'Вычитание', onClick: () => setOperator('Вычитание') },
					{ label: 'Деление', onClick: () => setOperator('Деление') },
					{ label: 'Все действия', onClick: () => setOperator('') },
				]}
			/>
			<DropdownMenu
				key={`difficultyLevel-${difficultyLevel}`}
				defaultLabel={
					difficultyLevel ? `Уровень ${difficultyLevel}` : 'Все уровни'
				}
				options={[
					{ label: 'Уровень 1', onClick: () => setDifficultyLevel(1) },
					{ label: 'Уровень 2', onClick: () => setDifficultyLevel(2) },
					{ label: 'Уровень 3', onClick: () => setDifficultyLevel(3) },
					{ label: 'Все уровни', onClick: () => setDifficultyLevel('') },
				]}
			/>

			{/* Виртуализированный список */}
			<div ref={parentRef} style={{ height: 500, overflowY: 'auto' }}>
				<div
					style={{
						height: `${rowVirtualizer.getTotalSize()}px`,
						position: 'relative',
					}}
				>
					{rowVirtualizer.getVirtualItems().map(virtualRow => (
						<div
							key={virtualRow.index}
							ref={virtualRow.measureRef}
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								transform: `translateY(${virtualRow.start}px)`,
							}}
						>
							{/* Контент строки */}
							<div className='p-4'>
								<p>
									{currentUsersFilterStatisticsList[virtualRow.index].userName}
								</p>
								{/* Добавьте сюда другие данные, которые хотите отобразить */}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
