'use client'; // Указывает, что код будет выполняться на клиентской стороне

import { EnglishStat } from '@/types/englishStat'; // Импортируем тип данных для статистики
import { useSession } from 'next-auth/react'; // Импортируем хук для работы с сессией пользователя

// Хук, который фильтрует список статистики на основе заданных параметров фильтрации и текущего пользователя
export function useFilteredEnglishStatistics(
	allUsersStatisticsList: EnglishStat[] = [], // Список статистики пользователей (по умолчанию пустой массив)
	filterParam: Partial<EnglishStat>, // Параметры для фильтрации (объект с неполными данными)
	currentUser: boolean // Флаг, указывающий, фильтровать ли только для текущего пользователя
) {
	// Получаем текущую сессию пользователя с помощью хука useSession
	const { data: session } = useSession();

	// Проверяем, авторизован ли пользователь, и существует ли список статистики
	if (!session?.user?.id || !Array.isArray(allUsersStatisticsList)) {
		// Если пользователь не авторизован или статистика не передана, возвращаем пустой массив
		return [];
	}

	// Выполняем фильтрацию статистики по заданным параметрам
	return allUsersStatisticsList.filter(el => {
		// Шаг 1: Проверка на соответствие фильтру по переданным параметрам
		const matchesFilter =
			// Если фильтр не передан, принимаем все элементы
			!filterParam ||
			// Для каждого ключа и значения в filterParam проверяем, что соответствующее значение в элементе статистики совпадает
			Object.entries(filterParam).every(
				([key, value]) => el[key as keyof EnglishStat] === value
			);

		// Шаг 2: Проверка на соответствие текущему пользователю
		const matchesUser = !currentUser || el.userId === session?.user?.id;

		// Возвращаем элемент, если он проходит оба условия: фильтр и проверка на текущего пользователя
		return matchesFilter && matchesUser;
	});
}
