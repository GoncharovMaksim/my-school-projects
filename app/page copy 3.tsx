'use client';
import Link from 'next/link';
import { loadEnglishStatistics } from './statistics/english/loadEnglishStatistics';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { loadWords } from './english/components/loadWords';
import { AppDispatch } from '@/lib/store';
import { loadMathStatistics } from './statistics/math/loadMathStatistics';

// Определяем интерфейс для события beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

import {
	subscribeUser,
	unsubscribeUser,
	sendNotification,
} from './pushNotification/actions';

function urlBase64ToUint8Array(base64String: string) {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

function PushNotificationManager() {
	const [isSupported, setIsSupported] = useState(false);
	const [subscription, setSubscription] = useState<PushSubscription | null>(
		null
	);
	const [message, setMessage] = useState('');

	useEffect(() => {
		if ('serviceWorker' in navigator && 'PushManager' in window) {
			setIsSupported(true);
			registerServiceWorker();
		}
	}, []);

	async function registerServiceWorker() {
		const registration = await navigator.serviceWorker.register('/sw.js', {
			scope: '/',
			updateViaCache: 'none',
		});
		const sub = await registration.pushManager.getSubscription();
		setSubscription(sub);
	}

	async function subscribeToPush() {
		const registration = await navigator.serviceWorker.ready;
		const sub = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(
				process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
			),
		});
		setSubscription(sub);
		const serializedSub = JSON.parse(JSON.stringify(sub));
		await subscribeUser(serializedSub);
	}

	async function unsubscribeFromPush() {
		await subscription?.unsubscribe();
		setSubscription(null);
		await unsubscribeUser();
	}

	async function sendTestNotification() {
		if (subscription) {
			await sendNotification(message);
			setMessage('');
		}
	}

	if (!isSupported) {
		return <p>Push notifications are not supported in this browser.</p>;
	}

	return (
		<div>
			<h3>Push Notifications</h3>
			{subscription ? (
				<>
					<p>You are subscribed to push notifications.</p>
					<button onClick={unsubscribeFromPush}>Unsubscribe</button>
					<input
						type='text'
						placeholder='Enter notification message'
						value={message}
						onChange={e => setMessage(e.target.value)}
					/>
					<button onClick={sendTestNotification}>Send Test</button>
				</>
			) : (
				<>
					<p>You are not subscribed to push notifications.</p>
					<button onClick={subscribeToPush}>Subscribe</button>
				</>
			)}
		</div>
	);
}

function InstallPrompt() {
	const [isIOS, setIsIOS] = useState(false);
	const [isStandalone, setIsStandalone] = useState(false);

	useEffect(() => {
		setIsIOS(
			/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
		);

		setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
	}, []);

	if (isStandalone) {
		return null; // Don't show install button if already installed
	}

	return (
		<div>
			<h3>Install App</h3>
			<button>Add to Home Screen</button>
			{isIOS && (
				<p>
					To install this app on your iOS device, tap the share button
					<span role='img' aria-label='share icon'>
						{' '}
						⎋{' '}
					</span>
					and then "Add to Home Screen"
					<span role='img' aria-label='plus icon'>
						{' '}
						➕{' '}
					</span>
					.
				</p>
			)}
		</div>
	);
}

export default function Page() {
	return (
		<div>
			<PushNotificationManager />
			<InstallPrompt />
		</div>
	);
}
export default function Home() {
	const dispatch = useDispatch<AppDispatch>();
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null); // Состояние для события установки
	const [isInstalled, setIsInstalled] = useState(false); // Для отслеживания установки

	useEffect(() => {
		dispatch(loadEnglishStatistics());
		dispatch(loadWords());
		dispatch(loadMathStatistics());

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
