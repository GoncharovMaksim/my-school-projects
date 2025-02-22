import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function HandleBeforeInstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [showInstallPopup, setShowInstallPopup] = useState(false);
	const [isInstalled, setIsInstalled] = useState(false);

	useEffect(() => {
		const handleBeforeInstallPrompt = (e: Event) => {
			const promptEvent = e as BeforeInstallPromptEvent;
			e.preventDefault();
			setDeferredPrompt(promptEvent);
			const storedShowInstallPopup = localStorage.getItem('showInstallPopup');
			if (storedShowInstallPopup) {
				return setShowInstallPopup(JSON.parse(storedShowInstallPopup));
			}
			setShowInstallPopup(true); // Показать всплывающее окно
		};

		const handleAppInstalled = () => {
			setIsInstalled(true);
			setShowInstallPopup(false); // Скрыть окно после установки
		};

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
		window.addEventListener('appinstalled', handleAppInstalled);

		return () => {
			window.removeEventListener(
				'beforeinstallprompt',
				handleBeforeInstallPrompt
			);
			window.removeEventListener('appinstalled', handleAppInstalled);
		};
	}, []);

	const handleInstallClick = async () => {
		if (deferredPrompt) {
			await deferredPrompt.prompt();
			const choice = await deferredPrompt.userChoice;
			if (choice.outcome === 'accepted') {
				console.log('PWA установлено пользователем');
				setShowInstallPopup(false);
			} else {
				console.log('Пользователь отказался от установки');
				setShowInstallPopup(false);
			}
			setDeferredPrompt(null);
		}
	};
	const handleClosePopup = () => {
		setShowInstallPopup(false);
		localStorage.setItem('showInstallPopup', JSON.stringify(false));
	};
	if (!isInstalled && deferredPrompt && !showInstallPopup)
		return (
			<div className='mt-4'>
				<button
					className='btn btn-outline min-w-[200px]'
					onClick={handleInstallClick}
				>
					Установить приложение
				</button>
			</div>
		);
	return (
		<div>
			{!isInstalled && deferredPrompt && showInstallPopup && (
				<div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg text-center'>
						<h2 className='text-xl font-bold mb-4'>
							Хотите установить приложение?
						</h2>
						<div className='flex justify-center gap-4'>
							<button className='btn btn-outline' onClick={handleInstallClick}>
								Установить
							</button>
							<button className='btn btn-outline' onClick={handleClosePopup}>
								Позже
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
