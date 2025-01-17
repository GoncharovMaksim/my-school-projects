'use client';
import Link from 'next/link';

import { loadEnglishStatistics } from './statistics/english/loadEnglishStatistics';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loadWords } from './english/components/loadWords';
import { AppDispatch } from '@/lib/store';
import { loadMathStatistics } from './statistics/math/loadMathStatistics';

export default function Home() {
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		dispatch(loadEnglishStatistics());
		dispatch(loadWords());
		dispatch(loadMathStatistics());
	}, [dispatch]);
	return (
		//<div className='bg-gray-100 min-h-screen flex flex-col'>
		<div className='bg-gray-100 min-h-screen flex flex-col '>
			<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
				<header className=''>
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
				</header>
				<main>
					<div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col items-center space-y-8'>
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
						<hr className='my-4 border-black border-2 w-full' />

						<h3
							className='text-3xl text-center font-bold tracking-tight text-gray-900'
							style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
						>
							school112.ru
						</h3>
						{/* <img className='bg-black' src='./images/72.png' alt='' />  */}
						{/* <img src='./112sWWW.svg' alt='Школа 112' /> */}
					</div>

					<hr className='my-4 border-black border-2 w-full' />

					<h3
						className='text-3xl text-center font-bold tracking-tight text-gray-900'
						style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
					>
						school112.ru
					</h3>
				</main>
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
//
