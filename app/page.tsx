import Link from 'next/link';

export default function Home() {
	return (
		<div>
			<Link href='/english'>
				<button>АНГЛИЙСКИЙ</button>
			</Link>
			<div>
				<Link href='/math'>
					<button>МАТЕМАТИКА</button>
				</Link>
			</div>
		</div>
	);
}
//
