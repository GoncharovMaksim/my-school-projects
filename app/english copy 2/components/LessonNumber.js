'use client';
import React, { useState, useEffect } from 'react';
import fetchWords from './api';
import LessonList from './LessonList';
import LessonSelect from './LessonSelect';

function Lesson() {
	const [data, setData] = useState([]);
	const [availableLessons, setAvailableLessons] = useState([]);
	const [availableSteps, setAvailableSteps] = useState([]);
	const [schoolClass, setSchoolClass] = useState(2);
	const [lessonUnit, setLessonUnit] = useState(1);
	const [unitStep, setUnitStep] = useState(1);

	// Инициализация значений из localStorage при монтировании
	useEffect(() => {
		if (typeof window !== 'undefined') {
			setSchoolClass(JSON.parse(localStorage.getItem('schoolClass')) || 2);
			setLessonUnit(JSON.parse(localStorage.getItem('lessonUnit')) || 1);
			setUnitStep(JSON.parse(localStorage.getItem('unitStep')) || 1);
		}
	}, []);

	// Загружаем доступные уроки и шаги при изменении класса или урока
	useEffect(() => {
		const loadAvailableOptions = async () => {
			try {
				const options = await fetchAvailableOptions(schoolClass);
				if (options) {
					setAvailableLessons(options.lessons || []);
					const stepsForCurrentLesson = await fetchStepsForLesson(
						lessonUnit,
						schoolClass
					);
					setAvailableSteps(stepsForCurrentLesson || []);
				}
			} catch (error) {
				console.error('Ошибка при загрузке доступных опций:', error);
			}
		};

		loadAvailableOptions();
	}, [schoolClass, lessonUnit]);

	// Загружаем уроки при изменении фильтров
	useEffect(() => {
		const loadLessons = async () => {
			const filters = { schoolClass, lessonUnit, unitStep };
			try {
				const lessons = await fetchWords(filters);
				setData(lessons);
			} catch (error) {
				console.error('Ошибка при загрузке уроков:', error);
			}
		};

		loadLessons();
	}, [schoolClass, lessonUnit, unitStep]);

	const fetchStepsForLesson = async (lessonUnit, schoolClass) => {
		const response = await fetch(
			`/english/api/steps?lessonUnit=${lessonUnit}&schoolClass=${schoolClass}`
		);
		const steps = await response.json();
		return steps;
	};

	// Сохраняем выбранные опции в localStorage
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('schoolClass', JSON.stringify(schoolClass));
			localStorage.setItem('lessonUnit', JSON.stringify(lessonUnit));
			localStorage.setItem('unitStep', JSON.stringify(unitStep));
		}
	}, [schoolClass, lessonUnit, unitStep]);

	// Очищаем localStorage при изменении schoolClass
	const handleSchoolClassChange = newClass => {
		setSchoolClass(newClass);
		if (typeof window !== 'undefined') {
			localStorage.clear();
		}
	};

	return (
		<div className='Lesson'>
			<LessonSelect
				schoolClass={schoolClass}
				setSchoolClass={handleSchoolClassChange}
				lessonUnit={lessonUnit}
				setLessonUnit={setLessonUnit}
				unitStep={unitStep}
				setUnitStep={setUnitStep}
				availableLessons={availableLessons}
				availableSteps={availableSteps}
			/>
			<LessonList data={data} />
		</div>
	);
}

export default Lesson;
