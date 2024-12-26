'use client';
import { EnglishStat } from '@/types/englishStat';
import { useSession } from 'next-auth/react';

export function useFilteredEnglishStatistics(
	allUsersStatisticsList: EnglishStat[] = [], // Исправлено на массив
	filterParam: Partial<EnglishStat>, // Объект с ключами для фильтрации
	currentUser: boolean // Явное указание типа для currentUser
) {
	const { data: session } = useSession();

	// Если пользователь не авторизован или список статистики отсутствует
	if (!session?.user?.id || !Array.isArray(allUsersStatisticsList)) {
		return [];
	}

	// Фильтрация
	return allUsersStatisticsList.filter(el => {
		// Учитываем фильтр параметров
		const matchesFilter =
			!filterParam ||
			Object.entries(filterParam).every(
				([key, value]) => el[key as keyof EnglishStat] === value
			);

		// Учитываем текущего пользователя
		const matchesUser = !currentUser || el.userId === session?.user?.id;

		return matchesFilter && matchesUser;
	});
}
