import Link from 'next/link';

export default function Home() {
	return (
		<div className=' min-h-screen flex flex-col'>
			<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
				<header className=''>
					<div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
						<h1 className='text-4xl text-center font-bold mb-4 '>Статистика</h1>
					</div>
				</header>
				<main>
					<div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col items-center space-y-8'>
						<div>
							<Link href='statistics/english'>
								<button className='btn btn-outline min-w-[200px]'>
									АНГЛИЙСКИЙ
								</button>
							</Link>
						</div>

						<div>
							<Link href='statistics//math'>
								<button className='btn btn-outline min-w-[200px]'>
									МАТЕМАТИКА
								</button>
							</Link>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
//
