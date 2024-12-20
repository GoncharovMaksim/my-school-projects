'use client';
import { useDispatch } from 'react-redux';
import { setEnglishStatList } from '@/lib/features/englishStatSlice';
import { useEffect } from 'react';

export default function LoadEnglishStatistics() {
	const dispatch = useDispatch();

	async function fetchAllUsersStatistics() {
		const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gameStatistics/english`;
		try {
			const response = await fetch(url, { cache: 'no-store' });
			if (!response.ok) {
				throw new Error(`HTTP Error: ${response.status}`);
			}
			return await response.json();
		} catch (error) {
			console.error('Ошибка при получении данных:', error);
			return null;
		}
	}

	useEffect(() => {
		const loadData = async () => {
			const data = await fetchAllUsersStatistics();
			if (data) {
				dispatch(setEnglishStatList(data));
			}
		};

		loadData();
	}, [dispatch]);

	// Возвращаем null, чтобы этот компонент ничего не рендерил
	return null;
}
