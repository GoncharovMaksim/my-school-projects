'use client';
import Link from 'next/link';
import { loadEnglishStatistics } from './statistics/english/loadEnglishStatistics';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { loadWords } from './english/components/loadWords';
import { AppDispatch } from '@/lib/store';
import { loadMathStatistics } from './statistics/math/loadMathStatistics';
import { usePushSubscription } from './pushNotification/usePushSubscription';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/types/userSession';

// Определяем интерфейс для события beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function Home() {
	const dispatch = useDispatch<AppDispatch>();
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null); // Состояние для события установки
	const [isInstalled, setIsInstalled] = useState(false); // Для отслеживания установки
	const { subscribeToPush } = usePushSubscription();

	useEffect(() => {
		dispatch(loadEnglishStatistics());
		dispatch(loadWords());
		dispatch(loadMathStatistics({ today: true }));

		// Слушаем событие `beforeinstallprompt`
		const handleBeforeInstallPrompt = (e: Event) => {
			const promptEvent = e as BeforeInstallPromptEvent;
			e.preventDefault();
			setDeferredPrompt(promptEvent); // Сохраняем событие
		};

		// Слушаем событие `appinstalled`
		const handleAppInstalled = () => {
			setIsInstalled(true); // Приложение установлено
		};

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
		window.addEventListener('appinstalled', handleAppInstalled);

		// Очистка слушателей при размонтировании
		return () => {
			window.removeEventListener(
				'beforeinstallprompt',
				handleBeforeInstallPrompt
			);
			window.removeEventListener('appinstalled', handleAppInstalled);
		};
	}, [dispatch]);

	// Обработчик клика для кнопки установки
	const handleInstallClick = async () => {
		if (deferredPrompt) {
			await deferredPrompt.prompt(); // Показываем диалог установки
			const choice = await deferredPrompt.userChoice;
			if (choice.outcome === 'accepted') {
				console.log('PWA установлено пользователем');
			} else {
				console.log('Пользователь отказался от установки');
			}
			setDeferredPrompt(null); // Сбрасываем сохранённое событие
		}
	};

	const { data: session } = useSession() as { data: UserSession | null };

	useEffect(() => {
		if (!session?.user?.id) {
			return;
		}
		if (localStorage.getItem('notificationsDisabled') === null) {
			localStorage.setItem('notificationsDisabled', 'false'); // По умолчанию автоподписка активна
		}
		const isNotificationsDisabled =
			localStorage.getItem('notificationsDisabled') === 'true';
		if (isNotificationsDisabled) {
			console.log('Автоподписка отключена.');
		} else {
			subscribeToPush();
			console.log('Автоподписка активна.');
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session?.user?.id]);

	return (
		<div className='bg-gray-100 min-h-screen flex flex-col '>
			<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
				<div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 items-center'>
					<h1
						className='text-5xl text-center font-bold tracking-tight text-gray-900'
						style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
					>
						ШКОЛА 112
					</h1>

					<hr className='my-4 border-black border-2' />

					<h3
						className='text-3xl text-center font-bold tracking-tight text-gray-900'
						style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
					>
						Проект для помощи ученику
					</h3>
				</div>

				<div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col items-center space-y-8'>
					{!isInstalled && deferredPrompt && (
						<div className='mt-4'>
							<button
								className='btn btn-outline min-w-[200px]'
								onClick={handleInstallClick}
							>
								Установить приложение
							</button>
						</div>
					)}

					<div>
						<Link href='/english'>
							<button className='btn btn-outline min-w-[200px]'>
								АНГЛИЙСКИЙ
							</button>
						</Link>
					</div>

					<div>
						<Link href='/math'>
							<button className='btn btn-outline min-w-[200px]'>
								МАТЕМАТИКА
							</button>
						</Link>
					</div>
				</div>

				<hr className='my-4 border-black border-2 w-full' />

				<h3
					className='text-3xl text-center font-bold tracking-tight text-gray-900'
					style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
				>
					school112.ru
				</h3>
			</div>
		</div>
	);
}
//348
