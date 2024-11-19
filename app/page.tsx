import Link from 'next/link';
import Navbar from './components/Navbar';
import BottomNavigation from './components/BottomNavigation';
import Example from './components/SimpleCentered';
import DarkNav from './components/DarkNav'
export default function Home() {
	return (
		<div className=''>
			<DarkNav />
			
			<Navbar />
		
			<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
				<div>
					<Link href='/english'>
						<button className='btn btn-ghost text-xl'>АНГЛИЙСКИЙ</button>
					</Link>
				</div>
				<div>
					<Link href='/math'>
						<button className='btn btn-outline'>МАТЕМАТИКА</button>
					</Link>
				</div>

				<BottomNavigation />
			</div>
		</div>
	);
}
//
