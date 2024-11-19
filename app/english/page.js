import './styles/App.css';
import LessonNumber from './components/LessonNumber';

export default function Home() {
	return (
		<div className='App'>
			<header className='App-header'>
				<h1>English</h1>
			</header>
			<LessonNumber />
		</div>
	);
}
