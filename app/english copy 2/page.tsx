
import LessonNumber from './components/LessonNumber';

export default function App() {
	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
			<div className='p-8 flex flex-col items-center space-y-6'>
				<h1 className='text-4xl text-center font-bold mb-4'>Английский</h1>

				<LessonNumber />
			</div>
		</div>
	);
}
