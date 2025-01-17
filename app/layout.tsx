import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import DarkNav from '../components/DarkNav';
import Providers from '../components/Providers';
import BottomNavigation from '@/components/BottomNavigation';
import Head from 'next/head'; // Импортируем Head

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

const rubikDoodleShadow = localFont({
	src: './fonts/RubikDoodleShadow-Regular.ttf',
	variable: '--font-rubik-doodle-shadow',
	weight: '400',
});

export const metadata: Metadata = {
	title: 'Школа112',
	description: 'Проекты для школы',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='ru'>
			<Head>
				<link
					rel='preload'
					href='/fonts/GeistVF.woff'
					as='font'
					type='font/woff'
					crossOrigin='anonymous'
				/>
				<link
					rel='preload'
					href='/fonts/GeistMonoVF.woff'
					as='font'
					type='font/woff'
					crossOrigin='anonymous'
				/>
				<link
					rel='preload'
					href='/fonts/RubikDoodleShadow-Regular.ttf'
					as='font'
					type='font/ttf'
					crossOrigin='anonymous'
				/>
			</Head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${rubikDoodleShadow.variable} antialiased bg-gray-100 min-h-screen flex flex-col`}
			>
				<Providers>
					<DarkNav />
					<main className='flex-1 pb-[60px]'>
						{/* отступ равен высоте меню */}
						{children}
					</main>

					<BottomNavigation />
				</Providers>
			</body>
		</html>
	);
}
