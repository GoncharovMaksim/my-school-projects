import Link from 'next/link';

export default function Home() {
	return (
		<div className='bg-gray-100 min-h-screen flex flex-col'>
			<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
				<header className=''>
					<div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
						<h1 className='text-3xl text-center font-bold tracking-tight text-gray-900'>
							Школа112 - Лучший проект для помощи ученику
						</h1>
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
						{/* <div>
							<Link href='/englishClient'>
								<button className='btn btn-outline min-w-[200px]'>
									АНГЛИЙСКИЙ НЕ НАЖИМАТЬ
								</button>
							</Link>
						</div> */}
						<div>
							<Link href='/math'>
								<button className='btn btn-outline min-w-[200px]'>
									МАТЕМАТИКА
								</button>
							</Link>
						</div>
					
						<img src='./elka.png' alt='' />
						<img src='./next.svg' alt='' />
					</div>
				</main>
			</div>
		</div>
	);
}
//
