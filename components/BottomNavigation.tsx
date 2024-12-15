'use client'; // Обязательно указывайте 'use client' для этого компонента

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Импортируем необходимые хуки
import Link from 'next/link';

export default function BottomNavigation() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const pathname = usePathname(); // Получаем текущий путь

	// Используем useEffect для отслеживания завершения навигации
	useEffect(() => {
		// Когда переход завершен (новый путь), сбрасываем загрузку в false
		const handleRouteChange = async () => {
			// Ждем 1 секунду перед изменением статуса
			await new Promise(resolve => setTimeout(resolve, 500));
			setLoading(false);
		};

		// В App Router нужно следить за изменениями маршрута с помощью router.push и других методов
		router.push(pathname); // Переход к текущему пути
		// Очистка хука не требуется, так как мы используем push
		handleRouteChange();
	}, [pathname]); // Зависимость от текущего пути

	return (
		<div>
			<div className='btm-nav bg-gray-800'>
				{/* Кнопка назад */}
				<button
					className='hover:bg-gray-700'
					onClick={() => {
						setLoading(true);
						router.back();
					}}
				>
					<>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-5 w-5 text-gray-400'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M15 19l-7-7 7-7'
							/>
						</svg>
						<span
							className={
								loading
									? 'loading loading-spinner text-gray-400'
									: 'btm-nav-label text-gray-400'
							}
						>
							Назад
						</span>
					</>
				</button>

				{/* Кнопка "Домой" */}
				<Link
					href='/'
					className='hover:bg-gray-700'
					onClick={() => {
						if (pathname !== '/') {
							setLoading(true);
						}
					}}
				>
					<>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-5 w-5 text-gray-400'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
							/>
						</svg>
						<span
							className={
								loading
									? 'loading loading-spinner text-gray-400'
									: 'btm-nav-label text-gray-400'
							}
						>
							Домой
						</span>
					</>
				</Link>

				{/* Кнопка "Статистика" */}
				<Link
					href='/statistics'
					className='hover:bg-gray-700'
					onClick={() => {
						if (pathname !== '/statistics') {
							setLoading(true);
						} // Устанавливаем loading в true при клике на ссылку
					}}
				>
					<>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-5 w-5 text-gray-400'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
							/>
						</svg>
						<span
							className={
								loading
									? 'loading loading-spinner text-gray-400'
									: 'btm-nav-label text-gray-400'
							}
						>
							Статистика
						</span>
					</>
				</Link>
			</div>
		</div>
	);
}
