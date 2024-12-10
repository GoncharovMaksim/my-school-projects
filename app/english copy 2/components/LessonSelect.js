
import React from 'react';

function LessonSelect({
	schoolClass,
	setSchoolClass,
	lessonUnit,
	setLessonUnit,
	unitStep,
	setUnitStep,
	availableLessons,
	availableSteps,
}) {
	return (
		<div>
			<select
				value={schoolClass}
				onChange={e => setSchoolClass(Number(e.target.value))}
			>
				{/* Ваши классы */}
				<option value={2}>Класс 2</option>
				<option value={3}>Класс 3</option>
				{/* Другие классы */}
			</select>

			<select
				value={lessonUnit}
				onChange={e => setLessonUnit(Number(e.target.value))}
			>
				{Array.isArray(availableLessons) &&
					availableLessons.map(lesson => (
						<option key={lesson} value={lesson}>
							Урок {lesson}
						</option>
					))}
			</select>

			<select
				value={unitStep}
				onChange={e => setUnitStep(Number(e.target.value))}
			>
				{Array.isArray(availableSteps) &&
					availableSteps.map(step => (
						<option key={step} value={step}>
							Шаг {step}
						</option>
					))}
			</select>
		</div>
	);
}

export default LessonSelect;
