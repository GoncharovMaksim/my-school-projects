import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import DarkNav from './components/DarkNav';
import BottomNavigation from './components/BottomNavigation';
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

export const metadata: Metadata = {
	title: 'Проекты для школы',
	description: 'Помощник в освоении школьной программы',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='ru'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 min-h-screen flex flex-col`}
			>
				<DarkNav />
				<main className='flex-1 pb-[60px]'>
					{/* отступ равен высоте меню */}
					{children}
				</main>
				<BottomNavigation />
			</body>
		</html>
	);
}
//